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
  updatedAt int,
  PRIMARY KEY(id)
);

CREATE TABLE messages (
  id serial,
  userId int,
  roomId int,
  body text,
  timeCreated int,
  PRIMARY KEY(id),
  CONSTRAINT fk_userId
    FOREIGN KEY(userId)
      REFERENCES users(id),
  CONSTRAINT fk_roomId
    FOREIGN KEY(roomId)
      REFERENCES rooms(id)
);