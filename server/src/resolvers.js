const { PubSub, withFilter } = require('graphql-subscriptions');
const pubSub = new PubSub();

const resolvers = {
  Query: {
    room: (_, { id }, { dataSources }) => {
      console.log('room request!')
      console.log(id);
      return dataSources.db.room(id)
        .then(result => {
          console.log(result[0]);
          return result[0];
        })
        .catch(err => console.log(err));
    },
    // messages: (_, { id, offset }, { dataSources }) => {
    //   console.log('request!')
    //   return dataSources.db.messages(id, offset, 0);
    // }
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
          const newMessage = {
            id: response.id,
            body: response.body,
            time_created: response.time_created,
            roomId,
            user_id: userId,
            author: {
              id: author.id,
              name: author.name,
              updated_at: author.updated_at
            }
          }
          pubSub.publish(`NEW_MESSAGE`, {newMessage});
          return {
            code: 200,
            success: true,
            message: 'Successfully created message',
            newMessage
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
    messages: async ({ id, offset, addLimit }, _, { dataSources }) => {
      return await dataSources.db.messages(id, offset, addLimit);
    }
  },

  Message: {
    author: async ({ user_id }, _, { dataSources }) => {
      console.log('we here')
      return await dataSources.db.user(user_id)
        .then(userArr => userArr[0]);
    }
  }
};

module.exports = resolvers;
