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
  messages(id, offset, addLimit) {
    console.log(addLimit)
    return this.knex
      .select('*')
      .from('messages')
      .where({room_id: id})
      .orderBy('id', 'desc')
      .limit(20 + addLimit)
      .offset(offset);
  }
  user(id) {
    return this.knex
      .select('*')
      .from('users')
      .where({id: id});
  }
  userByUsername(username) {
    return this.knex
      .select('*')
      .from('users')
      .where({name: username});
  }
  createUser(username, updated_at) {
    return this.knex
      .insert({name: username, updated_at})
      .returning('*')
      .into('users')
      .then((sqlResponse) => {
        return sqlResponse[0];
      });
  }
  createMessage(userId, roomId, body, timeCreated) {
    return this.knex
      .insert({user_id: userId, room_id: roomId, body, time_created: timeCreated})
      .returning('*')
      .into('messages')
      .then((sqlResponse) => {
        return sqlResponse[0];
      });
  }
}

module.exports = MyDatabase;