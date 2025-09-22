-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: webapp
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
-- Table structure for table `attiva`
--

DROP TABLE IF EXISTS `attiva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attiva` (
  `CF` char(16) NOT NULL,
  `ID_offerta` int NOT NULL,
  `Data_attivazione` date DEFAULT NULL,
  PRIMARY KEY (`CF`,`ID_offerta`),
  KEY `ID_offerta_idx` (`ID_offerta`),
  CONSTRAINT `CF` FOREIGN KEY (`CF`) REFERENCES `utente` (`CF`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ID_offerta` FOREIGN KEY (`ID_offerta`) REFERENCES `offerta` (`ID_OFFERTA`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attiva`
--

LOCK TABLES `attiva` WRITE;
/*!40000 ALTER TABLE `attiva` DISABLE KEYS */;
INSERT INTO `attiva` VALUES ('RSSMRA85T10A562S',1,'2025-09-22'),('RSSMRA85T10A562S',2,'2025-09-22'),('RSSMRA85T10A562S',3,'2025-09-22');
/*!40000 ALTER TABLE `attiva` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `bolletta` VALUES (1,'2025-09-24',38.22,'Rifiuti','2025-09-22',8,2,'RSSMRA85T10A562S'),(2,'2025-08-23',28.02,'Luce','2025-09-22',1,1,'RSSMRA85T10A562S'),(3,'2025-08-21',130.54,'WiFi','2025-09-22',2,3,'RSSMRA85T10A562S'),(4,'2024-05-06',800.00,'Luce','2025-08-22',7,5,'RSSMRA85T10A562S'),(5,'2025-08-27',650.00,'Luce','2025-08-26',1,5,'RSSMRA85T10A562S'),(6,'2021-08-30',50.00,'WiFi','2021-09-17',2,5,'RSSMRA85T10A562S'),(30,'2021-03-15',300.00,'Acqua','2025-08-26',6,2,'RSSMRA85T10A562S'),(31,'2021-07-18',75.00,'Rifiuti','2021-07-17',9,2,'RSSMRA85T10A562S'),(32,'2021-11-22',38.00,'WiFi','2021-11-21',4,3,'RSSMRA85T10A562S'),(33,'2022-02-20',120.00,'Acqua','2022-02-19',6,2,'RSSMRA85T10A562S'),(34,'2022-06-25',95.00,'Luce','2022-06-24',7,1,'RSSMRA85T10A562S'),(35,'2022-10-30',150.00,'Acqua','2022-10-29',6,2,'RSSMRA85T10A562S'),(36,'2023-01-22',130.00,'Gas','2023-01-21',3,4,'RSSMRA85T10A562S'),(37,'2023-05-28',100.00,'Acqua','2023-05-27',6,2,'RSSMRA85T10A562S'),(38,'2023-09-19',500.00,'WiFi','2023-09-18',4,3,'RSSMRA85T10A562S'),(39,'2024-03-15',140.00,'Gas','2024-03-14',3,4,'RSSMRA85T10A562S'),(40,'2024-07-20',110.00,'Luce','2024-07-19',7,1,'RSSMRA85T10A562S'),(41,'2024-11-25',45.00,'WiFi','2024-11-24',4,3,'RSSMRA85T10A562S'),(42,'2025-02-10',150.00,'Gas','2025-02-09',10,4,'RSSMRA85T10A562S'),(43,'2025-06-18',115.00,'Luce','2025-06-17',1,1,'RSSMRA85T10A562S'),(44,'2025-09-22',47.00,'Rifiuti','2025-09-21',9,2,'RSSMRA85T10A562S');
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
  `telefono` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`D_FORNITORE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornitore`
--

LOCK TABLES `fornitore` WRITE;
/*!40000 ALTER TABLE `fornitore` DISABLE KEYS */;
INSERT INTO `fornitore` VALUES (1,'3334445555','Enel'),(2,'345954444','Hera'),(3,'3216540987','Telecom'),(4,'3456789012','Agip'),(5,'3579124680','Enel');
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
  `descrizione` varchar(255) DEFAULT NULL,
  `DATA_INIZIO` date DEFAULT NULL,
  `DATA_FINE` date DEFAULT NULL,
  `IMPORTO` decimal(10,2) DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `D_FORNITORE` int DEFAULT NULL,
  `durata_mese` int DEFAULT NULL,
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
INSERT INTO `offerta` VALUES (1,'Energia verde','2025-05-08','2025-10-12',45.00,'Luce',1,12),(2,'Modem gratuito','2025-07-09','2026-08-08',234.00,'WiFi',3,6),(3,'Pagamento a rate','2025-09-09','2026-09-07',235.00,'GAS',4,12),(4,'Nessun vincolo','2025-08-06','2026-04-01',130.00,'WiFi',3,4),(5,'Modem gratuito','2025-09-10','2026-12-12',140.00,'WiFi',5,8),(6,'Energia verde','2025-09-13','2026-06-04',50.00,'Acqua',2,6),(7,'Energia verde','2025-01-02','2026-09-30',240.00,'Luce',5,4),(8,'Pagamento a rate','2024-10-10','2025-12-30',170.00,'Rifiuti',2,8),(9,'Nessun vincolo','2024-11-23','2025-11-29',150.00,'Rifiuti',2,24),(10,'Nessun vincolo','2024-01-21','2026-03-04',260.00,'GAS',4,12);
/*!40000 ALTER TABLE `offerta` ENABLE KEYS */;
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
  `punti` int DEFAULT '0',
  `ultimo_accesso` date DEFAULT NULL,
  PRIMARY KEY (`CF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utente`
--

LOCK TABLES `utente` WRITE;
/*!40000 ALTER TABLE `utente` DISABLE KEYS */;
INSERT INTO `utente` VALUES ('BLNMTT02E21T521R','matteo.balboni@gmail.com','Matteo','Balboni',0,'balbo',1000,NULL),('NTGNRC03R07C326T','enrico.antiga@gmail.com','enrico','antiga',NULL,'eaprova',2000,'2025-08-22'),('PNNLXA03R10D548V','alex.penna@gmail.com','alex','pennini',NULL,'penna',8000,'2025-09-10'),('RSSMRA85T10A562S','matteo.ambo@gmail.com','Matteo','Ambonati',NULL,'qwerty',5000,'2025-09-22'),('RSSMTT56A12G598W','rossimatteo@HRFlow.it','Matteo','Rossi',3000,'prova1',3500,'2025-09-21');
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

-- Dump completed on 2025-09-22 14:56:54
