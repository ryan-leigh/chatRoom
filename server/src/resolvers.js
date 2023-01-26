const sql = require('../sql/db.js');

const resolvers = {
  Query: {
    room: async (_, { id }) => {
      return await sql`
        SELECT *
        FROM rooms
        WHERE id = ${id};
      `
        .then((sqlResult) => sqlResult[0]);
    }
  },

  Mutation: {
    createMessage: async (_, { userId, roomId, body, timeCreated }) => {
      return await sql`
        INSERT INTO messages (userId, roomId, body, timeCreated)
        VALUES (${userId}, ${roomId}, '${body}', ${timeCreated});
      `
        .then(() => {
          return {
            code: 200,
            success: true,
            message: 'Successfully created message'
          }
        })
        .catch((err) => {
          return {
            code: err.extensions.response.status,
            success: false,
            message: err.extensions.response.body
          }
        })
    }
  },

  Room: {
    messages: async ( { id } ) => {
      const result = await sql`
        SELECT *
        FROM messages
        WHERE roomId = ${id}
        ORDER BY timeCreated DESC;
      `
      console.log(result);
      return result;
    }
  }
};

module.exports = resolvers;
