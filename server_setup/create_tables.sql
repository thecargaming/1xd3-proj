USE chenp102_db;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    email CHAR(255) NOT NULL,
    phone CHAR(10),
    first_name CHAR(255) NOT NULL,
    last_name CHAR(255) NOT NULL,
    password_hash CHAR(72) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE sessions (
    session_id CHAR(36) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(session_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE companies (
    name CHAR(255) NOT NULL,
    address CHAR(255) NOT NULL,
    phone CHAR(10) NOT NULL,
    PRIMARY KEY(name)
);

CREATE TABLE representatives (
    id INT NOT NULL AUTO_INCREMENT,
    company CHAR(255) NOT NULL,
    user_id INT NOT NULL,
    email CHAR(255),
    phone CHAR(10),
    PRIMARY KEY(id),
    FOREIGN KEY(company) REFERENCES companies(name),
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
