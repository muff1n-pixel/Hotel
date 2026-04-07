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
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20260213182656-add-room-categories-table.js'),('20260213200526-add-room-thumbnail.js'),('20260213235800-add-habbo-club-xray-divider.js'),('20260214105400-add-user-badges.js'),('20260214145500-add-user-motto.js'),('20260214170700-add-habbo-club-roller.js'),('20260214194100-add-room-speed-flag.js'),('20260214215200-add-custom-pixel63-badges.js'),('20260215095900-add-gender-to-figure-configuration.js'),('20260215163300-add-background-furniture.js'),('20260215190500-add-welcome-lounge-furniture.js'),('20260216164700-add-room-type-column.js'),('20260216185400-add-furniture-index.js'),('20260216185400-fix-shop-page-description-size.js'),('20260217180500-add-developer-permissions.js'),('20260217185300-add-new-permissions.js'),('20260218171600-add-shop-frontpage.js'),('20260219160000-fix-vending-machine-custom-params.js'),('20260219181300-add-picnic-furniture.js'),('20260220213600-fix-postit-interaction-type.js'),('20260221133200-add-furniture-permissions.js'),('20260221133200-add-give-command-permissions.js'),('20260221145900-add-missing-default-room-maps.js'),('20260222150400-fix-fortune-interaction-types.js'),('20260223155000-add-user-online-column.js'),('20260223155800-add-user-email-column.js'),('20260223181100-add-user-bot-relaxed-column.js'),('20260223181100-add-user-bot-speech-column.js'),('20260227172800-add-missing-wif_trg_stuff_state-furni.js'),('20260227172800-add-wf_trg_leave_room.js'),('20260227182700-add-wf_trg_click_furni-user-tile.js'),('20260227185300-add-conf_invis_control.js'),('20260227202200-add-wf_trg_period_short.js'),('20260227204100-add-wf_trg_user_performs_action.js'),('20260227212000-add-wf_trg_recv_signal.js'),('20260227212900-add-wired-antennas.js'),('20260227213700-add-add-wf_act_send_signal.js'),('20260301164500-fix-furniture-custom-params.js'),('20260301202500-fix-ads_bg-dats.js'),('20260302161400-add-user-last-login-column.js'),('20260311194300-add-pets-permissions.js'),('20260312170300-add-edit-pets-permissions.js'),('20260317185400-add-hygge-c25-furniture.js'),('20260317193300-add-room-bundle-category.js'),('20260318170300-add-edit-badge-permissions.js'),('20260319171000-add-room-lock-column.js'),('20260326164500-fix-furniture-descriptions.js'),('20260328002500-add-room-rights-permissions.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-29 20:41:36
