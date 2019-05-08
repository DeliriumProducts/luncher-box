-- MySQL dump 10.17  Distrib 10.3.14-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: luncherbox_production
-- ------------------------------------------------------
-- Server version	10.3.14-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `luncherbox_production`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `luncherbox_production` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `luncherbox_production`;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `image` text NOT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order`
(
  `id` varchar
(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customerId` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` int
(11) NOT NULL,
  `placed` datetime NOT NULL,
  `accepted` datetime DEFAULT NULL,
  `declined` datetime DEFAULT NULL,
  `finished` datetime DEFAULT NULL,
  `tableId` int
(11) DEFAULT NULL,
  PRIMARY KEY
(`id`),
  KEY `FK_a9757413db9333d4bb21a2a42aa`
(`tableId`),
  CONSTRAINT `FK_a9757413db9333d4bb21a2a42aa` FOREIGN KEY
(`tableId`) REFERENCES `table`
(`id`) ON
DELETE CASCADE ON
UPDATE NO ACTION
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order_product`
--

DROP TABLE IF EXISTS `order_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_product`
(
  `orderId` varchar
(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` int
(11) NOT NULL,
  `quantity` int
(11) NOT NULL,
  PRIMARY KEY
(`orderId`,`productId`),
  KEY `FK_073c85ed133e05241040bd70f02`
(`productId`),
  CONSTRAINT `FK_073c85ed133e05241040bd70f02` FOREIGN KEY
(`productId`) REFERENCES `product`
(`id`) ON
DELETE NO ACTION ON
UPDATE NO ACTION,
  CONSTRAINT `FK_3fb066240db56c9558a91139431` FOREIGN KEY
(`orderId`) REFERENCES `order`
(`id`) ON
DELETE CASCADE ON
UPDATE NO ACTION
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `name` varchar
(255) NOT NULL,
  `description` text NOT NULL,
  `image` text NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_categories_category`
--

DROP TABLE IF EXISTS `product_categories_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_categories_category`
(
  `productId` int
(11) NOT NULL,
  `categoryId` int
(11) NOT NULL,
  PRIMARY KEY
(`productId`,`categoryId`),
  KEY `IDX_342d06dd0583aafc156e076379`
(`productId`),
  KEY `IDX_15520e638eb4c46c4fb2c61c4b`
(`categoryId`),
  CONSTRAINT `FK_15520e638eb4c46c4fb2c61c4b4` FOREIGN KEY
(`categoryId`) REFERENCES `category`
(`id`) ON
DELETE CASCADE ON
UPDATE NO ACTION,
  CONSTRAINT `FK_342d06dd0583aafc156e0763790` FOREIGN KEY
(`productId`) REFERENCES `product`
(`id`) ON
DELETE CASCADE ON
UPDATE NO ACTION
) ENGINE=InnoDB
DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `table`
--

DROP TABLE IF EXISTS `table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `table`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `name` varchar
(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isTaken` tinyint
(4) NOT NULL,
  PRIMARY KEY
(`id`),
  UNIQUE KEY `IDX_2cb0b78846e0a65d35a4cd02d3`
(`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user`
(
  `id` varchar
(36) NOT NULL,
  `name` text NOT NULL,
  `email` varchar
(255) NOT NULL,
  `password` varchar
(255) NOT NULL,
  `isVerified` tinyint
(4) NOT NULL,
  `role` text NOT NULL,
  PRIMARY KEY
(`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2`
(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-05-08 15:26:26
