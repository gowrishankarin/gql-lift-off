const { AuthenticationError } = require("./errors/auth.errors");

const resolvers = {
  Query: {
    tracksForHome: (_, __, { dataSources }) => {
      return dataSources.tracksAPI.getTracksForHome();
    },
    tracksForHomeFetch: async () => {
      const baseUrl = "https://odyssey-lift-off-rest-api.herokuapp.com";

      const res = await fetch(`${baseUrl}/tracks`);
      return res.json();
    },
    track: (_, { id }, { dataSources }) => {
      return dataSources.tracksAPI.getTrack(id);
    },
    trackFetch: async (_, { id }, { dataSources }) => {
      const baseUrl = "https://odyssey-lift-off-rest-api.herokuapp.com";
      const res = await fetch(`${baseUrl}/track/${id}`);
      return res.json();
      // return dataSources.tracksAPI.getTrack(id);
    },
  },
  Track: {
    author: async ({ authorId }, _, { dataSources }) => {
      const baseUrl = "https://odyssey-lift-off-rest-api.herokuapp.com";
      const res = await fetch(`${baseUrl}/author/${authorId}`);
      return res.json();
      // return dataSources.tracksAPI.getAuthor(authorId);
    },
    modules: ({ id }, _, { dataSources }) => {
      return dataSources.tracksAPI.getTrackModules(id);
    },
  },

  Mutation: {
    incrementTrackViews: async (
      _,
      { id },
      { dataSources, userId, userInfo }
    ) => {
      try {
        if (!userId) {
          console.log("Error Throw 1");
          throw AuthenticationError(
            "You are not authenticated to perform this action."
          );
        }

        if (userRole !== "Host") {
          throw ForbiddenError(
            "You are not authorized to perform this action."
          );
        }
        const track = await dataSources.tracksAPI.incrementTrackViews(id);
        return {
          code: 200,
          success: true,
          message: `Successfully incremented number of views for track ${id}`,
          track,
        };
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          track: null,
        };
      }
    },
  },
};

module.exports = resolvers;
