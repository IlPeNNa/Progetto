-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: webapp
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `bolletta`
--

DROP TABLE IF EXISTS `bolletta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bolletta` (
  `ID_BOLLETTA` int NOT NULL,
  `SCADENZA` date DEFAULT NULL,
  `IMPORTO` decimal(10,2) DEFAULT NULL,
  `TIPOLOGIA` varchar(50) DEFAULT NULL,
  `DATA_PAGAMENTO` date DEFAULT NULL,
  `ID_OFFERTA` int DEFAULT NULL,
  `D_FORNITORE` int DEFAULT NULL,
  `CF` char(16) DEFAULT NULL,
  PRIMARY KEY (`ID_BOLLETTA`),
  KEY `ID_OFFERTA` (`ID_OFFERTA`),
  KEY `D_FORNITORE` (`D_FORNITORE`),
  KEY `CF` (`CF`),
  CONSTRAINT `bolletta_ibfk_1` FOREIGN KEY (`ID_OFFERTA`) REFERENCES `offerta` (`ID_OFFERTA`),
  CONSTRAINT `bolletta_ibfk_2` FOREIGN KEY (`D_FORNITORE`) REFERENCES `fornitore` (`D_FORNITORE`),
  CONSTRAINT `bolletta_ibfk_3` FOREIGN KEY (`CF`) REFERENCES `utente` (`CF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bolletta`
--

LOCK TABLES `bolletta` WRITE;
/*!40000 ALTER TABLE `bolletta` DISABLE KEYS */;
INSERT INTO `bolletta` VALUES (1,'2025-06-07',45.00,'Gas','2025-09-12',1,1,'RSSMRA85T10A562S'),(2,'2025-05-05',34.00,'Enel','2026-05-09',1,2,'RSSMRA85T10A562S'),(3,'2024-04-06',444.00,'WiFi','2026-05-05',1,3,'RSSMRA85T10A562S'),(4,'2024-05-06',34555.00,'Enel','2025-08-09',1,4,'RSSMRA85T10A562S');
/*!40000 ALTER TABLE `bolletta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fornitore`
--

DROP TABLE IF EXISTS `fornitore`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornitore` (
  `D_FORNITORE` int NOT NULL,
  `TELEFONO` varchar(20) DEFAULT NULL,
  `NOME` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`D_FORNITORE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornitore`
--

LOCK TABLES `fornitore` WRITE;
/*!40000 ALTER TABLE `fornitore` DISABLE KEYS */;
INSERT INTO `fornitore` VALUES (1,'0511234567','Enel'),(2,'345954444','Gas'),(3,'44444444','WiFi'),(4,'4444444','Enel');
/*!40000 ALTER TABLE `fornitore` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offerta`
--

DROP TABLE IF EXISTS `offerta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offerta` (
  `ID_OFFERTA` int NOT NULL,
  `DESCRIZIONE` text,
  `DATA_INIZIO` date DEFAULT NULL,
  `DATA_FINE` date DEFAULT NULL,
  `IMPORTO` decimal(10,2) DEFAULT NULL,
  `TIPO` enum('LUCE','GAS') DEFAULT NULL,
  `D_FORNITORE` int DEFAULT NULL,
  PRIMARY KEY (`ID_OFFERTA`),
  KEY `D_FORNITORE` (`D_FORNITORE`),
  CONSTRAINT `offerta_ibfk_1` FOREIGN KEY (`D_FORNITORE`) REFERENCES `fornitore` (`D_FORNITORE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offerta`
--

LOCK TABLES `offerta` WRITE;
/*!40000 ALTER TABLE `offerta` DISABLE KEYS */;
INSERT INTO `offerta` VALUES (1,'ciao','2025-05-08','2025-10-12',45.00,'GAS',1);
/*!40000 ALTER TABLE `offerta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_entity`
--

DROP TABLE IF EXISTS `sample_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sample_entity` (
  `id` binary(16) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_entity`
--

LOCK TABLES `sample_entity` WRITE;
/*!40000 ALTER TABLE `sample_entity` DISABLE KEYS */;
/*!40000 ALTER TABLE `sample_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servizio`
--

DROP TABLE IF EXISTS `servizio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servizio` (
  `ID_SERVIZIO` int NOT NULL,
  `NOME` varchar(100) DEFAULT NULL,
  `D_FORNITORE` int DEFAULT NULL,
  PRIMARY KEY (`ID_SERVIZIO`),
  KEY `D_FORNITORE` (`D_FORNITORE`),
  CONSTRAINT `servizio_ibfk_1` FOREIGN KEY (`D_FORNITORE`) REFERENCES `fornitore` (`D_FORNITORE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servizio`
--

LOCK TABLES `servizio` WRITE;
/*!40000 ALTER TABLE `servizio` DISABLE KEYS */;
/*!40000 ALTER TABLE `servizio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utente`
--

DROP TABLE IF EXISTS `utente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utente` (
  `CF` char(16) NOT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `cognome` varchar(255) DEFAULT NULL,
  `stipendio` double DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utente`
--

LOCK TABLES `utente` WRITE;
/*!40000 ALTER TABLE `utente` DISABLE KEYS */;
INSERT INTO `utente` VALUES ('eeeeee','orsetto.ambo@gmail.com','matteo','rossi',0,'1234'),('eeeeeeeee','enrico.antiga@gmail.com','enrico','antiga',0,'er'),('rrrrrrrrrrrrrrrr','alex.penna@gmail.com','alex','pennini',0,'penna'),('RSSMRA85T10A562S','matteo.ambo@gmail.com','Matteo','Ambonati',2400.5,'qwerty'),('ttttttttt','matteo.balboni@gmail.com','Matteo','Balboni',0,'balbo');
/*!40000 ALTER TABLE `utente` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-09 13:47:13
