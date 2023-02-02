DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE rooms (
  id serial,
  "name" text,
  PRIMARY KEY(id)
);

CREATE TABLE users (
  id serial,
  "name" text,
  email text,
  updated_at int,
  PRIMARY KEY(id)
);

CREATE TABLE messages (
  id serial,
  user_id int,
  room_id int,
  body text,
  time_created int,
  PRIMARY KEY(id),
  CONSTRAINT fk_user_id
    FOREIGN KEY(user_id)
      REFERENCES users(id),
  CONSTRAINT fk_room_id
    FOREIGN KEY(room_id)
      REFERENCES rooms(id)
);