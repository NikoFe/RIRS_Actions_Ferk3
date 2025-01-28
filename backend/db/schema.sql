/*CREATE DATABASE IF NOT EXISTS express;
USE express;
CREATE TABLE User (
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (username)
);

CREATE TABLE Post (
  name VARCHAR(255) UNIQUE NOT NULL,
  parts VARCHAR(255) NOT NULL,
  user_username VARCHAR(255),
  PRIMARY KEY (name),
  FOREIGN KEY (user_username) REFERENCES User(username)
);*/