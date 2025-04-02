USE chenp102_db;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    phone CHAR(10),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password_hash CHAR(72) NOT NULL,
    PRIMARY KEY(id),
    UNIQUE(email)
);

CREATE TABLE sessions (
    session_id CHAR(36) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(session_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE companies (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone CHAR(10) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE representatives (
    id INT NOT NULL AUTO_INCREMENT,
    company INT NOT NULL,
    user_id INT NOT NULL,
    email VARCHAR(255),
    phone CHAR(10),
    PRIMARY KEY(id),
    FOREIGN KEY(company) REFERENCES companies(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE availability (
    id INT NOT NULL AUTO_INCREMENT,
    representative INT NOT NULL,
    day_of_week INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(representative) REFERENCES representatives(id)
);

CREATE TABLE meetings (
    id INT NOT NULL AUTO_INCREMENT,
    representative INT NOT NULL,
    client INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(representative) REFERENCES representatives(id),
    FOREIGN KEY(client) REFERENCES users(id)
);
