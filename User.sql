 User.sql
-- SQL schema for storing user accounts in Online Notes App

CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,         -- Unique user ID
    username VARCHAR(50) NOT NULL UNIQUE,      -- Username (unique)
    email VARCHAR(100) NOT NULL UNIQUE,        -- User email (unique)
    password_hash VARCHAR(255) NOT NULL,       -- Hashed password
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
