-- phpMyAdmin SQL Dump
-- version 4.0.10.18
-- https://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Mai 12, 201 at 02:19 PM
-- Server version: 5.6.36-cll-lve
-- PHP Version: 5.6.30 

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
 

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ada_ssc`
--

-- --------------------------------------------------------

--
-- Table structure for table `nShower`
--

CREATE TABLE IF NOT EXISTS `nShower` (
  `showerId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `wgId` int(11) NOT NULL,
  `date` date NOT NULL,
  `duration` int(11) NOT NULL,
  PRIMARY KEY (`showerId`),
  KEY `userId` (`userId`),
  KEY `wgId` (`wgId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `nShower`
--

INSERT INTO `nShower` (`showerId`, `userId`, `wgId`, `date`, `duration`) VALUES
(1, 1, 1, '2018-05-25', 1000),
(2, 1, 1, '2018-05-27', 1500),
(3, 1, 1, '2018-05-28', 1300),
(4, 1, 1, '2018-05-29', 2000),
(5, 1, 1, '2018-05-30', 1600),
(6, 2, 1, '2018-05-24', 500),
(7, 2, 1, '2018-05-25', 1000),
(8, 2, 1, '2018-05-26', 100),
(9, 2, 1, '2018-05-27', 1300),
(10, 2, 1, '2018-05-27', 300),
(11, 3, 1, '2018-05-25', 3000),
(12, 3, 1, '2018-05-26', 1000),
(13, 3, 1, '2018-05-27', 4000),
(14, 3, 1, '2018-05-28', 4000),
(15, 3, 1, '2018-05-30', 3000);

-- --------------------------------------------------------

--
-- Table structure for table `nUser`
--

CREATE TABLE IF NOT EXISTS `nUser` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `email` text NOT NULL,
  `wgId` int(11) NOT NULL,
  `name` text NOT NULL,
  `secret` text NOT NULL,
  `pushId` text NOT NULL,
  PRIMARY KEY (`userId`),
  KEY `wgId` (`wgId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `nUser`
--

INSERT INTO `nUser` (`userId`, `email`, `wgId`, `name`, `secret`, `pushId`) VALUES
(1, 'lorenz.graaf@gmail.com', 1, 'Lorenz', 'lorenz', 'dn-CF_m9KGw:APA91bFEyrQBZvgahwwryyDpdZcqft_P_5TiaJ0HZFPOSdG8wuqT1S6oCQq8f5RXtckKaHqri2TC4RuXJP4QnZVMZXfvWT7-U1x8MTubns3gPTVkUFjOHB5YS0hR3JqdRnQhE_j89IPd'),
(2, 'mfischbacher@outlook.com', 1, 'Matthias', 'razza', 'dn-CF_m9KGw:APA91bFEyrQBZvgahwwryyDpdZcqft_P_5TiaJ0HZFPOSdG8wuqT1S6oCQq8f5RXtckKaHqri2TC4RuXJP4QnZVMZXfvWT7-U1x8MTubns3gPTVkUFjOHB5YS0hR3JqdRnQhE_j89IPd'),
(3, 'michael.rieger@shizzle.com', 1, 'Mike', 'black', 'dn-CF_m9KGw:APA91bFEyrQBZvgahwwryyDpdZcqft_P_5TiaJ0HZFPOSdG8wuqT1S6oCQq8f5RXtckKaHqri2TC4RuXJP4QnZVMZXfvWT7-U1x8MTubns3gPTVkUFjOHB5YS0hR3JqdRnQhE_j89IPd'),
(4, 'patrick.felbauer@gmail.com', 1, 'Fel', 'ada', 'dn-CF_m9KGw:APA91bFEyrQBZvgahwwryyDpdZcqft_P_5TiaJ0HZFPOSdG8wuqT1S6oCQq8f5RXtckKaHqri2TC4RuXJP4QnZVMZXfvWT7-U1x8MTubns3gPTVkUFjOHB5YS0hR3JqdRnQhE_j89IPd');

-- --------------------------------------------------------

--
-- Table structure for table `nWGs`
--

CREATE TABLE IF NOT EXISTS `nWGs` (
  `wgId` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `toilet_paper` int(11) NOT NULL,
  `toilet_occupation` int(11) NOT NULL,
  `toilet_timer` int(11) NOT NULL,
  `humidity` int(11) NOT NULL,
  `temperature` int(11) NOT NULL, 
  `temperature_exact` int(11) NOT NULL,
  `rain` int(11) NOT NULL,
  `last_update` datetime NOT NULL,
  PRIMARY KEY (`wgId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `nWGs`
--

INSERT INTO `nWGs` (`wgId`, `name`, `toilet_paper`, `toilet_occupation`, `toilet_timer`, `humidity`, `temperature`, `temperature_exact`, `rain`, `last_update`) VALUES
(1, 'Desperate House Guys', 1, 1, 200, 50, 50, 50, 300 '2017-10-31 00:00:00');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `nShower`
--
ALTER TABLE `nShower`
  ADD CONSTRAINT `nShower_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `nUser` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `nShower_ibfk_2` FOREIGN KEY (`wgId`) REFERENCES `nWGs` (`wgId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `nUser`
--
ALTER TABLE `nUser`
  ADD CONSTRAINT `nUser_ibfk_1` FOREIGN KEY (`wgId`) REFERENCES `nWGs` (`wgId`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
