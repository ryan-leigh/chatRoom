const { PubSub, withFilter } = require('graphql-subscriptions');
const pubSub = new PubSub();

const resolvers = {
  Query: {
    room: (_, { id, offset }, { dataSources }) => {
      return dataSources.db.room(id)
        .then(result => {
          result[0].offset = offset;
          return result[0];
        })
        .catch(err => console.log(err));
    },
    getMessages: (_, { id, offset }, { dataSources }) => {
      return dataSources.db.messages(id, offset)
        .catch(err => console.log(err));
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

    createMessage: (_, { authorId, roomId, body, timeCreated }, { dataSources }) => {
      try {
        return dataSources.db.createMessage(authorId, roomId, body, timeCreated)
        .then(async (response) => {
          const newMessage = {
            id: response.id,
            body: response.body,
            time_created: response.time_created,
            room_id: roomId,
            user_id: authorId
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
          console.log(payload);
          return (
            payload.newMessage.room_id === variables.roomId
          )
        }
      )
    }
  },

  Room: {
    messages: async ({ id, offset }, _, { dataSources }) => {
      return dataSources.db.messages(id, offset)
        .catch(err => console.log(err));
    }
  },

  Message: {
    author: async ({ user_id }, _, { dataSources }) => {
      const author = await dataSources.db.user(user_id)
        .then(userArr => userArr[0])
        .catch(err => console.log(err));
      return author;
    }
  }
};
module.exports = resolvers;
