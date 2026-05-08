-

-- ========================================================
-- Table utilisateurs (pour l'authentification)
-- ========================================================
DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Utilisateur de test (email: admin@test.com, mot de passe: password123)
INSERT INTO `utilisateurs` (`nom`, `email`, `password`, `role`) VALUES
('Admin Test', 'admin@test.com', '$2b$10$eQB.VJUHndfJJ1vDRIg5s.aH.aMZn5SYfbvilu7NATDuHaxAZtfwG', 'admin');

-- ========================================================

DROP TABLE IF EXISTS `annee_academique`;
CREATE TABLE IF NOT EXISTS `annee_academique` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `est_active` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `libelle_UNIQUE` (`libelle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `civilites`
--

DROP TABLE IF EXISTS `civilites`;
CREATE TABLE IF NOT EXISTS `civilites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviation` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `libelle_UNIQUE` (`libelle`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `civilites`
--

INSERT INTO `civilites` (`id`, `libelle`, `abreviation`) VALUES
(1, 'Monsieur', 'M.'),
(2, 'Madame', 'Mme'),
(3, 'Mademoiselle', 'Mlle'),
(4, 'Docteur', 'Dr'),
(5, 'Professeur', 'Pr');

-- --------------------------------------------------------

--
-- Structure de la table `cycles`
--

DROP TABLE IF EXISTS `cycles`;
CREATE TABLE IF NOT EXISTS `cycles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duree_annees` int NOT NULL DEFAULT '3',
  PRIMARY KEY (`id`),
  UNIQUE KEY `libelle_UNIQUE` (`libelle`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cycles`
--

INSERT INTO `cycles` (`id`, `libelle`, `duree_annees`) VALUES
(1, 'Licence', 3),
(2, 'Master', 2),
(3, 'Doctorat', 3),
(4, 'DUT', 2),
(5, 'BTS', 2);

-- --------------------------------------------------------

--
-- Structure de la table `decisions`
--

DROP TABLE IF EXISTS `decisions`;
CREATE TABLE IF NOT EXISTS `decisions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `libelle_UNIQUE` (`libelle`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `decisions`
--

INSERT INTO `decisions` (`id`, `libelle`, `description`) VALUES
(1, 'Admis', 'Étudiant admis'),
(2, 'Admis sous condition', 'Admis avec conditions supplémentaires'),
(3, 'Liste d\'attente', 'En liste d\'attente'),
(4, 'Refusé', 'Candidature refusée'),
(5, 'Inscrit', 'Étudiant inscrit'),
(6, 'Exclu', 'Étudiant exclu'),
(7, 'Diplômé', 'Étudiant diplômé');

-- --------------------------------------------------------

--
-- Structure de la table `ecoles`
--

DROP TABLE IF EXISTS `ecoles`;
CREATE TABLE IF NOT EXISTS `ecoles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` text COLLATE utf8mb4_unicode_ci,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `libelle_UNIQUE` (`libelle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ecoles_filieres`
--

DROP TABLE IF EXISTS `ecoles_filieres`;
CREATE TABLE IF NOT EXISTS `ecoles_filieres` (
  `ecoles_id` int NOT NULL,
  `filieres_id` int NOT NULL,
  `statut` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT 'actif',
  `date_ouverture` date DEFAULT NULL,
  PRIMARY KEY (`ecoles_id`,`filieres_id`),
  KEY `fk_ecoles_filieres_filieres_idx` (`filieres_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `etudiants`
--

DROP TABLE IF EXISTS `etudiants`;
CREATE TABLE IF NOT EXISTS `etudiants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenoms` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays_id` int NOT NULL,
  `civilites_id` int NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_etudiants_pays_idx` (`pays_id`),
  KEY `fk_etudiants_civilites_idx` (`civilites_id`),
  KEY `idx_etudiants_nom` (`nom`),
  KEY `idx_etudiants_prenoms` (`prenoms`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `filieres`
--

DROP TABLE IF EXISTS `filieres`;
CREATE TABLE IF NOT EXISTS `filieres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `libelle_UNIQUE` (`libelle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `inscriptions`
--

DROP TABLE IF EXISTS `inscriptions`;
CREATE TABLE IF NOT EXISTS `inscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `etudiants_id` int NOT NULL,
  `parcours_id` int NOT NULL,
  `annee_academique_id` int NOT NULL,
  `decisions_id` int NOT NULL,
  `date_inscription` date NOT NULL,
  `montant_paye` decimal(10,2) DEFAULT '0.00',
  `statut_paiement` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'impayé',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_inscriptions_etudiants_idx` (`etudiants_id`),
  KEY `fk_inscriptions_parcours_idx` (`parcours_id`),
  KEY `fk_inscriptions_annee_academique_idx` (`annee_academique_id`),
  KEY `fk_inscriptions_decisions_idx` (`decisions_id`),
  KEY `idx_inscriptions_date` (`date_inscription`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `niveaux`
--

DROP TABLE IF EXISTS `niveaux`;
CREATE TABLE IF NOT EXISTS `niveaux` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ordre` int NOT NULL,
  `cycles_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `libelle_UNIQUE` (`libelle`),
  KEY `fk_niveaux_cycles_idx` (`cycles_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `parcours`
--

DROP TABLE IF EXISTS `parcours`;
CREATE TABLE IF NOT EXISTS `parcours` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `specialites_id` int NOT NULL,
  `niveaux_id` int NOT NULL,
  `credits_requis` int DEFAULT '30',
  PRIMARY KEY (`id`),
  UNIQUE KEY `libelle_UNIQUE` (`libelle`),
  KEY `fk_parcours_specialites_idx` (`specialites_id`),
  KEY `fk_parcours_niveaux_idx` (`niveaux_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `pays`
--

DROP TABLE IF EXISTS `pays`;
CREATE TABLE IF NOT EXISTS `pays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `libelle_UNIQUE` (`libelle`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `pays`
--

INSERT INTO `pays` (`id`, `libelle`, `code`) VALUES
(1, 'France', 'FRA'),
(2, 'Belgique', 'BEL'),
(3, 'Suisse', 'CHE'),
(4, 'Canada', 'CAN'),
(5, 'Sénégal', 'SEN'),
(6, 'Côte d\'Ivoire', 'CIV'),
(7, 'Maroc', 'MAR'),
(8, 'Tunisie', 'TUN');



DROP TABLE IF EXISTS `specialites`;
CREATE TABLE IF NOT EXISTS `specialites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `libelle` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filieres_id` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `libelle_UNIQUE` (`libelle`),
  KEY `fk_specialites_filieres_idx` (`filieres_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-`
--
ALTER TABLE `ecoles_filieres`
  ADD CONSTRAINT `fk_ecoles_filieres_ecoles` FOREIGN KEY (`ecoles_id`) REFERENCES `ecoles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ecoles_filieres_filieres` FOREIGN KEY (`filieres_id`) REFERENCES `filieres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `etudiants`
--
ALTER TABLE `etudiants`
  ADD CONSTRAINT `fk_etudiants_civilites` FOREIGN KEY (`civilites_id`) REFERENCES `civilites` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_etudiants_pays` FOREIGN KEY (`pays_id`) REFERENCES `pays` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `inscriptions`
--
ALTER TABLE `inscriptions`
  ADD CONSTRAINT `fk_inscriptions_annee_academique` FOREIGN KEY (`annee_academique_id`) REFERENCES `annee_academique` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscriptions_decisions` FOREIGN KEY (`decisions_id`) REFERENCES `decisions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscriptions_etudiants` FOREIGN KEY (`etudiants_id`) REFERENCES `etudiants` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_inscriptions_parcours` FOREIGN KEY (`parcours_id`) REFERENCES `parcours` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `niveaux`
--
ALTER TABLE `niveaux`
  ADD CONSTRAINT `fk_niveaux_cycles` FOREIGN KEY (`cycles_id`) REFERENCES `cycles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `parcours`
--
ALTER TABLE `parcours`
  ADD CONSTRAINT `fk_parcours_niveaux` FOREIGN KEY (`niveaux_id`) REFERENCES `niveaux` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_parcours_specialites` FOREIGN KEY (`specialites_id`) REFERENCES `specialites` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `specialites`
--
ALTER TABLE `specialites`
  ADD CONSTRAINT `fk_specialites_filieres` FOREIGN KEY (`filieres_id`) REFERENCES `filieres` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
