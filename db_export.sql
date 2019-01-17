-- Adminer 4.6.3 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP DATABASE IF EXISTS `tema_restaurant`;
CREATE DATABASE `tema_restaurant` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `tema_restaurant`;

DROP TABLE IF EXISTS `comanda_produs`;
CREATE TABLE `comanda_produs` (
  `produs_id` int(11) DEFAULT NULL,
  `comanda_id` int(11) DEFAULT NULL,
  `status` char(32) DEFAULT 'nepreluata',
  KEY `produs_id` (`produs_id`),
  KEY `comanda_id` (`comanda_id`),
  CONSTRAINT `comanda_produs_ibfk_1` FOREIGN KEY (`produs_id`) REFERENCES `produse` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comanda_produs_ibfk_2` FOREIGN KEY (`comanda_id`) REFERENCES `comenzi` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `comenzi`;
CREATE TABLE `comenzi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ospatar_id` int(11) NOT NULL,
  `masa_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `masa_id` (`masa_id`),
  KEY `ospatar_id` (`ospatar_id`),
  CONSTRAINT `comenzi_ibfk_1` FOREIGN KEY (`masa_id`) REFERENCES `mese` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comenzi_ibfk_2` FOREIGN KEY (`ospatar_id`) REFERENCES `ospatari` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `manageri`;
CREATE TABLE `manageri` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL,
  `nume` char(64) NOT NULL,
  `data_nasterii` datetime DEFAULT NULL,
  `data_angajarii` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid` (`userid`),
  CONSTRAINT `manageri_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `manageri` (`id`, `userid`, `nume`, `data_nasterii`, `data_angajarii`) VALUES
(1,	1,	'root',	NULL,	NULL),
(3,	7,	'Admin 2 Name',	'0222-02-22 00:00:00',	'0222-02-22 00:00:00');

DROP TABLE IF EXISTS `mese`;
CREATE TABLE `mese` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numar` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `ospatari`;
CREATE TABLE `ospatari` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `nume` char(64) NOT NULL,
  `data_nasterii` datetime DEFAULT NULL,
  `data_angajarii` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userid` (`userid`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `ospatari_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `manageri` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ospatari_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `ospatari` (`id`, `userid`, `manager_id`, `nume`, `data_nasterii`, `data_angajarii`) VALUES
(2,	4,	1,	'Worker 2 Name',	'0002-02-22 00:00:00',	'0002-02-22 00:00:00'),
(3,	5,	1,	'Worker 3 Name',	'0333-03-31 00:00:00',	'0333-03-31 00:00:00'),
(6,	2,	1,	'Pangi Name',	'0333-03-31 00:00:00',	'0333-03-31 00:00:00');

DROP TABLE IF EXISTS `produse`;
CREATE TABLE `produse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nume` char(128) NOT NULL,
  `cost` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `produse` (`id`, `nume`, `cost`) VALUES
(1,	'ceapa verde',	10),
(2,	'mamaliga',	10),
(3,	'supa de rosii',	10),
(4,	'snitele',	10),
(5,	'zacusca',	10),
(6,	'bere',	10),
(7,	'drojdie',	10),
(8,	'friptura',	10),
(9,	'galuste',	10),
(10,	'hrean',	10),
(11,	'icre',	10),
(12,	'eugenie',	10),
(13,	'jalapeno',	10),
(14,	'lapte',	10),
(15,	'pere',	10),
(16,	'varza',	10);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` char(64) NOT NULL,
  `pass` char(64) DEFAULT NULL,
  `name` char(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `users` (`id`, `user`, `pass`, `name`) VALUES
(1,	'root',	'123',	'root'),
(2,	'pangi',	'123',	'Pangi Name'),
(3,	'worker1',	'123',	'Worker 1 Name'),
(4,	'worker2',	'123',	'Worker 2 Name'),
(5,	'worker3',	'123',	'Worker 3 Name'),
(6,	'admin1',	'123',	'Admin 1 Name'),
(7,	'admin2',	'123',	'Admin 2 Name'),
(8,	'user',	'123',	'user');

-- 2019-01-17 20:04:42
