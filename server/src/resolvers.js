const resolvers = {
  Query: {
    room: async (_, { id }, { dataSources }) => {
      return await dataSources.db.room(id)
        .then(result => result[0]);
    }
  },

  Mutation: {
    // createMessage: async (_, { userId, roomId, body, timeCreated }, { dataSources }) => {
    //   return await dataSources.db.createMessage(userId, roomId, body, timeCreated);
    //   return await sql`
    //     INSERT INTO messages (userId, roomId, body, timeCreated)
    //     VALUES (${userId}, ${roomId}, '${body}', ${timeCreated});
    //   `
    //     .then(() => {
    //       return {
    //         code: 200,
    //         success: true,
    //         message: 'Successfully created message'
    //       }
    //     })
    //     .catch((err) => {
    //       return {
    //         code: err.extensions.response.status,
    //         success: false,
    //         message: err.extensions.response.body
    //       }
    //     })
    // }
  },

  Room: {
    messages: async ( { id }, _, { dataSources } ) => {
      return await dataSources.db.messages(id);
    }
  }
};

module.exports = resolvers;
