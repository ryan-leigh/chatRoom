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
      .orderBy('time_created', 'desc')
      .cache(MINUTE);
  }
  user(id) {
    return this.knex
      .select('*')
      .from('users')
      .where({id: id})
      .cache(MINUTE);
  }
}

module.exports = MyDatabase;