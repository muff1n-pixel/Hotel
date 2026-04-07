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
-- Table structure for table `achievements`
--

DROP TABLE IF EXISTS `achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `achievements` (
  `id` varchar(32) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `badgePrefix` varchar(32) NOT NULL,
  `levels` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `badgeId` varchar(32) DEFAULT NULL,
  `categoryId` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `badgeId` (`badgeId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `achievements_ibfk_73` FOREIGN KEY (`badgeId`) REFERENCES `badges` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `achievements_ibfk_74` FOREIGN KEY (`categoryId`) REFERENCES `achievement_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `achievements`
--

LOCK TABLES `achievements` WRITE;
/*!40000 ALTER TABLE `achievements` DISABLE KEYS */;
INSERT INTO `achievements` VALUES ('BattleBanzaiPlayer','Battle Banzai Player','For earning %score% points through playing Battle Banzai.','ACH_BattleBallPlayer','[50,100,240,410,655,1045,1615,2465,3765,6215,10865,19665,36365,68115,128415,242965,460615,874115,1659765,3152515]','2026-03-28 09:06:35','2026-03-29 17:48:04',NULL,'games'),('BattleBanzaiStar','Battle Banzai Star','For gaining %score% winning points while playing Battle Banzai.','ACH_BattleBallWinner','[50,100,240,410,655,1045,1615,2465,3765,6215,10865,19665,36365,68115,128415,242965,460615,874115,1659765,3152515]','2026-03-28 09:06:35','2026-03-29 17:48:04',NULL,'games'),('BladesOfGlory','Blades Of Glory','For being caught %score% times while playing Ice Tag.','ACH_TagB','[1,4,9,17,29,44,62,87,114,144,186,242,314,402,498,618,754,905,1084,1284]','2026-03-22 01:33:38','2026-03-29 17:48:04',NULL,'games'),('BunnyRunBuilder','Bunny Run Field Builder','For creating a Bunny Run Field using %score% Bunny Run Patches.','ACH_RbBunnyTag','[10,20,30,45,60,80,100,125,150,170]','2026-03-29 13:33:41','2026-03-29 17:48:04',NULL,'room_builder'),('CarrotsOfGlory','Carrots Of Glory','For being caught %score% times while playing Bunny Run.','ACH_BunR','[1,4,9,17,29,44,62,87,114,144,186,242,314,402,498,618,754,905,1084,1284]','2026-03-29 03:40:08','2026-03-29 17:48:04',NULL,'games'),('FreezeFighter','Freeze Fighter','For freezing %score% players during games of Freeze.','ACH_EsA','[2,5,10,18,30,50,80,125,200,300,420,600,900,1500,2500,3700,5400,8000,12000,20000]','2026-03-23 18:27:00','2026-03-29 17:48:04',NULL,'games'),('FreezePlayer','Freeze Player','For gaining %score% points through playing Freeze.','ACH_FreezePlayer','[50,125,240,410,655,1045,1615,2465,2765,6215,10865,19665,68115,128415,242965,460615,874115,1659765,3123515]','2026-03-23 18:27:00','2026-03-29 17:48:04',NULL,'games'),('FreezePowerUpper','Freeze Power-Upper','For collecting %score% power-ups while playing Freeze.','ACH_FreezePowerUp','[100,300,600,1000,1500,2100,2900,3900,5200,6800,8800,11200,14100,17600,22100,28100,36100,48100,66100,96100]','2026-03-23 18:27:00','2026-03-29 17:48:04',NULL,'games'),('FreezeWinner','Freeze Winner','For gaining %score% winner points while playing Freeze.','ACH_FreezeWinner','[50,125,240,410,655,1045,1615,2465,2765,6215,10865,19665,68115,128415,242965,460615,874115,1659765,3123515]','2026-03-23 18:27:00','2026-03-29 17:48:04',NULL,'games'),('FurniCollector','Furni Collector','For collecting %score% different items of furni.','ACH_RoomDecoFurniTypeCount','[10,12,14,19,24,29,39,49,59,74,89,104,124,144,174,204,244,284,334,384]','2026-03-29 03:40:08','2026-03-29 17:48:04',NULL,'room_builder'),('GameArcadeOwner','Game Arcade Owner','For having users score %score% points in your game rooms.','ACH_GameAuthorExperience','[400,1000,2000,3600,6200,10400,17100,27800,45000,77600,139600,257600,481600,906600,1714600,3250600,6168600,11712600,22245600,42258600]','2026-03-29 13:33:41','2026-03-29 17:48:04',NULL,'room_builder'),('IceIceBadge','Ice Ice baby','For spending %score% minutes on a skate rink.','ACH_TagC','[3,8,16,31,51,81,121,171,231,301,381,471,571,681,801,931,1071,1221,1381,1551]','2026-03-22 01:33:38','2026-03-29 17:48:04',NULL,'games'),('IceRinkBuilder','Ice Rink Builder','For creating an Ice Rink using %score% Skating Patches.','ACH_TagA','[10,20,30,45,60,80,100,125,150,170]','2026-03-22 01:33:38','2026-03-29 17:48:04',NULL,'room_builder'),('LordOfTheTiles','Lord of the Tiles','For locking %score% tiles playing Battle Banzai.','ACH_BattleBallTilesLocked','[25,65,125,205,335,525,805,1235,1875,2875,4375,6875,10775,17075,27175,43275,69075,110375,176375,282075]','2026-03-28 09:06:35','2026-03-29 17:48:04',NULL,'games'),('Player','Playeer','For earning %score% victory points playing games.','ACH_GamePlayerExperience','[100,250,480,820,1330,2090,3230,4930,7530,12430,21730,39330,72730,136230,256830,485930,921230,1748230,3319530,6305030]','2026-03-28 11:37:04','2026-03-29 17:48:04',NULL,'games'),('RollerRinkBuilder','Roller Rink Builder','For creating a Roller Rink using %score% Roller Patches.','ACH_RbTagA','[10,20,30,45,60,80,100,125,150,170]','2026-03-29 13:33:41','2026-03-29 17:48:04',NULL,'room_builder'),('RoomBuilder','Room Builder','For building a room with %score% items of furni.','ACH_RoomDecoFurniCount','[15,20,25,30,35,45,55,65,80,95,110,130,150,170,200,230,270,310,360,410]','2026-03-29 03:40:08','2026-03-29 17:48:04',NULL,'room_builder'),('RoomHost','Room Host','For having other Habbos spend %score% minutes in a room.','ACH_RoomDecoHosting','[5,15,20,40,90,190,390,790,1790,3790,7790,17790,37790,77790,177790,677790,1677790,6677790,33355580]','2026-03-29 03:40:08','2026-03-29 17:48:04',NULL,'room_builder'),('SkateboardJumper','Skateboard Jumper','For completing %score% jumps on a skateboard.','ACH_SkateBoardJump','[5,13,25,45,75,120,185,300,475,750,1125,1675,2500,3750,5600,8750,13500,20000,30000,50000]','2026-03-28 17:45:42','2026-03-29 17:48:04',NULL,'games'),('SkateboardSlider','Skateboard Slider','For sliding %score% times on a skateboard.','ACH_SkateBoardSlide','[20,50,100,180,300,480,750,1200,1900,3000,4500,6700,10000,15000,22500,35000,54000,80000,120000,200000]','2026-03-28 17:45:42','2026-03-29 17:48:04',NULL,'games'),('SnowBoardBuilder','Snowboarding Builder','For creating a slope using %score% Snowboard Patches.','ACH_snowBoardBuild','[16,36,64,100,160]','2026-03-29 03:39:07','2026-03-29 17:48:04',NULL,'room_builder'),('SnowboardJumps','Snowboard Jumps','For hitting an ollie or 360 %score% times while Snowboarding.','ACH_SnowB','[1,4,9,17,29,44,62,87,114,144,186,242,314,402,498,618,754,905,1084,1284]','2026-03-29 04:10:35','2026-03-29 17:48:04',NULL,'games'),('TrueHabbo','True Habbo','For building registered on Habbo for %score% days.','ACH_RegistrationDuration','[1,3,10,20,30,56,84,112,168,224,280,365,548,730,913,1095,1278,1460,1643,1825]','2026-03-29 13:33:41','2026-03-29 17:48:04',NULL,'profile');
/*!40000 ALTER TABLE `achievements` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-29 20:41:39
