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
      .where({roomid: id})
      .orderBy('timecreated', 'desc')
      .cache(MINUTE);
  }
}

module.exports = MyDatabase;