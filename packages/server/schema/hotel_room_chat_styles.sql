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
-- Table structure for table `room_chat_styles`
--

DROP TABLE IF EXISTS `room_chat_styles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_chat_styles` (
  `id` varchar(32) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_chat_styles`
--

LOCK TABLES `room_chat_styles` WRITE;
/*!40000 ALTER TABLE `room_chat_styles` DISABLE KEYS */;
INSERT INTO `room_chat_styles` VALUES ('ambassador','2026-02-11 19:02:02','2026-02-11 19:02:02'),('bats','2026-02-11 19:02:02','2026-02-11 19:02:02'),('bot_frank_large','2026-02-11 19:02:02','2026-02-11 19:02:02'),('bot_guide','2026-02-11 19:02:02','2026-02-11 19:02:02'),('console','2026-02-11 19:02:02','2026-02-11 19:02:02'),('dragon','2026-02-11 19:02:02','2026-02-11 19:02:02'),('firingmylazer','2026-02-11 19:02:02','2026-02-11 19:02:02'),('fortune_teller','2026-02-11 19:02:02','2026-02-11 19:02:02'),('generic','2026-02-11 19:02:02','2026-02-11 19:02:02'),('goat','2026-02-11 19:02:02','2026-02-11 19:02:02'),('gothicrose','2026-02-11 19:02:02','2026-02-11 19:02:02'),('hearts','2026-02-11 19:02:02','2026-02-11 19:02:02'),('normal','2026-02-11 19:02:02','2026-02-11 19:02:02'),('normal_blue','2026-02-11 19:02:02','2026-02-11 19:02:02'),('normal_dark_yellow','2026-02-11 19:02:02','2026-02-11 19:02:02'),('normal_purple','2026-02-11 19:02:02','2026-02-11 19:02:02'),('normal_red','2026-02-11 19:02:02','2026-02-11 19:02:02'),('notification','2026-02-11 19:02:02','2026-02-11 19:02:02'),('parrot','2026-02-11 19:02:02','2026-02-11 19:02:02'),('piglet','2026-02-11 19:02:02','2026-02-11 19:02:02'),('pirate','2026-02-11 19:02:02','2026-02-11 19:02:02'),('radio','2026-02-11 19:02:02','2026-02-11 19:02:02'),('sausagedog','2026-02-11 19:02:02','2026-02-11 19:02:02'),('skelestock','2026-02-11 19:02:02','2026-02-11 19:02:02'),('skeleton','2026-02-11 19:02:02','2026-02-11 19:02:02'),('snowstorm_red','2026-02-11 19:02:02','2026-02-11 19:02:02'),('steampunk_pipe','2026-02-11 19:02:02','2026-02-11 19:02:02'),('storm','2026-02-11 19:02:02','2026-02-11 19:02:02'),('zombie_hand','2026-02-11 19:02:02','2026-02-11 19:02:02');
/*!40000 ALTER TABLE `room_chat_styles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-29 20:41:35
