const { PubSub, withFilter } = require('graphql-subscriptions');
const pubSub = new PubSub();

const resolvers = {
  Query: {
    room: async (_, { id }, { dataSources }) => {
      return await dataSources.db.room(id)
        .then(result => result[0]);
    }
  },

  Mutation: {
    createUser: async (_, { username, updated_at }, { dataSources }) => {
      try {
        const userQuery = await dataSources.db.userByUsername(username);
        if (userQuery.length > 0) {
          return {
            code: 409,
            success: false,
            message: 'User with that username already exists',
            uniqueIssue: true
          }
        } else {
          return dataSources.db.createUser(username, updated_at)
            .then((newUser) => {
              return {
                code: 200,
                success: true,
                message: 'Successfully created user',
                newUser
              }
            })
        }
      } catch (err) {
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body,
          uniqueIssue: false
        }
      }
    },

    createMessage: (_, { userId, roomId, body, timeCreated }, { dataSources }) => {
      try {
        return dataSources.db.createMessage(userId, roomId, body, timeCreated)
        .then(async (response) => {
          const author = await dataSources.db.user(userId)
            .then(userArr => userArr[0]);
          pubSub.publish(`NEW_MESSAGE`, {newMessage: {
            id: response.id,
            body: response.body,
            time_created: response.time_created,
            roomId,
            author_id: author.id,
            author_name: author.name,
            author_updated_at: author.updated_at
          }});
          return {
            code: 200,
            success: true,
            message: 'Successfully created message',
          }
        })
      } catch (err) {
        console.log(`Error creating message: ${err}`)
        return {
          code: err.extensions.response.status,
          success: false,
          message: err.extensions.response.body
        }
      }
    }
  },

  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubSub.asyncIterator([`NEW_MESSAGE`]),
        (payload, variables) => {
          return (
            payload.newMessage.roomId === variables.roomId
          )
        }
      )
    }
  },

  Room: {
    messages: async ({ id, offset }, _, { dataSources }) => {
      return await dataSources.db.messages(id);
    }
  },

  Message: {
    author: async ({ user_id }, _, { dataSources }) => {
      return await dataSources.db.user(user_id)
        .then(userArr => userArr[0]);
    }
  }
};

module.exports = resolvers;
