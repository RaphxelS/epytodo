CREATE DATABASE IF NOT EXISTS `epytodo`;

USE `epytodo`;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `created_at` date DEFAULT(CURRENT_DATE),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

LOCK TABLES `user` WRITE;

UNLOCK TABLES;

DROP TABLE IF EXISTS `todo`;
CREATE TABLE `todo` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `created_at` date DEFAULT(CURRENT_DATE),
  `due_time` date NOT NULL,
  `status` enum('not started','todo','in progress','done') DEFAULT 'not started',
  `user_id` int(10) unsigned NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

LOCK TABLES `todo` WRITE;

UNLOCK TABLES;
