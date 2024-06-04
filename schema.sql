CREATE DATABASE biteSpeed;
USE biteSpeed;

CREATE TABLE contact (
id integer PRIMARY KEY auto_increment,
phoneNumber varchar(255) DEFAULT NULL,
email varchar(255) DEFAULT NULL,
linkedId integer DEFAULT NULL,
linkPrecedence varchar(255) DEFAULT NULL,
createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
updatedAt TIMESTAMP DEFAULT NULL,
deletedAt TIMESTAMP DEFAULT NULL,
INDEX idx_phone_number (phoneNumber), 
INDEX idx_email (email),
INDEX idx_precede (linkPrecedence)
);
