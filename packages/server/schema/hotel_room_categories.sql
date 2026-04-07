-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `room_categories`
--

DROP TABLE IF EXISTS `room_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_categories` (
  `id` varchar(64) NOT NULL,
  `title` text NOT NULL,
  `updatedAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `developer` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_categories`
--

LOCK TABLES `room_categories` WRITE;
/*!40000 ALTER TABLE `room_categories` DISABLE KEYS */;
INSERT INTO `room_categories` VALUES ('000e094b-3d8e-4f18-8ef5-983e6554a643','Official Rooms','2026-02-16 16:43:05','2026-02-16 16:43:05',1),('053e5f01-84aa-412f-a1cf-7e4b6282d204','Room Bundles','2026-03-17 18:34:24','2026-03-17 18:34:24',1),('30385250-712c-4077-8877-7590776f3ff7','Trading','2026-02-13 21:35:40','2026-02-13 21:35:40',0),('35b45424-73bd-461a-a8ec-3f28f33f2195','Personal Space','2026-02-13 21:35:40','2026-02-13 21:35:40',0),('3a3759ca-77a8-4f05-b031-573137153801','Role Playing','2026-02-13 21:35:40','2026-02-13 21:35:40',0),('4d1d67b8-363e-407b-8012-032e0f14c744','Party','2026-02-13 21:35:40','2026-02-13 21:35:40',0),('5cfb5651-c765-4943-bb0a-2e05709bb78d','Help Centers','2026-02-13 21:35:40','2026-02-13 21:35:40',0),('817d46c9-2b27-4fb8-a44e-587c3c57be52','Habbo Games','2026-02-13 21:35:40','2026-02-13 21:35:40',0),('9b98c758-cec1-4f81-acc3-bd744666e796','Fansite Square','2026-02-13 21:35:40','2026-02-13 21:35:40',0),('c98a9255-2378-4c88-908f-cd063e05c1f2','Building and decoration','2026-02-13 21:35:40','2026-02-13 21:35:40',0),('d165aef1-73fb-4798-8c7f-caabcfe0685c','Agencies','2026-02-13 21:35:40','2026-02-13 21:35:40',0),('d49a62dd-da52-4777-9d12-c2f7e8ef3079','Chat and discussion','2026-02-13 21:35:40','2026-02-13 21:35:40',0);
/*!40000 ALTER TABLE `room_categories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-29 20:41:33
