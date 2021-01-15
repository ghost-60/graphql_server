const axios = require("axios");
const uuid = require("uuid");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = require("graphql");

// Launch Type
const DessertType = new GraphQLObjectType({
  name: "Dessert",
  fields: () => ({
    id: { type: GraphQLInt },
    dessert: { type: GraphQLString },
    nutritionInfo: { type: NutritionType },
    reset: { type: GraphQLBoolean },
    visible: { type: GraphQLBoolean }
  })
});

// Rocket Type
const NutritionType = new GraphQLObjectType({
  name: "Nutrition",
  fields: () => ({
    calories: { type: GraphQLInt },
    fat: { type: GraphQLInt },
    carb: { type: GraphQLInt },
    protein: { type: GraphQLInt }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    desserts: {
      type: new GraphQLList(DessertType),
      resolve(parent, args) {
        return axios
          .get("https://sleepy-depths-16388.herokuapp.com/data")
          .then((res) => {
            return res.data;
          });
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDessert: {
      type: DessertType,
      args: {
        dessert: { type: new GraphQLNonNull(GraphQLString) },
        calories: { type: new GraphQLNonNull(GraphQLInt) },
        fat: { type: new GraphQLNonNull(GraphQLInt) },
        carb: { type: new GraphQLNonNull(GraphQLInt) },
        protein: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        return axios
          .post("https://sleepy-depths-16388.herokuapp.com/data", {
            dessert: args.dessert,
            nutritionInfo: {
              calories: args.calories,
              fat: args.fat,
              carb: args.carb,
              protein: args.calories
            },
            reset: false,
            visible: true
          })
          .then((res) => res.data);
      }
    },
    deleteDessert: {
      type: DessertType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        axios
          .delete("https://sleepy-depths-16388.herokuapp.com/data/" + args.id)
          .then((res) => {
            return res.data;
          });
      }
    },
    makeInvisible: {
      type: DessertType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        axios
          .patch("https://sleepy-depths-16388.herokuapp.com/data/" + args.id, {
            visible: false
          })
          .then((res) => {
            return res.data;
          });
      }
    },
    updateDessertVisibility: {
      type: new GraphQLList(DessertType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        axios
          .patch("https://sleepy-depths-16388.herokuapp.com/data/" + args.id, {
            visible: true
          })
          .then((res) => {
            return res.data;
          });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
