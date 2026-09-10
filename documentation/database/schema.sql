CREATE TABLE `users` (
  `user_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE `tasks` (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(60) NOT NULL,
	description TEXT NULL,
	status ENUM('pending', 'in-progress', 'done') DEFAULT 'pending',
	deadline DATETIME NULL,
	user_id char(36),
	PRIMARY KEY(id),
	CONSTRAINT FK_tasks_user
		FOREIGN KEY (user_id)
		REFERENCES users(user_id)
);