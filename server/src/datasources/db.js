const { BatchedSQLDataSource } = require('@nic-jennings/batched-sql-datasource');

const MINUTE = 60;

class MyDatabase extends BatchedSQLDataSource {
  room(id) {
    console.log('in room')
    return this.db.query
      .select('*')
      .from('rooms')
      .where({id: id});
  }
  messages(id, offset) {
    return this.db.query
      .select('*')
      .from('messages')
      .where({room_id: id})
      .orderBy('time_created', 'desc')
      .limit(20)
      .offset(offset * 20);
  }
  user(id) {
    return this.db.query
      .select('*')
      .from('users')
      .where({id: id});
  }
  userByUsername(username) {
    return this.db.query
      .select('*')
      .from('users')
      .where({name: username});
  }
  createUser(username, updated_at) {
    return this.db.query
      .insert({name: username, updated_at})
      .returning('*')
      .into('users')
      .then((sqlResponse) => {
        return sqlResponse[0];
      });
  }
  createMessage(authorId, roomId, body, timeCreated) {
    return this.db.query
      .insert({user_id: authorId, room_id: roomId, body, time_created: timeCreated})
      .returning('*')
      .into('messages')
      .then((sqlResponse) => {
        return sqlResponse[0];
      });
  }
}

module.exports = MyDatabase;