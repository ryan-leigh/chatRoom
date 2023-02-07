const { SQLDataSource } = require('datasource-sql');

const MINUTE = 60;

class MyDatabase extends SQLDataSource {
  room(id) {
    return this.knex
      .select('*')
      .from('rooms')
      .where({id: id})
      .cache(MINUTE);
  }
  messages(id) {
    return this.knex
      .select('*')
      .from('messages')
      .where({room_id: id})
      .orderBy('id');
  }
  user(id) {
    return this.knex
      .select('*')
      .from('users')
      .where({id: id})
      .cache(MINUTE);
  }
  createMessage(userId, roomId, body, timeCreated) {
    return this.knex
      .insert({user_id: userId, room_id: roomId, body, time_created: timeCreated})
      .returning(['id', 'user_id', 'room_id', 'body', 'time_created'])
      .into('messages')
      .then((returnVal) => {
        return returnVal[0];
      });
  }
}

module.exports = MyDatabase;