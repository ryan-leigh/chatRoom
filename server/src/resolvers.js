const resolvers = {
  Query: {
    messagesForRoom: () => {
      return {
        id: "1",
        userId: "1",
        body: "Hello",
        timeCreated: "1"
      }
    }
  },
};

module.exports = resolvers;
