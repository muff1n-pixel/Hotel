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
-- Table structure for table `pet_breeds`
--

DROP TABLE IF EXISTS `pet_breeds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pet_breeds` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `name` varchar(256) NOT NULL,
  `index` int NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pet_breeds`
--

LOCK TABLES `pet_breeds` WRITE;
/*!40000 ALTER TABLE `pet_breeds` DISABLE KEYS */;
INSERT INTO `pet_breeds` VALUES ('01ee2ac2-da2d-49b6-9125-cab589abd737','monkey','Purple Monkey',0,'2026-03-12 19:53:00','2026-03-12 19:53:00'),('043195ef-fdf8-4deb-a1ef-f1edb5f867d3','turtle','Yertle Turtle',0,'2026-03-12 20:29:06','2026-03-12 20:29:06'),('04b4eefd-c732-4c47-9100-7782372293cc','monkey','Orange Monkey',0,'2026-03-12 19:54:06','2026-03-12 19:54:06'),('0519d5d7-1c7e-425b-8c9f-8910017fff4c','croco','Light Olive Croc',0,'2026-03-12 20:54:51','2026-03-12 20:54:51'),('06ac72a6-c98f-42ed-8257-f66676b0c01f','horse','Mustang',3,'2026-03-12 16:37:48','2026-03-12 16:37:48'),('0845da8a-f725-4711-9ee9-0a1b358a252a','croco','Pink Croc',0,'2026-03-12 20:54:32','2026-03-12 20:54:32'),('1072ce4a-8707-4dc3-aae7-81c2cb353993','lion','West African Lion',0,'2026-03-12 20:20:53','2026-03-12 20:20:53'),('140870fb-854b-4394-bd91-c98385cec530','turtle','Sewer Turtle',0,'2026-03-12 20:29:34','2026-03-12 20:29:34'),('16f791b8-0a80-4298-9291-04428e2175dd','terrier','Lucy\'s Fred',0,'2026-03-12 18:48:58','2026-03-12 18:48:58'),('1867f3dd-d986-4087-83b9-b1cada43047b','monkey','Blue Monkey',0,'2026-03-12 19:52:24','2026-03-12 19:52:24'),('19ac81a0-508b-41f0-a0a4-c1c02d474371','turtle','Pond Turtle',0,'2026-03-12 20:27:57','2026-03-12 20:27:57'),('1a82fce8-8a38-4039-8eaf-2f08c91bd422','monkey','Grey Monkey',0,'2026-03-12 19:51:09','2026-03-12 19:51:09'),('1ebe0bf5-ffd5-4643-a35a-b0fa68ab6196','turtle','Snapping Turtle',0,'2026-03-12 20:26:22','2026-03-12 20:26:22'),('29eb30ff-0ed8-4aad-ad1c-a6d84b24d8ad','pig','Roman Boar',0,'2026-03-12 21:01:29','2026-03-12 21:01:29'),('2e78d25c-bd9b-4169-bb06-9aeadfaed6fe','turtle','Kooper Trooper',0,'2026-03-12 20:27:34','2026-03-12 20:27:34'),('356dc372-3e5f-481d-9a57-6d1f38d234ed','terrier','Dee Mice Killer',0,'2026-03-12 18:45:55','2026-03-12 18:45:55'),('3778abb7-eaac-4b37-9801-bb80d540dc26','monkey','Beige Monkey',0,'2026-03-12 19:53:17','2026-03-12 19:53:17'),('4474e015-9a21-4353-a841-9f73f9d0c2f7','rhino','Gray Rhino',0,'2026-03-12 20:56:51','2026-03-12 20:56:51'),('49a92258-501e-4ec7-b559-f79d99e75166','terrier','Livingston\'s Nightmare',0,'2026-03-12 17:10:46','2026-03-12 17:10:46'),('62b8831b-1f16-4d55-ae14-02e3fb88b67d','turtle','Sea Turtle',0,'2026-03-12 20:27:08','2026-03-12 20:27:08'),('67f95f14-34bb-4f67-bc7a-9e63f6a3a264','monkey','Red Monkey',0,'2026-03-12 19:50:46','2026-03-12 19:50:46'),('6c92a5bf-df64-4df3-bd76-8a47ccb9d34f','terrier','Carlisle Ratter',0,'2026-03-12 18:44:50','2026-03-12 18:44:50'),('701155c7-855a-4ca3-ba05-750bbd08cb0f','terrier','Holy Island Rabbit Lover',0,'2026-03-12 18:46:47','2026-03-12 18:46:47'),('7ec34744-e984-4c2f-8c2f-f33ba6cde98d','dog','Yappy Yorkie',0,'2026-03-12 20:59:18','2026-03-12 20:59:18'),('82ef29df-1468-416f-a91e-c70af938213a','bear','Brown Bear',0,'2026-03-12 20:02:38','2026-03-12 20:02:38'),('858f38b2-9a72-482a-995b-62959acc8c2c','monkey','Light Brown Monkey',0,'2026-03-12 19:37:27','2026-03-12 19:37:27'),('862b79c3-8b02-435f-a47a-bcb3b834c6f5','monkey','Olive Monkey',0,'2026-03-12 19:54:52','2026-03-12 19:54:52'),('86560f8a-dc64-4c84-94f1-4353fb950346','dragon','Volcanic Fire Dragon',0,'2026-03-12 20:09:12','2026-03-12 20:09:12'),('93302c27-0ae9-4014-b551-eed8316df3b7','horse','Appaloosa',2,'2026-03-12 16:30:18','2026-03-12 16:30:18'),('97de447d-0f93-46b5-a375-b3db58e6c7cf','turtle','Diamondback Turtle',0,'2026-03-12 20:26:44','2026-03-12 20:26:44'),('985d2145-ec3f-489c-a642-e92631617714','horse','Arabian',1,'2026-03-12 16:26:44','2026-03-12 16:26:44'),('9a247de3-59a1-49ca-b43c-0230d449c013','monkey','Albino Monkey',0,'2026-03-12 19:54:29','2026-03-12 19:54:29'),('9c4dd050-913e-49b8-b046-6355cfd46bcf','monkey','Pink Monkey',0,'2026-03-12 19:51:52','2026-03-12 19:51:52'),('9c53c056-85e5-4a47-afca-6dea08a7a746','spider','Australian Spider',0,'2026-03-12 20:57:46','2026-03-12 20:57:46'),('b05d9227-8213-46dd-8422-64901d904d9a','croco','Green Croc',0,'2026-03-12 20:54:39','2026-03-12 20:54:39'),('b42a5794-16d4-449c-9ce5-3a4165fc681e','croco','Croc',0,'2026-03-12 20:38:38','2026-03-12 20:38:38'),('b9875894-17fb-421c-afc4-b1b1389f1e6e','terrier','Working Scottie',0,'2026-03-12 18:39:03','2026-03-12 18:39:03'),('bd50db1c-2ccb-469d-b944-fcfa690399d3','dragon','Midnight Glider Dragon',0,'2026-03-12 20:11:25','2026-03-12 20:11:25'),('c13bfeb8-9f3e-443d-b634-84c95b842451','monkey','Yellow Monkey',0,'2026-03-12 19:51:32','2026-03-12 19:51:32'),('c6824272-4f27-4351-97d9-0ec9fcbec0e4','cat','Sleepy Siamese',0,'2026-03-12 21:00:33','2026-03-12 21:00:33'),('caa7c1f4-a833-49cb-840b-427053c7f9aa','horse','Icelandic',4,'2026-03-12 16:43:51','2026-03-12 16:43:51'),('ceb0e87c-6c2f-42a1-8f05-5c2381d2e340','turtle','Spotted Turtle',0,'2026-03-12 20:28:26','2026-03-12 20:28:26'),('d48b4e5a-52be-48ff-ae10-ff75d583c7f2','monkey','Dark Brown Monkey',0,'2026-03-12 19:28:30','2026-03-12 19:28:30'),('d60bd6cc-78a7-4159-b3d6-9b90c12bba49','dragon','Emerald Earth Dragon',0,'2026-03-12 20:09:35','2026-03-12 20:09:35'),('d627dfd9-b38a-4a05-ae03-6cc90220387d','frog','Tree Frog',0,'2026-03-12 21:03:23','2026-03-12 21:03:23'),('d69e596a-8907-4988-b819-ddc5d1756ba4','monkey','Violet Monkey',0,'2026-03-12 19:53:42','2026-03-12 19:53:42'),('dd2628fa-22cc-4834-a1ee-b88ae7348033','dragon','Bronze Cave Dragon',0,'2026-03-12 20:10:05','2026-03-12 20:10:05'),('dfce5ebd-0077-42af-9f75-694f7ef22e94','dragon','Crystal Cove Dragon',0,'2026-03-12 20:11:50','2026-03-12 20:11:50'),('e4a237b7-db36-4754-9abd-bc56bdf16bdc','turtle','Desert Turtle',0,'2026-03-12 20:29:59','2026-03-12 20:29:59'),('ed4d4aea-92bc-435e-b00b-daf94a50c7b0','monkey','Brown Monkey',0,'2026-03-12 19:27:46','2026-03-12 19:27:46'),('eeb7d885-cca1-4fba-a59c-1a2c8c704f1b','dragon','Twilight Hunter Dragon',0,'2026-03-12 20:10:54','2026-03-12 20:10:54'),('fe546a08-b778-402c-bace-83c58f97890d','terrier','Doon Squirrel Hunter',0,'2026-03-12 18:47:55','2026-03-12 18:47:55');
/*!40000 ALTER TABLE `pet_breeds` ENABLE KEYS */;
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
