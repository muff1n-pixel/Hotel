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
-- Table structure for table `furniture_crackables`
--

DROP TABLE IF EXISTS `furniture_crackables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `furniture_crackables` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `requiredClicks` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `furnitureId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `furnitureId` (`furnitureId`),
  CONSTRAINT `furniture_crackables_ibfk_1` FOREIGN KEY (`furnitureId`) REFERENCES `furnitures` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `furniture_crackables`
--

LOCK TABLES `furniture_crackables` WRITE;
/*!40000 ALTER TABLE `furniture_crackables` DISABLE KEYS */;
INSERT INTO `furniture_crackables` VALUES ('074a088a-dab7-4f79-956e-8cd8527f5c5b',1000,'2026-03-20 23:09:41','2026-03-20 23:09:41','b36c4522-d942-4842-8404-cb0d798838c6'),('3c340561-49ad-4a03-aabf-22dc3e8264dc',10000,'2026-03-20 23:16:07','2026-03-20 23:16:07','95723101-2025-4342-8d09-a71ddf427955'),('49dd20ed-0c8b-4ef6-98bb-3c09ca0cfc95',5,'2026-03-20 23:20:00','2026-03-20 23:20:00','b31cc367-9af3-4115-beb3-744db153a7cf'),('61ec2ef2-4994-4c35-a36f-907c8ddb1556',5000,'2026-03-20 23:13:06','2026-03-20 23:13:06','608850e6-a301-4cf5-9e09-f2995f3a7870'),('7cd2970b-2d65-447d-9f2a-28bb5c008658',10000,'2026-03-20 23:14:50','2026-03-20 23:14:50','40ff98bd-f47d-4695-8f10-00a5719e3290');
/*!40000 ALTER TABLE `furniture_crackables` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-29 20:41:38
