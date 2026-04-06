-- ============================================================
-- Franquia Avalia - Complete Database Setup (Schema + Seed)
-- Import this file in phpMyAdmin
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;

-- ============================================================
-- CREATE TABLES
-- ============================================================

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('INVESTOR', 'FRANCHISEE', 'COMPANY', 'ADMIN') NOT NULL DEFAULT 'INVESTOR',
    `emailVerified` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,
    `access_token` VARCHAR(191) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` VARCHAR(191) NULL,

    UNIQUE INDEX `accounts_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `franqueados` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `franquiaId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `franqueados_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `franquias` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NULL,
    `descricao` TEXT NULL,
    `logo` VARCHAR(191) NULL,
    `capa` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `segmento` ENUM('ALIMENTACAO', 'SAUDE_BELEZA', 'EDUCACAO', 'SERVICOS', 'MODA', 'TECNOLOGIA', 'CASA_CONSTRUCAO', 'AUTOMOTIVO', 'ENTRETENIMENTO', 'FINANCEIRO', 'LIMPEZA', 'PETS', 'OUTROS') NOT NULL,
    `investimentoMin` DECIMAL(12, 2) NULL,
    `investimentoMax` DECIMAL(12, 2) NULL,
    `taxaFranquia` DECIMAL(12, 2) NULL,
    `royalties` VARCHAR(191) NULL,
    `unidades` INTEGER NULL,
    `fundacao` INTEGER NULL,
    `sede` VARCHAR(191) NULL,
    `faturamentoMedio` DECIMAL(12, 2) NULL,
    `prazoRetorno` VARCHAR(191) NULL,
    `plano` ENUM('FREE', 'INICIANTE', 'AVANCADO', 'PREMIUM') NOT NULL DEFAULT 'FREE',
    `videoUrl` VARCHAR(191) NULL,
    `faq` JSON NULL,
    `ctaTexto` VARCHAR(191) NULL,
    `ctaUrl` VARCHAR(191) NULL,
    `seloVerificada` BOOLEAN NOT NULL DEFAULT false,
    `seloFA1000` BOOLEAN NOT NULL DEFAULT false,
    `notaGeral` DECIMAL(3, 1) NULL,
    `notaSuporte` DECIMAL(3, 1) NULL,
    `notaRentabilidade` DECIMAL(3, 1) NULL,
    `notaTransparencia` DECIMAL(3, 1) NULL,
    `notaTreinamento` DECIMAL(3, 1) NULL,
    `notaMarketing` DECIMAL(3, 1) NULL,
    `notaSatisfacao` DECIMAL(3, 1) NULL,
    `totalAvaliacoes` INTEGER NOT NULL DEFAULT 0,
    `indiceResposta` DECIMAL(5, 2) NULL,
    `indiceRecomendacao` DECIMAL(5, 2) NULL,
    `reputacao` ENUM('SEM_AVALIACAO', 'NAO_RECOMENDADA', 'REGULAR', 'BOM', 'OTIMO', 'FA1000') NOT NULL DEFAULT 'SEM_AVALIACAO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `franquias_slug_key`(`slug`),
    UNIQUE INDEX `franquias_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacoes` (
    `id` VARCHAR(191) NOT NULL,
    `franquiaId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `conteudo` TEXT NOT NULL,
    `anonimo` BOOLEAN NOT NULL DEFAULT true,
    `notaSuporte` INTEGER NOT NULL,
    `notaRentabilidade` INTEGER NOT NULL,
    `notaTransparencia` INTEGER NOT NULL,
    `notaTreinamento` INTEGER NOT NULL,
    `notaMarketing` INTEGER NOT NULL,
    `notaSatisfacao` INTEGER NOT NULL,
    `notaGeral` DECIMAL(3, 1) NOT NULL,
    `investiriaNovamente` BOOLEAN NOT NULL,
    `tempoFranquia` VARCHAR(191) NULL,
    `status` ENUM('PENDENTE', 'APROVADA', 'REJEITADA') NOT NULL DEFAULT 'PENDENTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `respostas` (
    `id` VARCHAR(191) NOT NULL,
    `avaliacaoId` VARCHAR(191) NOT NULL,
    `conteudo` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `respostas_avaliacaoId_key`(`avaliacaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leads` (
    `id` VARCHAR(191) NOT NULL,
    `franquiaId` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `mensagem` TEXT NULL,
    `capital` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `origem` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `franquiaId` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'ATENDENTE') NOT NULL DEFAULT 'ATENDENTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `company_users_email_franquiaId_key`(`email`, `franquiaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `franqueados` ADD CONSTRAINT `franqueados_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `franqueados` ADD CONSTRAINT `franqueados_franquiaId_fkey` FOREIGN KEY (`franquiaId`) REFERENCES `franquias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_franquiaId_fkey` FOREIGN KEY (`franquiaId`) REFERENCES `franquias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respostas` ADD CONSTRAINT `respostas_avaliacaoId_fkey` FOREIGN KEY (`avaliacaoId`) REFERENCES `avaliacoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leads` ADD CONSTRAINT `leads_franquiaId_fkey` FOREIGN KEY (`franquiaId`) REFERENCES `franquias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company_users` ADD CONSTRAINT `company_users_franquiaId_fkey` FOREIGN KEY (`franquiaId`) REFERENCES `franquias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;

-- ============================================================
-- CLEAN EXISTING DATA
-- ============================================================
DELETE FROM `respostas`;
DELETE FROM `avaliacoes`;
DELETE FROM `leads`;
DELETE FROM `company_users`;
DELETE FROM `franqueados`;
DELETE FROM `franquias`;
DELETE FROM `sessions`;
DELETE FROM `accounts`;
DELETE FROM `users`;

-- ============================================================
-- USERS (1 admin + 30 franchisees)
-- ============================================================

-- Admin user
INSERT INTO `users` (`id`, `name`, `email`, `passwordHash`, `image`, `role`, `emailVerified`, `createdAt`, `updatedAt`) VALUES
('cm5admin000000000000000', 'Admin', 'admin@franquiaavalia.com.br', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'ADMIN', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000', '2024-01-01 00:00:00.000');

-- Franchisee users
INSERT INTO `users` (`id`, `name`, `email`, `passwordHash`, `image`, `role`, `emailVerified`, `createdAt`, `updatedAt`) VALUES
('cm5user0010000000000000', 'Ana Silva', 'franqueado1@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:00:00.000', '2024-01-02 08:00:00.000', '2024-01-02 08:00:00.000'),
('cm5user0020000000000000', 'Bruno Costa', 'franqueado2@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:05:00.000', '2024-01-02 08:05:00.000', '2024-01-02 08:05:00.000'),
('cm5user0030000000000000', 'Carlos Oliveira', 'franqueado3@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:10:00.000', '2024-01-02 08:10:00.000', '2024-01-02 08:10:00.000'),
('cm5user0040000000000000', 'Daniela Santos', 'franqueado4@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:15:00.000', '2024-01-02 08:15:00.000', '2024-01-02 08:15:00.000'),
('cm5user0050000000000000', 'Eduardo Lima', 'franqueado5@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:20:00.000', '2024-01-02 08:20:00.000', '2024-01-02 08:20:00.000'),
('cm5user0060000000000000', 'Fernanda Souza', 'franqueado6@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:25:00.000', '2024-01-02 08:25:00.000', '2024-01-02 08:25:00.000'),
('cm5user0070000000000000', 'Gabriel Pereira', 'franqueado7@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:30:00.000', '2024-01-02 08:30:00.000', '2024-01-02 08:30:00.000'),
('cm5user0080000000000000', 'Helena Rocha', 'franqueado8@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:35:00.000', '2024-01-02 08:35:00.000', '2024-01-02 08:35:00.000'),
('cm5user0090000000000000', 'Igor Almeida', 'franqueado9@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:40:00.000', '2024-01-02 08:40:00.000', '2024-01-02 08:40:00.000'),
('cm5user0100000000000000', 'Julia Ferreira', 'franqueado10@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:45:00.000', '2024-01-02 08:45:00.000', '2024-01-02 08:45:00.000'),
('cm5user0110000000000000', 'Karina Mendes', 'franqueado11@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:50:00.000', '2024-01-02 08:50:00.000', '2024-01-02 08:50:00.000'),
('cm5user0120000000000000', 'Lucas Ribeiro', 'franqueado12@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 08:55:00.000', '2024-01-02 08:55:00.000', '2024-01-02 08:55:00.000'),
('cm5user0130000000000000', 'Mariana Araújo', 'franqueado13@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:00:00.000', '2024-01-02 09:00:00.000', '2024-01-02 09:00:00.000'),
('cm5user0140000000000000', 'Nicolas Barbosa', 'franqueado14@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:05:00.000', '2024-01-02 09:05:00.000', '2024-01-02 09:05:00.000'),
('cm5user0150000000000000', 'Patrícia Gomes', 'franqueado15@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:10:00.000', '2024-01-02 09:10:00.000', '2024-01-02 09:10:00.000'),
('cm5user0160000000000000', 'Rafael Cardoso', 'franqueado16@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:15:00.000', '2024-01-02 09:15:00.000', '2024-01-02 09:15:00.000'),
('cm5user0170000000000000', 'Sabrina Martins', 'franqueado17@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:20:00.000', '2024-01-02 09:20:00.000', '2024-01-02 09:20:00.000'),
('cm5user0180000000000000', 'Thiago Nunes', 'franqueado18@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:25:00.000', '2024-01-02 09:25:00.000', '2024-01-02 09:25:00.000'),
('cm5user0190000000000000', 'Vanessa Correia', 'franqueado19@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:30:00.000', '2024-01-02 09:30:00.000', '2024-01-02 09:30:00.000'),
('cm5user0200000000000000', 'William Nascimento', 'franqueado20@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:35:00.000', '2024-01-02 09:35:00.000', '2024-01-02 09:35:00.000'),
('cm5user0210000000000000', 'Amanda Campos', 'franqueado21@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:40:00.000', '2024-01-02 09:40:00.000', '2024-01-02 09:40:00.000'),
('cm5user0220000000000000', 'Diego Teixeira', 'franqueado22@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:45:00.000', '2024-01-02 09:45:00.000', '2024-01-02 09:45:00.000'),
('cm5user0230000000000000', 'Elisa Moraes', 'franqueado23@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:50:00.000', '2024-01-02 09:50:00.000', '2024-01-02 09:50:00.000'),
('cm5user0240000000000000', 'Fábio Cavalcanti', 'franqueado24@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 09:55:00.000', '2024-01-02 09:55:00.000', '2024-01-02 09:55:00.000'),
('cm5user0250000000000000', 'Gabriela Dias', 'franqueado25@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 10:00:00.000', '2024-01-02 10:00:00.000', '2024-01-02 10:00:00.000'),
('cm5user0260000000000000', 'Henrique Vieira', 'franqueado26@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 10:05:00.000', '2024-01-02 10:05:00.000', '2024-01-02 10:05:00.000'),
('cm5user0270000000000000', 'Isabela Castro', 'franqueado27@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 10:10:00.000', '2024-01-02 10:10:00.000', '2024-01-02 10:10:00.000'),
('cm5user0280000000000000', 'João Pinto', 'franqueado28@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 10:15:00.000', '2024-01-02 10:15:00.000', '2024-01-02 10:15:00.000'),
('cm5user0290000000000000', 'Larissa Monteiro', 'franqueado29@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 10:20:00.000', '2024-01-02 10:20:00.000', '2024-01-02 10:20:00.000'),
('cm5user0300000000000000', 'Mateus Ramos', 'franqueado30@email.com', '$2a$12$LJ3a4gMPSFTU6P3X6R5GRuBnDNqDAqHqXfOC8QJz4gBdHJquqL33e', NULL, 'FRANCHISEE', '2024-01-02 10:25:00.000', '2024-01-02 10:25:00.000', '2024-01-02 10:25:00.000');

-- ============================================================
-- FRANQUEADOS (30 records linked to franchisee users)
-- ============================================================

INSERT INTO `franqueados` (`id`, `userId`, `cnpj`, `verified`, `franquiaId`, `createdAt`) VALUES
('cm5franq010000000000000', 'cm5user0010000000000000', '10.234.567/0001-12', 1, NULL, '2024-01-02 08:00:00.000'),
('cm5franq020000000000000', 'cm5user0020000000000000', '11.345.678/0001-23', 1, NULL, '2024-01-02 08:05:00.000'),
('cm5franq030000000000000', 'cm5user0030000000000000', '12.456.789/0001-34', 1, NULL, '2024-01-02 08:10:00.000'),
('cm5franq040000000000000', 'cm5user0040000000000000', '13.567.890/0001-45', 0, NULL, '2024-01-02 08:15:00.000'),
('cm5franq050000000000000', 'cm5user0050000000000000', '14.678.901/0001-56', 1, NULL, '2024-01-02 08:20:00.000'),
('cm5franq060000000000000', 'cm5user0060000000000000', '15.789.012/0001-67', 1, NULL, '2024-01-02 08:25:00.000'),
('cm5franq070000000000000', 'cm5user0070000000000000', '16.890.123/0001-78', 1, NULL, '2024-01-02 08:30:00.000'),
('cm5franq080000000000000', 'cm5user0080000000000000', '17.901.234/0001-89', 0, NULL, '2024-01-02 08:35:00.000'),
('cm5franq090000000000000', 'cm5user0090000000000000', '18.012.345/0001-90', 1, NULL, '2024-01-02 08:40:00.000'),
('cm5franq100000000000000', 'cm5user0100000000000000', '19.123.456/0001-01', 1, NULL, '2024-01-02 08:45:00.000'),
('cm5franq110000000000000', 'cm5user0110000000000000', '20.234.567/0001-12', 1, NULL, '2024-01-02 08:50:00.000'),
('cm5franq120000000000000', 'cm5user0120000000000000', '21.345.678/0001-23', 0, NULL, '2024-01-02 08:55:00.000'),
('cm5franq130000000000000', 'cm5user0130000000000000', '22.456.789/0001-34', 1, NULL, '2024-01-02 09:00:00.000'),
('cm5franq140000000000000', 'cm5user0140000000000000', '23.567.890/0001-45', 1, NULL, '2024-01-02 09:05:00.000'),
('cm5franq150000000000000', 'cm5user0150000000000000', '24.678.901/0001-56', 1, NULL, '2024-01-02 09:10:00.000'),
('cm5franq160000000000000', 'cm5user0160000000000000', '25.789.012/0001-67', 1, NULL, '2024-01-02 09:15:00.000'),
('cm5franq170000000000000', 'cm5user0170000000000000', '26.890.123/0001-78', 0, NULL, '2024-01-02 09:20:00.000'),
('cm5franq180000000000000', 'cm5user0180000000000000', '27.901.234/0001-89', 1, NULL, '2024-01-02 09:25:00.000'),
('cm5franq190000000000000', 'cm5user0190000000000000', '28.012.345/0001-90', 1, NULL, '2024-01-02 09:30:00.000'),
('cm5franq200000000000000', 'cm5user0200000000000000', '29.123.456/0001-01', 1, NULL, '2024-01-02 09:35:00.000'),
('cm5franq210000000000000', 'cm5user0210000000000000', '30.234.567/0001-12', 0, NULL, '2024-01-02 09:40:00.000'),
('cm5franq220000000000000', 'cm5user0220000000000000', '31.345.678/0001-23', 1, NULL, '2024-01-02 09:45:00.000'),
('cm5franq230000000000000', 'cm5user0230000000000000', '32.456.789/0001-34', 1, NULL, '2024-01-02 09:50:00.000'),
('cm5franq240000000000000', 'cm5user0240000000000000', '33.567.890/0001-45', 1, NULL, '2024-01-02 09:55:00.000'),
('cm5franq250000000000000', 'cm5user0250000000000000', '34.678.901/0001-56', 1, NULL, '2024-01-02 10:00:00.000'),
('cm5franq260000000000000', 'cm5user0260000000000000', '35.789.012/0001-67', 0, NULL, '2024-01-02 10:05:00.000'),
('cm5franq270000000000000', 'cm5user0270000000000000', '36.890.123/0001-78', 1, NULL, '2024-01-02 10:10:00.000'),
('cm5franq280000000000000', 'cm5user0280000000000000', '37.901.234/0001-89', 1, NULL, '2024-01-02 10:15:00.000'),
('cm5franq290000000000000', 'cm5user0290000000000000', '38.012.345/0001-90', 1, NULL, '2024-01-02 10:20:00.000'),
('cm5franq300000000000000', 'cm5user0300000000000000', '39.123.456/0001-01', 0, NULL, '2024-01-02 10:25:00.000');

-- ============================================================
-- FRANQUIAS (20 franchises)
-- Scores will be updated after reviews are inserted
-- ============================================================

INSERT INTO `franquias` (`id`, `slug`, `nome`, `cnpj`, `descricao`, `logo`, `capa`, `website`, `telefone`, `email`, `segmento`, `investimentoMin`, `investimentoMax`, `taxaFranquia`, `royalties`, `unidades`, `fundacao`, `sede`, `faturamentoMedio`, `prazoRetorno`, `plano`, `videoUrl`, `faq`, `ctaTexto`, `ctaUrl`, `seloVerificada`, `seloFA1000`, `notaGeral`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `totalAvaliacoes`, `indiceResposta`, `indiceRecomendacao`, `reputacao`, `createdAt`, `updatedAt`) VALUES
('cm5fran0010000000000000', 'burger-town', 'Burger Town', '40.123.456/0001-11', 'Rede de hamburguerias artesanais com mais de 200 unidades pelo Brasil. Reconhecida pelo sabor autêntico e atendimento rápido.', NULL, NULL, 'https://www.burger-town.com.br', '(11) 91234-5678', 'contato@burger-town.com.br', 'ALIMENTACAO', 120000.00, 250000.00, 45000.00, '5% do faturamento', 230, 2012, 'São Paulo, SP', 85000.00, '18 a 24 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:00:00.000', '2024-01-03 10:00:00.000'),
('cm5fran0020000000000000', 'acai-premium', 'Açaí Premium', '41.234.567/0001-22', 'Maior rede de açaí do Brasil, com bowls personalizáveis e ingredientes selecionados. Presente em 15 estados.', NULL, NULL, 'https://www.acai-premium.com.br', '(21) 92345-6789', 'contato@acai-premium.com.br', 'ALIMENTACAO', 80000.00, 150000.00, 30000.00, '6% do faturamento', 185, 2015, 'Rio de Janeiro, RJ', 65000.00, '12 a 18 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:05:00.000', '2024-01-03 10:05:00.000'),
('cm5fran0030000000000000', 'pizza-express', 'Pizza Express', '42.345.678/0001-33', 'Pizzaria delivery com massa artesanal e ingredientes premium. Modelo de negócio enxuto com foco em delivery.', NULL, NULL, 'https://www.pizza-express.com.br', '(41) 93456-7890', 'contato@pizza-express.com.br', 'ALIMENTACAO', 200000.00, 400000.00, 60000.00, '4% do faturamento', 120, 2010, 'Curitiba, PR', 120000.00, '24 a 30 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:10:00.000', '2024-01-03 10:10:00.000'),
('cm5fran0040000000000000', 'cafe-pao', 'Café & Pão', '43.456.789/0001-44', 'Padaria e cafeteria gourmet com ambiente acolhedor. Pães artesanais e cafés especiais de origem controlada.', NULL, NULL, 'https://www.cafe-pao.com.br', '(31) 94567-8901', 'contato@cafe-pao.com.br', 'ALIMENTACAO', 150000.00, 280000.00, 40000.00, '5% do faturamento', 95, 2014, 'Belo Horizonte, MG', 90000.00, '18 a 24 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:15:00.000', '2024-01-03 10:15:00.000'),
('cm5fran0050000000000000', 'sushi-mais', 'Sushi Mais', '44.567.890/0001-55', 'Rede de comida japonesa com conceito fast-casual. Ingredientes frescos e preparo na hora do pedido.', NULL, NULL, 'https://www.sushi-mais.com.br', '(11) 95678-9012', 'contato@sushi-mais.com.br', 'ALIMENTACAO', 180000.00, 350000.00, 50000.00, '5.5% do faturamento', 78, 2016, 'São Paulo, SP', 110000.00, '20 a 28 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:20:00.000', '2024-01-03 10:20:00.000'),
('cm5fran0060000000000000', 'beleza-natural', 'Beleza Natural', '45.678.901/0001-66', 'Salão de beleza com foco em tratamentos capilares naturais. Referência em inclusão e diversidade no setor.', NULL, NULL, 'https://www.beleza-natural.com.br', '(11) 96789-0123', 'contato@beleza-natural.com.br', 'SAUDE_BELEZA', 100000.00, 200000.00, 35000.00, '7% do faturamento', 210, 2008, 'São Paulo, SP', 75000.00, '14 a 20 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:25:00.000', '2024-01-03 10:25:00.000'),
('cm5fran0070000000000000', 'farma-saude', 'Farma Saúde', '46.789.012/0001-77', 'Rede de farmácias com foco em atendimento personalizado e produtos de saúde premium. Maior rede do Centro-Oeste.', NULL, NULL, 'https://www.farma-saude.com.br', '(62) 97890-1234', 'contato@farma-saude.com.br', 'SAUDE_BELEZA', 250000.00, 500000.00, 80000.00, '3% do faturamento', 340, 2005, 'Goiânia, GO', 180000.00, '24 a 36 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:30:00.000', '2024-01-03 10:30:00.000'),
('cm5fran0080000000000000', 'estetica-plus', 'Estética Plus', '47.890.123/0001-88', 'Clínica de estética acessível com procedimentos não invasivos. Treinamento completo para franqueados.', NULL, NULL, 'https://www.estetica-plus.com.br', '(48) 98901-2345', 'contato@estetica-plus.com.br', 'SAUDE_BELEZA', 90000.00, 180000.00, 25000.00, '8% do faturamento', 145, 2017, 'Florianópolis, SC', 60000.00, '12 a 18 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:35:00.000', '2024-01-03 10:35:00.000'),
('cm5fran0090000000000000', 'genio-cursos', 'Gênio Cursos', '48.901.234/0001-99', 'Escola de cursos profissionalizantes com mais de 50 opções de formação. Presente em todos os estados brasileiros.', NULL, NULL, 'https://www.genio-cursos.com.br', '(11) 99012-3456', 'contato@genio-cursos.com.br', 'EDUCACAO', 60000.00, 120000.00, 20000.00, '10% do faturamento', 420, 2003, 'São Paulo, SP', 50000.00, '12 a 18 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:40:00.000', '2024-01-03 10:40:00.000'),
('cm5fran0100000000000000', 'english-now', 'English Now', '49.012.345/0001-10', 'Escola de idiomas com metodologia própria focada em conversação. Turmas reduzidas e professores nativos.', NULL, NULL, 'https://www.english-now.com.br', '(21) 90123-4567', 'contato@english-now.com.br', 'EDUCACAO', 100000.00, 200000.00, 40000.00, '12% do faturamento', 280, 2006, 'Rio de Janeiro, RJ', 70000.00, '18 a 24 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:45:00.000', '2024-01-03 10:45:00.000'),
('cm5fran0110000000000000', 'code-school', 'Code School', '50.123.456/0001-21', 'Escola de programação e tecnologia para jovens e adultos. Cursos práticos alinhados com o mercado de trabalho.', NULL, NULL, 'https://www.code-school.com.br', '(51) 91234-5670', 'contato@code-school.com.br', 'EDUCACAO', 80000.00, 160000.00, 30000.00, '8% do faturamento', 65, 2019, 'Porto Alegre, RS', 55000.00, '14 a 20 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:50:00.000', '2024-01-03 10:50:00.000'),
('cm5fran0120000000000000', 'lava-facil', 'Lava Fácil', '51.234.567/0001-32', 'Lavanderia self-service com tecnologia de ponta. Modelo econômico com baixo custo operacional.', NULL, NULL, 'https://www.lava-facil.com.br', '(19) 92345-6780', 'contato@lava-facil.com.br', 'SERVICOS', 70000.00, 140000.00, 25000.00, '6% do faturamento', 190, 2013, 'Campinas, SP', 45000.00, '10 a 16 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 10:55:00.000', '2024-01-03 10:55:00.000'),
('cm5fran0130000000000000', 'pet-care-brasil', 'Pet Care Brasil', '52.345.678/0001-43', 'Rede de pet shops com serviços completos: banho, tosa, veterinário e produtos premium para pets.', NULL, NULL, 'https://www.pet-care-brasil.com.br', '(11) 93456-7891', 'contato@pet-care-brasil.com.br', 'SERVICOS', 110000.00, 220000.00, 35000.00, '5% do faturamento', 155, 2015, 'São Paulo, SP', 80000.00, '16 a 22 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 11:00:00.000', '2024-01-03 11:00:00.000'),
('cm5fran0140000000000000', 'fix-it', 'Fix It', '53.456.789/0001-54', 'Assistência técnica para smartphones e eletrônicos. Modelo compacto ideal para shopping centers.', NULL, NULL, 'https://www.fix-it.com.br', '(61) 94567-8902', 'contato@fix-it.com.br', 'SERVICOS', 50000.00, 100000.00, 15000.00, '7% do faturamento', 88, 2018, 'Brasília, DF', 40000.00, '8 a 14 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 11:05:00.000', '2024-01-03 11:05:00.000'),
('cm5fran0150000000000000', 'urban-style', 'Urban Style', '54.567.890/0001-65', 'Moda urbana com coleções exclusivas e preços acessíveis. Forte presença nas redes sociais e e-commerce integrado.', NULL, NULL, 'https://www.urban-style.com.br', '(11) 95678-9013', 'contato@urban-style.com.br', 'MODA', 200000.00, 400000.00, 60000.00, '4% do faturamento', 130, 2011, 'São Paulo, SP', 150000.00, '24 a 36 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 11:10:00.000', '2024-01-03 11:10:00.000'),
('cm5fran0160000000000000', 'mini-fashion-kids', 'Mini Fashion Kids', '55.678.901/0001-76', 'Moda infantil com design moderno e confortável. Tecidos sustentáveis e coleções sazonais exclusivas.', NULL, NULL, 'https://www.mini-fashion-kids.com.br', '(41) 96789-0124', 'contato@mini-fashion-kids.com.br', 'MODA', 150000.00, 300000.00, 45000.00, '5% do faturamento', 95, 2014, 'Curitiba, PR', 100000.00, '20 a 28 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 11:15:00.000', '2024-01-03 11:15:00.000'),
('cm5fran0170000000000000', 'tech-solutions', 'Tech Solutions', '56.789.012/0001-87', 'Consultoria em transformação digital para pequenas empresas. Soluções de software, cloud e automação.', NULL, NULL, 'https://www.tech-solutions.com.br', '(48) 97890-1235', 'contato@tech-solutions.com.br', 'TECNOLOGIA', 130000.00, 260000.00, 40000.00, '6% do faturamento', 72, 2017, 'Florianópolis, SC', 95000.00, '16 a 24 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 11:20:00.000', '2024-01-03 11:20:00.000'),
('cm5fran0180000000000000', 'smart-print', 'Smart Print', '57.890.123/0001-98', 'Gráfica digital e comunicação visual. Impressão 3D, personalização de brindes e sinalização.', NULL, NULL, 'https://www.smart-print.com.br', '(11) 98901-2346', 'contato@smart-print.com.br', 'TECNOLOGIA', 90000.00, 170000.00, 30000.00, '5% do faturamento', 110, 2016, 'São Paulo, SP', 60000.00, '12 a 18 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 11:25:00.000', '2024-01-03 11:25:00.000'),
('cm5fran0190000000000000', 'gym-express', 'Gym Express', '58.901.234/0001-09', 'Academia compacta 24h com modelo low-cost. Equipamentos de última geração e app exclusivo para alunos.', NULL, NULL, 'https://www.gym-express.com.br', '(21) 99012-3457', 'contato@gym-express.com.br', 'ENTRETENIMENTO', 300000.00, 600000.00, 80000.00, '3% do faturamento', 85, 2015, 'Rio de Janeiro, RJ', 200000.00, '30 a 40 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 11:30:00.000', '2024-01-03 11:30:00.000'),
('cm5fran0200000000000000', 'clean-house', 'Clean House', '59.012.345/0001-20', 'Serviço de limpeza residencial e comercial sob demanda. Plataforma digital para agendamento e gestão.', NULL, NULL, 'https://www.clean-house.com.br', '(31) 90123-4568', 'contato@clean-house.com.br', 'LIMPEZA', 40000.00, 80000.00, 12000.00, '8% do faturamento', 220, 2016, 'Belo Horizonte, MG', 35000.00, '6 a 12 meses', 'FREE', NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 'SEM_AVALIACAO', '2024-01-03 11:35:00.000', '2024-01-03 11:35:00.000');

-- ============================================================
-- AVALIACOES (Reviews)
-- Each franchise gets 3-10 reviews
-- ~75% positive (scores 6-10), ~25% negative (scores 2-5)
-- ============================================================

-- ----- Franchise 01: Burger Town (8 reviews: 6 positive, 2 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0010100000000000', 'cm5fran0010000000000000', 'cm5user0010000000000000', 'Excelente suporte da rede', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 9, 8, 8, 9, 7, 9, 8.3, 1, '1-3-anos', 'APROVADA', '2024-02-10 14:30:00.000', '2024-02-10 14:30:00.000'),
('cm5aval0010200000000000', 'cm5fran0010000000000000', 'cm5user0020000000000000', 'Muito satisfeito com o retorno', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 0, 8, 9, 7, 8, 8, 10, 8.3, 1, '3-5-anos', 'APROVADA', '2024-02-15 09:00:00.000', '2024-02-15 09:00:00.000'),
('cm5aval0010300000000000', 'cm5fran0010000000000000', 'cm5user0030000000000000', 'Suporte deixa a desejar', 'Infelizmente, a experiência não foi como esperava. O suporte demora muito para responder e quando responde, nem sempre resolve. O retorno financeiro está bem abaixo do que foi prometido na apresentação. Espero que melhorem nesses pontos.', 1, 3, 2, 4, 5, 3, 3, 3.3, 0, 'menos-1-ano', 'APROVADA', '2024-03-01 11:20:00.000', '2024-03-01 11:20:00.000'),
('cm5aval0010400000000000', 'cm5fran0010000000000000', 'cm5user0040000000000000', 'Ótima franquia para investir', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 7, 7, 8, 9, 6, 8, 7.5, 1, '1-3-anos', 'APROVADA', '2024-03-10 16:45:00.000', '2024-03-10 16:45:00.000'),
('cm5aval0010500000000000', 'cm5fran0010000000000000', 'cm5user0050000000000000', 'Franquia bem estruturada', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 0, 8, 6, 9, 7, 7, 8, 7.5, 1, '3-5-anos', 'APROVADA', '2024-04-05 10:15:00.000', '2024-04-05 10:15:00.000'),
('cm5aval0010600000000000', 'cm5fran0010000000000000', 'cm5user0060000000000000', 'Retorno abaixo do prometido', 'Preciso ser honesto: a comunicação da franqueadora precisa melhorar bastante. Muitas decisões são tomadas sem consultar os franqueados e o marketing poderia ser mais efetivo. O produto é bom, mas a gestão da rede precisa evoluir.', 1, 4, 3, 3, 4, 2, 4, 3.3, 0, '1-3-anos', 'APROVADA', '2024-04-20 08:30:00.000', '2024-04-20 08:30:00.000'),
('cm5aval0010700000000000', 'cm5fran0010000000000000', 'cm5user0070000000000000', 'Treinamento completo e eficaz', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 10, 8, 9, 10, 8, 9, 9.0, 1, '5-mais-anos', 'APROVADA', '2024-05-12 13:00:00.000', '2024-05-12 13:00:00.000'),
('cm5aval0010800000000000', 'cm5fran0010000000000000', 'cm5user0080000000000000', 'Marca forte e reconhecida', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 0, 7, 7, 8, 8, 6, 8, 7.3, 1, '1-3-anos', 'APROVADA', '2024-05-28 15:30:00.000', '2024-05-28 15:30:00.000');

-- ----- Franchise 02: Açaí Premium (6 reviews: 5 positive, 1 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0020100000000000', 'cm5fran0020000000000000', 'cm5user0030000000000000', 'Retorno dentro do esperado', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 8, 7, 9, 8, 7, 9, 8.0, 1, '1-3-anos', 'APROVADA', '2024-02-12 10:00:00.000', '2024-02-12 10:00:00.000'),
('cm5aval0020200000000000', 'cm5fran0020000000000000', 'cm5user0050000000000000', 'Suporte acima da média', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 0, 9, 8, 8, 9, 8, 10, 8.7, 1, '3-5-anos', 'APROVADA', '2024-03-05 14:20:00.000', '2024-03-05 14:20:00.000'),
('cm5aval0020300000000000', 'cm5fran0020000000000000', 'cm5user0070000000000000', 'Excelente suporte da rede', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 7, 6, 7, 8, 6, 8, 7.0, 1, '1-3-anos', 'APROVADA', '2024-03-22 11:30:00.000', '2024-03-22 11:30:00.000'),
('cm5aval0020400000000000', 'cm5fran0020000000000000', 'cm5user0090000000000000', 'Falta de transparência', 'Preciso ser honesto: a comunicação da franqueadora precisa melhorar bastante. Muitas decisões são tomadas sem consultar os franqueados e o marketing poderia ser mais efetivo. O produto é bom, mas a gestão da rede precisa evoluir.', 1, 4, 3, 2, 5, 3, 3, 3.3, 0, 'menos-1-ano', 'APROVADA', '2024-04-10 09:45:00.000', '2024-04-10 09:45:00.000'),
('cm5aval0020500000000000', 'cm5fran0020000000000000', 'cm5user0110000000000000', 'Ótima franquia para investir', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 0, 8, 9, 8, 7, 7, 9, 8.0, 1, '3-5-anos', 'APROVADA', '2024-05-01 16:00:00.000', '2024-05-01 16:00:00.000'),
('cm5aval0020600000000000', 'cm5fran0020000000000000', 'cm5user0130000000000000', 'Franquia bem estruturada', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 9, 8, 9, 10, 8, 10, 9.0, 1, '5-mais-anos', 'APROVADA', '2024-05-20 12:15:00.000', '2024-05-20 12:15:00.000');

-- ----- Franchise 03: Pizza Express (5 reviews: 4 positive, 1 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0030100000000000', 'cm5fran0030000000000000', 'cm5user0020000000000000', 'Muito satisfeito com o retorno', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 1, 8, 9, 7, 7, 8, 9, 8.0, 1, '3-5-anos', 'APROVADA', '2024-02-20 10:30:00.000', '2024-02-20 10:30:00.000'),
('cm5aval0030200000000000', 'cm5fran0030000000000000', 'cm5user0040000000000000', 'Treinamento completo e eficaz', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 0, 7, 6, 8, 9, 7, 8, 7.5, 1, '1-3-anos', 'APROVADA', '2024-03-15 13:45:00.000', '2024-03-15 13:45:00.000'),
('cm5aval0030300000000000', 'cm5fran0030000000000000', 'cm5user0060000000000000', 'Marketing insuficiente', 'O investimento inicial foi maior do que o planejado por causa de custos extras que não foram mencionados no início. O suporte técnico é lento e o treinamento poderia ser mais aprofundado. Tem potencial mas precisa de ajustes importantes.', 1, 3, 4, 3, 4, 2, 3, 3.2, 0, 'menos-1-ano', 'APROVADA', '2024-04-02 08:20:00.000', '2024-04-02 08:20:00.000'),
('cm5aval0030400000000000', 'cm5fran0030000000000000', 'cm5user0080000000000000', 'Suporte acima da média', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 1, 9, 7, 9, 8, 6, 8, 7.8, 1, '1-3-anos', 'APROVADA', '2024-04-28 11:00:00.000', '2024-04-28 11:00:00.000'),
('cm5aval0030500000000000', 'cm5fran0030000000000000', 'cm5user0100000000000000', 'Marca forte e reconhecida', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 0, 8, 8, 8, 9, 7, 9, 8.2, 1, '5-mais-anos', 'APROVADA', '2024-05-15 14:30:00.000', '2024-05-15 14:30:00.000');

-- ----- Franchise 04: Café & Pão (7 reviews: 5 positive, 2 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0040100000000000', 'cm5fran0040000000000000', 'cm5user0010000000000000', 'Ótima franquia para investir', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 8, 7, 8, 9, 7, 8, 7.8, 1, '1-3-anos', 'APROVADA', '2024-02-08 09:30:00.000', '2024-02-08 09:30:00.000'),
('cm5aval0040200000000000', 'cm5fran0040000000000000', 'cm5user0050000000000000', 'Suporte deixa a desejar', 'Infelizmente, a experiência não foi como esperava. O suporte demora muito para responder e quando responde, nem sempre resolve. O retorno financeiro está bem abaixo do que foi prometido na apresentação. Espero que melhorem nesses pontos.', 0, 3, 2, 3, 4, 3, 2, 2.8, 0, 'menos-1-ano', 'APROVADA', '2024-02-25 14:00:00.000', '2024-02-25 14:00:00.000'),
('cm5aval0040300000000000', 'cm5fran0040000000000000', 'cm5user0090000000000000', 'Excelente suporte da rede', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 9, 8, 9, 10, 8, 9, 8.8, 1, '3-5-anos', 'APROVADA', '2024-03-12 10:45:00.000', '2024-03-12 10:45:00.000'),
('cm5aval0040400000000000', 'cm5fran0040000000000000', 'cm5user0110000000000000', 'Retorno dentro do esperado', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 1, 7, 8, 7, 7, 6, 8, 7.2, 1, '1-3-anos', 'APROVADA', '2024-04-01 11:15:00.000', '2024-04-01 11:15:00.000'),
('cm5aval0040500000000000', 'cm5fran0040000000000000', 'cm5user0130000000000000', 'Precisam melhorar muito', 'O investimento inicial foi maior do que o planejado por causa de custos extras que não foram mencionados no início. O suporte técnico é lento e o treinamento poderia ser mais aprofundado. Tem potencial mas precisa de ajustes importantes.', 0, 5, 3, 4, 3, 4, 4, 3.8, 0, '1-3-anos', 'APROVADA', '2024-04-18 16:30:00.000', '2024-04-18 16:30:00.000'),
('cm5aval0040600000000000', 'cm5fran0040000000000000', 'cm5user0150000000000000', 'Franquia bem estruturada', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 1, 8, 7, 9, 8, 7, 9, 8.0, 1, '5-mais-anos', 'APROVADA', '2024-05-10 08:00:00.000', '2024-05-10 08:00:00.000'),
('cm5aval0040700000000000', 'cm5fran0040000000000000', 'cm5user0170000000000000', 'Marca forte e reconhecida', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 10, 9, 8, 9, 8, 10, 9.0, 1, '3-5-anos', 'APROVADA', '2024-06-01 13:20:00.000', '2024-06-01 13:20:00.000');

-- ----- Franchise 05: Sushi Mais (4 reviews: 3 positive, 1 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0050100000000000', 'cm5fran0050000000000000', 'cm5user0020000000000000', 'Excelente suporte da rede', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 1, 7, 8, 7, 8, 6, 8, 7.3, 1, '1-3-anos', 'APROVADA', '2024-02-18 11:00:00.000', '2024-02-18 11:00:00.000'),
('cm5aval0050200000000000', 'cm5fran0050000000000000', 'cm5user0060000000000000', 'Muito satisfeito com o retorno', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 0, 9, 7, 9, 9, 8, 10, 8.7, 1, '3-5-anos', 'APROVADA', '2024-03-08 15:30:00.000', '2024-03-08 15:30:00.000'),
('cm5aval0050300000000000', 'cm5fran0050000000000000', 'cm5user0100000000000000', 'Retorno abaixo do prometido', 'Infelizmente, a experiência não foi como esperava. O suporte demora muito para responder e quando responde, nem sempre resolve. O retorno financeiro está bem abaixo do que foi prometido na apresentação. Espero que melhorem nesses pontos.', 1, 4, 3, 5, 4, 2, 3, 3.5, 0, 'menos-1-ano', 'APROVADA', '2024-04-15 09:20:00.000', '2024-04-15 09:20:00.000'),
('cm5aval0050400000000000', 'cm5fran0050000000000000', 'cm5user0140000000000000', 'Treinamento completo e eficaz', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 8, 9, 8, 10, 7, 9, 8.5, 1, '1-3-anos', 'APROVADA', '2024-05-05 12:00:00.000', '2024-05-05 12:00:00.000');

-- ----- Franchise 06: Beleza Natural (9 reviews: 7 positive, 2 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0060100000000000', 'cm5fran0060000000000000', 'cm5user0010000000000000', 'Ótima franquia para investir', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 0, 8, 7, 8, 9, 7, 9, 8.0, 1, '3-5-anos', 'APROVADA', '2024-02-05 10:00:00.000', '2024-02-05 10:00:00.000'),
('cm5aval0060200000000000', 'cm5fran0060000000000000', 'cm5user0030000000000000', 'Franquia bem estruturada', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 9, 8, 9, 10, 8, 10, 9.0, 1, '5-mais-anos', 'APROVADA', '2024-02-18 14:30:00.000', '2024-02-18 14:30:00.000'),
('cm5aval0060300000000000', 'cm5fran0060000000000000', 'cm5user0050000000000000', 'Suporte deixa a desejar', 'Preciso ser honesto: a comunicação da franqueadora precisa melhorar bastante. Muitas decisões são tomadas sem consultar os franqueados e o marketing poderia ser mais efetivo. O produto é bom, mas a gestão da rede precisa evoluir.', 1, 5, 3, 4, 5, 3, 4, 4.0, 0, '1-3-anos', 'APROVADA', '2024-03-02 09:15:00.000', '2024-03-02 09:15:00.000'),
('cm5aval0060400000000000', 'cm5fran0060000000000000', 'cm5user0070000000000000', 'Retorno dentro do esperado', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 0, 7, 8, 7, 8, 6, 8, 7.3, 1, '1-3-anos', 'APROVADA', '2024-03-20 11:45:00.000', '2024-03-20 11:45:00.000'),
('cm5aval0060500000000000', 'cm5fran0060000000000000', 'cm5user0090000000000000', 'Treinamento completo e eficaz', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 10, 9, 10, 10, 9, 10, 9.7, 1, '5-mais-anos', 'APROVADA', '2024-04-08 14:00:00.000', '2024-04-08 14:00:00.000'),
('cm5aval0060600000000000', 'cm5fran0060000000000000', 'cm5user0110000000000000', 'Marca forte e reconhecida', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 1, 8, 7, 8, 8, 7, 9, 7.8, 1, '3-5-anos', 'APROVADA', '2024-04-25 10:30:00.000', '2024-04-25 10:30:00.000'),
('cm5aval0060700000000000', 'cm5fran0060000000000000', 'cm5user0130000000000000', 'Falta de transparência', 'O investimento inicial foi maior do que o planejado por causa de custos extras que não foram mencionados no início. O suporte técnico é lento e o treinamento poderia ser mais aprofundado. Tem potencial mas precisa de ajustes importantes.', 0, 4, 3, 2, 3, 4, 3, 3.2, 0, 'menos-1-ano', 'APROVADA', '2024-05-10 16:20:00.000', '2024-05-10 16:20:00.000'),
('cm5aval0060800000000000', 'cm5fran0060000000000000', 'cm5user0150000000000000', 'Suporte acima da média', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 7, 6, 8, 7, 6, 7, 6.8, 1, '1-3-anos', 'APROVADA', '2024-05-28 09:00:00.000', '2024-05-28 09:00:00.000'),
('cm5aval0060900000000000', 'cm5fran0060000000000000', 'cm5user0170000000000000', 'Excelente suporte da rede', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 1, 8, 8, 9, 9, 7, 9, 8.3, 1, '3-5-anos', 'APROVADA', '2024-06-10 13:30:00.000', '2024-06-10 13:30:00.000');

-- ----- Franchise 07: Farma Saúde (10 reviews: 8 positive, 2 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0070100000000000', 'cm5fran0070000000000000', 'cm5user0020000000000000', 'Excelente suporte da rede', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 9, 8, 9, 9, 8, 10, 8.8, 1, '5-mais-anos', 'APROVADA', '2024-02-03 09:00:00.000', '2024-02-03 09:00:00.000'),
('cm5aval0070200000000000', 'cm5fran0070000000000000', 'cm5user0040000000000000', 'Muito satisfeito com o retorno', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 0, 8, 9, 8, 8, 7, 9, 8.2, 1, '3-5-anos', 'APROVADA', '2024-02-15 11:30:00.000', '2024-02-15 11:30:00.000'),
('cm5aval0070300000000000', 'cm5fran0070000000000000', 'cm5user0060000000000000', 'Suporte deixa a desejar', 'Infelizmente, a experiência não foi como esperava. O suporte demora muito para responder e quando responde, nem sempre resolve. O retorno financeiro está bem abaixo do que foi prometido na apresentação. Espero que melhorem nesses pontos.', 1, 3, 4, 3, 4, 2, 3, 3.2, 0, 'menos-1-ano', 'APROVADA', '2024-03-01 14:45:00.000', '2024-03-01 14:45:00.000'),
('cm5aval0070400000000000', 'cm5fran0070000000000000', 'cm5user0080000000000000', 'Ótima franquia para investir', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 7, 7, 8, 8, 7, 8, 7.5, 1, '1-3-anos', 'APROVADA', '2024-03-18 10:00:00.000', '2024-03-18 10:00:00.000'),
('cm5aval0070500000000000', 'cm5fran0070000000000000', 'cm5user0100000000000000', 'Franquia bem estruturada', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 0, 8, 8, 9, 9, 8, 9, 8.5, 1, '3-5-anos', 'APROVADA', '2024-04-05 13:15:00.000', '2024-04-05 13:15:00.000'),
('cm5aval0070600000000000', 'cm5fran0070000000000000', 'cm5user0120000000000000', 'Retorno dentro do esperado', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 10, 9, 10, 10, 9, 10, 9.7, 1, '5-mais-anos', 'APROVADA', '2024-04-22 08:30:00.000', '2024-04-22 08:30:00.000'),
('cm5aval0070700000000000', 'cm5fran0070000000000000', 'cm5user0140000000000000', 'Treinamento completo e eficaz', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 7, 6, 7, 8, 6, 8, 7.0, 1, '1-3-anos', 'APROVADA', '2024-05-08 15:00:00.000', '2024-05-08 15:00:00.000'),
('cm5aval0070800000000000', 'cm5fran0070000000000000', 'cm5user0160000000000000', 'Retorno abaixo do prometido', 'Preciso ser honesto: a comunicação da franqueadora precisa melhorar bastante. Muitas decisões são tomadas sem consultar os franqueados e o marketing poderia ser mais efetivo. O produto é bom, mas a gestão da rede precisa evoluir.', 0, 5, 3, 4, 5, 3, 4, 4.0, 0, '1-3-anos', 'APROVADA', '2024-05-25 11:45:00.000', '2024-05-25 11:45:00.000'),
('cm5aval0070900000000000', 'cm5fran0070000000000000', 'cm5user0180000000000000', 'Suporte acima da média', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 1, 9, 8, 8, 9, 7, 9, 8.3, 1, '3-5-anos', 'APROVADA', '2024-06-05 10:20:00.000', '2024-06-05 10:20:00.000'),
('cm5aval0071000000000000', 'cm5fran0070000000000000', 'cm5user0200000000000000', 'Marca forte e reconhecida', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 8, 7, 8, 8, 7, 8, 7.7, 1, '1-3-anos', 'APROVADA', '2024-06-18 14:00:00.000', '2024-06-18 14:00:00.000');

-- ----- Franchise 08: Estética Plus (5 reviews: 3 positive, 2 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0080100000000000', 'cm5fran0080000000000000', 'cm5user0040000000000000', 'Muito satisfeito com o retorno', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 8, 7, 7, 8, 6, 8, 7.3, 1, '1-3-anos', 'APROVADA', '2024-02-22 10:30:00.000', '2024-02-22 10:30:00.000'),
('cm5aval0080200000000000', 'cm5fran0080000000000000', 'cm5user0060000000000000', 'Falta de transparência', 'Infelizmente, a experiência não foi como esperava. O suporte demora muito para responder e quando responde, nem sempre resolve. O retorno financeiro está bem abaixo do que foi prometido na apresentação. Espero que melhorem nesses pontos.', 0, 3, 2, 3, 4, 3, 2, 2.8, 0, 'menos-1-ano', 'APROVADA', '2024-03-10 14:00:00.000', '2024-03-10 14:00:00.000'),
('cm5aval0080300000000000', 'cm5fran0080000000000000', 'cm5user0120000000000000', 'Ótima franquia para investir', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 1, 9, 8, 8, 9, 7, 9, 8.3, 1, '3-5-anos', 'APROVADA', '2024-04-02 11:15:00.000', '2024-04-02 11:15:00.000'),
('cm5aval0080400000000000', 'cm5fran0080000000000000', 'cm5user0160000000000000', 'Precisam melhorar muito', 'O investimento inicial foi maior do que o planejado por causa de custos extras que não foram mencionados no início. O suporte técnico é lento e o treinamento poderia ser mais aprofundado. Tem potencial mas precisa de ajustes importantes.', 1, 4, 3, 4, 5, 2, 4, 3.7, 0, '1-3-anos', 'APROVADA', '2024-04-20 09:45:00.000', '2024-04-20 09:45:00.000'),
('cm5aval0080500000000000', 'cm5fran0080000000000000', 'cm5user0200000000000000', 'Franquia bem estruturada', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 0, 7, 8, 9, 8, 7, 8, 7.8, 1, '1-3-anos', 'APROVADA', '2024-05-15 13:00:00.000', '2024-05-15 13:00:00.000');

-- ----- Franchise 09: Gênio Cursos (6 reviews: 5 positive, 1 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0090100000000000', 'cm5fran0090000000000000', 'cm5user0010000000000000', 'Excelente suporte da rede', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 7, 6, 7, 8, 5, 7, 6.7, 1, '1-3-anos', 'APROVADA', '2024-02-14 09:30:00.000', '2024-02-14 09:30:00.000'),
('cm5aval0090200000000000', 'cm5fran0090000000000000', 'cm5user0070000000000000', 'Suporte acima da média', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 0, 8, 7, 8, 9, 7, 8, 7.8, 1, '3-5-anos', 'APROVADA', '2024-03-05 14:00:00.000', '2024-03-05 14:00:00.000'),
('cm5aval0090300000000000', 'cm5fran0090000000000000', 'cm5user0110000000000000', 'Marketing insuficiente', 'Preciso ser honesto: a comunicação da franqueadora precisa melhorar bastante. Muitas decisões são tomadas sem consultar os franqueados e o marketing poderia ser mais efetivo. O produto é bom, mas a gestão da rede precisa evoluir.', 1, 4, 3, 4, 5, 2, 3, 3.5, 0, 'menos-1-ano', 'APROVADA', '2024-03-25 11:20:00.000', '2024-03-25 11:20:00.000'),
('cm5aval0090400000000000', 'cm5fran0090000000000000', 'cm5user0150000000000000', 'Ótima franquia para investir', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 1, 9, 8, 9, 10, 8, 9, 8.8, 1, '5-mais-anos', 'APROVADA', '2024-04-12 10:45:00.000', '2024-04-12 10:45:00.000'),
('cm5aval0090500000000000', 'cm5fran0090000000000000', 'cm5user0190000000000000', 'Retorno dentro do esperado', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 0, 8, 7, 8, 8, 6, 8, 7.5, 1, '1-3-anos', 'APROVADA', '2024-05-02 15:30:00.000', '2024-05-02 15:30:00.000'),
('cm5aval0090600000000000', 'cm5fran0090000000000000', 'cm5user0230000000000000', 'Treinamento completo e eficaz', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 7, 8, 7, 9, 7, 9, 7.8, 1, '3-5-anos', 'APROVADA', '2024-05-22 08:15:00.000', '2024-05-22 08:15:00.000');

-- ----- Franchise 10: English Now (7 reviews: 5 positive, 2 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0100100000000000', 'cm5fran0100000000000000', 'cm5user0020000000000000', 'Franquia bem estruturada', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 1, 8, 7, 8, 8, 7, 9, 7.8, 1, '1-3-anos', 'APROVADA', '2024-02-10 10:00:00.000', '2024-02-10 10:00:00.000'),
('cm5aval0100200000000000', 'cm5fran0100000000000000', 'cm5user0060000000000000', 'Suporte deixa a desejar', 'Infelizmente, a experiência não foi como esperava. O suporte demora muito para responder e quando responde, nem sempre resolve. O retorno financeiro está bem abaixo do que foi prometido na apresentação. Espero que melhorem nesses pontos.', 0, 4, 2, 5, 4, 3, 3, 3.5, 0, 'menos-1-ano', 'APROVADA', '2024-02-28 14:30:00.000', '2024-02-28 14:30:00.000'),
('cm5aval0100300000000000', 'cm5fran0100000000000000', 'cm5user0100000000000000', 'Marca forte e reconhecida', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 7, 6, 7, 8, 6, 8, 7.0, 1, '1-3-anos', 'APROVADA', '2024-03-15 11:00:00.000', '2024-03-15 11:00:00.000'),
('cm5aval0100400000000000', 'cm5fran0100000000000000', 'cm5user0140000000000000', 'Retorno dentro do esperado', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 1, 9, 8, 9, 10, 8, 9, 8.8, 1, '5-mais-anos', 'APROVADA', '2024-04-02 09:30:00.000', '2024-04-02 09:30:00.000'),
('cm5aval0100500000000000', 'cm5fran0100000000000000', 'cm5user0180000000000000', 'Retorno abaixo do prometido', 'O investimento inicial foi maior do que o planejado por causa de custos extras que não foram mencionados no início. O suporte técnico é lento e o treinamento poderia ser mais aprofundado. Tem potencial mas precisa de ajustes importantes.', 0, 5, 3, 3, 4, 4, 4, 3.8, 0, '1-3-anos', 'APROVADA', '2024-04-20 13:45:00.000', '2024-04-20 13:45:00.000'),
('cm5aval0100600000000000', 'cm5fran0100000000000000', 'cm5user0220000000000000', 'Excelente suporte da rede', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 8, 9, 8, 9, 7, 10, 8.5, 1, '3-5-anos', 'APROVADA', '2024-05-10 10:15:00.000', '2024-05-10 10:15:00.000'),
('cm5aval0100700000000000', 'cm5fran0100000000000000', 'cm5user0260000000000000', 'Suporte acima da média', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 7, 7, 7, 8, 6, 8, 7.2, 1, '1-3-anos', 'APROVADA', '2024-05-30 15:00:00.000', '2024-05-30 15:00:00.000');

-- ----- Franchise 11: Code School (3 reviews: 2 positive, 1 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0110100000000000', 'cm5fran0110000000000000', 'cm5user0030000000000000', 'Ótima franquia para investir', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 8, 7, 8, 9, 7, 9, 8.0, 1, '1-3-anos', 'APROVADA', '2024-03-01 10:00:00.000', '2024-03-01 10:00:00.000'),
('cm5aval0110200000000000', 'cm5fran0110000000000000', 'cm5user0090000000000000', 'Falta de transparência', 'Preciso ser honesto: a comunicação da franqueadora precisa melhorar bastante. Muitas decisões são tomadas sem consultar os franqueados e o marketing poderia ser mais efetivo. O produto é bom, mas a gestão da rede precisa evoluir.', 0, 5, 4, 3, 5, 3, 4, 4.0, 0, 'menos-1-ano', 'APROVADA', '2024-04-10 14:30:00.000', '2024-04-10 14:30:00.000'),
('cm5aval0110300000000000', 'cm5fran0110000000000000', 'cm5user0170000000000000', 'Muito satisfeito com o retorno', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 9, 8, 9, 10, 8, 10, 9.0, 1, '3-5-anos', 'APROVADA', '2024-05-20 11:15:00.000', '2024-05-20 11:15:00.000');

-- ----- Franchise 12: Lava Fácil (5 reviews: 4 positive, 1 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0120100000000000', 'cm5fran0120000000000000', 'cm5user0040000000000000', 'Retorno dentro do esperado', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 0, 7, 8, 7, 7, 6, 8, 7.2, 1, '1-3-anos', 'APROVADA', '2024-02-20 09:00:00.000', '2024-02-20 09:00:00.000'),
('cm5aval0120200000000000', 'cm5fran0120000000000000', 'cm5user0080000000000000', 'Franquia bem estruturada', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 8, 7, 8, 9, 7, 9, 8.0, 1, '3-5-anos', 'APROVADA', '2024-03-12 13:30:00.000', '2024-03-12 13:30:00.000'),
('cm5aval0120300000000000', 'cm5fran0120000000000000', 'cm5user0120000000000000', 'Suporte deixa a desejar', 'O investimento inicial foi maior do que o planejado por causa de custos extras que não foram mencionados no início. O suporte técnico é lento e o treinamento poderia ser mais aprofundado. Tem potencial mas precisa de ajustes importantes.', 1, 3, 4, 3, 3, 2, 3, 3.0, 0, 'menos-1-ano', 'APROVADA', '2024-04-05 10:45:00.000', '2024-04-05 10:45:00.000'),
('cm5aval0120400000000000', 'cm5fran0120000000000000', 'cm5user0160000000000000', 'Treinamento completo e eficaz', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 0, 9, 8, 9, 10, 8, 9, 8.8, 1, '5-mais-anos', 'APROVADA', '2024-04-28 14:00:00.000', '2024-04-28 14:00:00.000'),
('cm5aval0120500000000000', 'cm5fran0120000000000000', 'cm5user0220000000000000', 'Marca forte e reconhecida', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 8, 7, 8, 8, 7, 8, 7.7, 1, '1-3-anos', 'APROVADA', '2024-05-18 11:30:00.000', '2024-05-18 11:30:00.000');

-- ----- Franchise 13: Pet Care Brasil (4 reviews: 3 positive, 1 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0130100000000000', 'cm5fran0130000000000000', 'cm5user0050000000000000', 'Excelente suporte da rede', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 9, 8, 8, 9, 8, 10, 8.7, 1, '3-5-anos', 'APROVADA', '2024-02-25 10:00:00.000', '2024-02-25 10:00:00.000'),
('cm5aval0130200000000000', 'cm5fran0130000000000000', 'cm5user0110000000000000', 'Retorno abaixo do prometido', 'Infelizmente, a experiência não foi como esperava. O suporte demora muito para responder e quando responde, nem sempre resolve. O retorno financeiro está bem abaixo do que foi prometido na apresentação. Espero que melhorem nesses pontos.', 0, 4, 3, 4, 5, 2, 3, 3.5, 0, 'menos-1-ano', 'APROVADA', '2024-03-18 14:15:00.000', '2024-03-18 14:15:00.000'),
('cm5aval0130300000000000', 'cm5fran0130000000000000', 'cm5user0190000000000000', 'Suporte acima da média', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 1, 8, 7, 9, 8, 7, 9, 8.0, 1, '1-3-anos', 'APROVADA', '2024-04-10 11:30:00.000', '2024-04-10 11:30:00.000'),
('cm5aval0130400000000000', 'cm5fran0130000000000000', 'cm5user0250000000000000', 'Ótima franquia para investir', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 7, 8, 7, 8, 6, 8, 7.3, 1, '1-3-anos', 'APROVADA', '2024-05-05 15:45:00.000', '2024-05-05 15:45:00.000');

-- ----- Franchise 14: Fix It (6 reviews: 4 positive, 2 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0140100000000000', 'cm5fran0140000000000000', 'cm5user0010000000000000', 'Muito satisfeito com o retorno', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 0, 7, 6, 7, 7, 5, 7, 6.5, 1, '1-3-anos', 'APROVADA', '2024-02-15 10:00:00.000', '2024-02-15 10:00:00.000'),
('cm5aval0140200000000000', 'cm5fran0140000000000000', 'cm5user0070000000000000', 'Falta de transparência', 'Preciso ser honesto: a comunicação da franqueadora precisa melhorar bastante. Muitas decisões são tomadas sem consultar os franqueados e o marketing poderia ser mais efetivo. O produto é bom, mas a gestão da rede precisa evoluir.', 1, 3, 4, 2, 3, 3, 3, 3.0, 0, 'menos-1-ano', 'APROVADA', '2024-03-05 14:30:00.000', '2024-03-05 14:30:00.000'),
('cm5aval0140300000000000', 'cm5fran0140000000000000', 'cm5user0130000000000000', 'Franquia bem estruturada', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 8, 7, 8, 9, 7, 8, 7.8, 1, '3-5-anos', 'APROVADA', '2024-03-28 11:00:00.000', '2024-03-28 11:00:00.000'),
('cm5aval0140400000000000', 'cm5fran0140000000000000', 'cm5user0190000000000000', 'Precisam melhorar muito', 'O investimento inicial foi maior do que o planejado por causa de custos extras que não foram mencionados no início. O suporte técnico é lento e o treinamento poderia ser mais aprofundado. Tem potencial mas precisa de ajustes importantes.', 0, 5, 3, 4, 5, 2, 4, 3.8, 0, '1-3-anos', 'APROVADA', '2024-04-15 09:30:00.000', '2024-04-15 09:30:00.000'),
('cm5aval0140500000000000', 'cm5fran0140000000000000', 'cm5user0230000000000000', 'Treinamento completo e eficaz', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 1, 9, 8, 9, 10, 7, 9, 8.7, 1, '5-mais-anos', 'APROVADA', '2024-05-08 13:15:00.000', '2024-05-08 13:15:00.000'),
('cm5aval0140600000000000', 'cm5fran0140000000000000', 'cm5user0270000000000000', 'Retorno dentro do esperado', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 8, 7, 8, 8, 6, 8, 7.5, 1, '1-3-anos', 'APROVADA', '2024-05-28 10:45:00.000', '2024-05-28 10:45:00.000');

-- ----- Franchise 15: Urban Style (5 reviews: 4 positive, 1 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0150100000000000', 'cm5fran0150000000000000', 'cm5user0030000000000000', 'Excelente suporte da rede', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 0, 8, 9, 8, 9, 8, 10, 8.7, 1, '3-5-anos', 'APROVADA', '2024-02-12 10:30:00.000', '2024-02-12 10:30:00.000'),
('cm5aval0150200000000000', 'cm5fran0150000000000000', 'cm5user0090000000000000', 'Suporte acima da média', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 1, 7, 7, 8, 8, 7, 8, 7.5, 1, '1-3-anos', 'APROVADA', '2024-03-08 14:00:00.000', '2024-03-08 14:00:00.000'),
('cm5aval0150300000000000', 'cm5fran0150000000000000', 'cm5user0150000000000000', 'Retorno abaixo do prometido', 'Infelizmente, a experiência não foi como esperava. O suporte demora muito para responder e quando responde, nem sempre resolve. O retorno financeiro está bem abaixo do que foi prometido na apresentação. Espero que melhorem nesses pontos.', 1, 4, 3, 5, 4, 3, 3, 3.7, 0, 'menos-1-ano', 'APROVADA', '2024-04-02 11:15:00.000', '2024-04-02 11:15:00.000'),
('cm5aval0150400000000000', 'cm5fran0150000000000000', 'cm5user0210000000000000', 'Marca forte e reconhecida', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 0, 9, 8, 9, 10, 8, 9, 8.8, 1, '5-mais-anos', 'APROVADA', '2024-04-25 09:45:00.000', '2024-04-25 09:45:00.000'),
('cm5aval0150500000000000', 'cm5fran0150000000000000', 'cm5user0270000000000000', 'Ótima franquia para investir', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 8, 7, 8, 9, 7, 9, 8.0, 1, '1-3-anos', 'APROVADA', '2024-05-15 13:30:00.000', '2024-05-15 13:30:00.000');

-- ----- Franchise 16: Mini Fashion Kids (4 reviews: 3 positive, 1 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0160100000000000', 'cm5fran0160000000000000', 'cm5user0040000000000000', 'Retorno dentro do esperado', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 1, 7, 8, 7, 8, 7, 8, 7.5, 1, '1-3-anos', 'APROVADA', '2024-02-28 10:00:00.000', '2024-02-28 10:00:00.000'),
('cm5aval0160200000000000', 'cm5fran0160000000000000', 'cm5user0100000000000000', 'Precisam melhorar muito', 'Preciso ser honesto: a comunicação da franqueadora precisa melhorar bastante. Muitas decisões são tomadas sem consultar os franqueados e o marketing poderia ser mais efetivo. O produto é bom, mas a gestão da rede precisa evoluir.', 0, 4, 3, 3, 5, 4, 3, 3.7, 0, 'menos-1-ano', 'APROVADA', '2024-03-20 14:30:00.000', '2024-03-20 14:30:00.000'),
('cm5aval0160300000000000', 'cm5fran0160000000000000', 'cm5user0180000000000000', 'Franquia bem estruturada', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 1, 8, 7, 9, 9, 7, 9, 8.2, 1, '3-5-anos', 'APROVADA', '2024-04-12 11:45:00.000', '2024-04-12 11:45:00.000'),
('cm5aval0160400000000000', 'cm5fran0160000000000000', 'cm5user0240000000000000', 'Treinamento completo e eficaz', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 9, 8, 8, 10, 8, 10, 8.8, 1, '1-3-anos', 'APROVADA', '2024-05-02 09:15:00.000', '2024-05-02 09:15:00.000');

-- ----- Franchise 17: Tech Solutions (5 reviews: 4 positive, 1 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0170100000000000', 'cm5fran0170000000000000', 'cm5user0020000000000000', 'Suporte acima da média', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 9, 8, 9, 10, 8, 10, 9.0, 1, '3-5-anos', 'APROVADA', '2024-02-10 10:00:00.000', '2024-02-10 10:00:00.000'),
('cm5aval0170200000000000', 'cm5fran0170000000000000', 'cm5user0080000000000000', 'Retorno dentro do esperado', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 0, 7, 7, 8, 8, 6, 8, 7.3, 1, '1-3-anos', 'APROVADA', '2024-03-05 14:45:00.000', '2024-03-05 14:45:00.000'),
('cm5aval0170300000000000', 'cm5fran0170000000000000', 'cm5user0140000000000000', 'Marketing insuficiente', 'O investimento inicial foi maior do que o planejado por causa de custos extras que não foram mencionados no início. O suporte técnico é lento e o treinamento poderia ser mais aprofundado. Tem potencial mas precisa de ajustes importantes.', 1, 5, 3, 4, 5, 2, 4, 3.8, 0, '1-3-anos', 'APROVADA', '2024-03-28 11:30:00.000', '2024-03-28 11:30:00.000'),
('cm5aval0170400000000000', 'cm5fran0170000000000000', 'cm5user0200000000000000', 'Ótima franquia para investir', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 8, 7, 8, 9, 7, 9, 8.0, 1, '5-mais-anos', 'APROVADA', '2024-04-18 09:00:00.000', '2024-04-18 09:00:00.000'),
('cm5aval0170500000000000', 'cm5fran0170000000000000', 'cm5user0260000000000000', 'Excelente suporte da rede', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 0, 8, 9, 8, 9, 7, 9, 8.3, 1, '1-3-anos', 'APROVADA', '2024-05-10 13:15:00.000', '2024-05-10 13:15:00.000');

-- ----- Franchise 18: Smart Print (6 reviews: 4 positive, 2 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0180100000000000', 'cm5fran0180000000000000', 'cm5user0010000000000000', 'Franquia bem estruturada', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 7, 6, 7, 8, 6, 7, 6.8, 1, '1-3-anos', 'APROVADA', '2024-02-08 10:30:00.000', '2024-02-08 10:30:00.000'),
('cm5aval0180200000000000', 'cm5fran0180000000000000', 'cm5user0050000000000000', 'Suporte deixa a desejar', 'Infelizmente, a experiência não foi como esperava. O suporte demora muito para responder e quando responde, nem sempre resolve. O retorno financeiro está bem abaixo do que foi prometido na apresentação. Espero que melhorem nesses pontos.', 0, 3, 2, 4, 4, 3, 2, 3.0, 0, 'menos-1-ano', 'APROVADA', '2024-03-01 14:00:00.000', '2024-03-01 14:00:00.000'),
('cm5aval0180300000000000', 'cm5fran0180000000000000', 'cm5user0110000000000000', 'Muito satisfeito com o retorno', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 1, 8, 7, 8, 9, 7, 9, 8.0, 1, '3-5-anos', 'APROVADA', '2024-03-22 11:15:00.000', '2024-03-22 11:15:00.000'),
('cm5aval0180400000000000', 'cm5fran0180000000000000', 'cm5user0170000000000000', 'Retorno abaixo do prometido', 'Preciso ser honesto: a comunicação da franqueadora precisa melhorar bastante. Muitas decisões são tomadas sem consultar os franqueados e o marketing poderia ser mais efetivo. O produto é bom, mas a gestão da rede precisa evoluir.', 1, 4, 3, 3, 5, 4, 3, 3.7, 0, '1-3-anos', 'APROVADA', '2024-04-10 09:45:00.000', '2024-04-10 09:45:00.000'),
('cm5aval0180500000000000', 'cm5fran0180000000000000', 'cm5user0210000000000000', 'Ótima franquia para investir', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 0, 9, 8, 9, 10, 8, 9, 8.8, 1, '5-mais-anos', 'APROVADA', '2024-05-02 13:30:00.000', '2024-05-02 13:30:00.000'),
('cm5aval0180600000000000', 'cm5fran0180000000000000', 'cm5user0250000000000000', 'Treinamento completo e eficaz', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 8, 7, 8, 8, 7, 8, 7.7, 1, '1-3-anos', 'APROVADA', '2024-05-22 10:00:00.000', '2024-05-22 10:00:00.000');

-- ----- Franchise 19: Gym Express (8 reviews: 6 positive, 2 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0190100000000000', 'cm5fran0190000000000000', 'cm5user0010000000000000', 'Suporte acima da média', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 8, 7, 8, 9, 7, 9, 8.0, 1, '3-5-anos', 'APROVADA', '2024-02-05 10:00:00.000', '2024-02-05 10:00:00.000'),
('cm5aval0190200000000000', 'cm5fran0190000000000000', 'cm5user0030000000000000', 'Retorno dentro do esperado', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 0, 9, 8, 9, 10, 8, 10, 9.0, 1, '5-mais-anos', 'APROVADA', '2024-02-20 14:30:00.000', '2024-02-20 14:30:00.000'),
('cm5aval0190300000000000', 'cm5fran0190000000000000', 'cm5user0070000000000000', 'Falta de transparência', 'Infelizmente, a experiência não foi como esperava. O suporte demora muito para responder e quando responde, nem sempre resolve. O retorno financeiro está bem abaixo do que foi prometido na apresentação. Espero que melhorem nesses pontos.', 1, 3, 2, 3, 4, 2, 3, 2.8, 0, 'menos-1-ano', 'APROVADA', '2024-03-08 11:15:00.000', '2024-03-08 11:15:00.000'),
('cm5aval0190400000000000', 'cm5fran0190000000000000', 'cm5user0110000000000000', 'Ótima franquia para investir', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 7, 6, 7, 8, 6, 7, 6.8, 1, '1-3-anos', 'APROVADA', '2024-03-25 09:45:00.000', '2024-03-25 09:45:00.000'),
('cm5aval0190500000000000', 'cm5fran0190000000000000', 'cm5user0150000000000000', 'Franquia bem estruturada', 'Estou muito satisfeito com a transparência da franqueadora. Todos os números são compartilhados abertamente e as reuniões mensais com os franqueados são muito produtivas. Sinto que faço parte de uma rede que valoriza seus parceiros.', 0, 8, 8, 9, 9, 7, 9, 8.3, 1, '3-5-anos', 'APROVADA', '2024-04-12 13:00:00.000', '2024-04-12 13:00:00.000'),
('cm5aval0190600000000000', 'cm5fran0190000000000000', 'cm5user0190000000000000', 'Retorno abaixo do prometido', 'O investimento inicial foi maior do que o planejado por causa de custos extras que não foram mencionados no início. O suporte técnico é lento e o treinamento poderia ser mais aprofundado. Tem potencial mas precisa de ajustes importantes.', 1, 5, 4, 4, 5, 3, 4, 4.2, 0, '1-3-anos', 'APROVADA', '2024-04-28 10:30:00.000', '2024-04-28 10:30:00.000'),
('cm5aval0190700000000000', 'cm5fran0190000000000000', 'cm5user0230000000000000', 'Marca forte e reconhecida', 'A franquia superou minhas expectativas. O modelo de negócio é sólido, o treinamento é excelente e o suporte pós-abertura é constante. Recomendo para quem busca segurança no investimento.', 1, 10, 9, 10, 10, 9, 10, 9.7, 1, '5-mais-anos', 'APROVADA', '2024-05-15 14:15:00.000', '2024-05-15 14:15:00.000'),
('cm5aval0190800000000000', 'cm5fran0190000000000000', 'cm5user0290000000000000', 'Excelente suporte da rede', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 0, 7, 7, 8, 8, 7, 8, 7.5, 1, '1-3-anos', 'APROVADA', '2024-06-02 11:00:00.000', '2024-06-02 11:00:00.000');

-- ----- Franchise 20: Clean House (3 reviews: 3 positive, 0 negative) -----
INSERT INTO `avaliacoes` (`id`, `franquiaId`, `userId`, `titulo`, `conteudo`, `anonimo`, `notaSuporte`, `notaRentabilidade`, `notaTransparencia`, `notaTreinamento`, `notaMarketing`, `notaSatisfacao`, `notaGeral`, `investiriaNovamente`, `tempoFranquia`, `status`, `createdAt`, `updatedAt`) VALUES
('cm5aval0200100000000000', 'cm5fran0200000000000000', 'cm5user0060000000000000', 'Excelente suporte da rede', 'Sou franqueado há mais de dois anos e posso dizer que foi uma das melhores decisões que tomei. O suporte da franqueadora é constante, sempre disponível para tirar dúvidas e ajudar com problemas operacionais. O treinamento inicial foi muito completo e me preparou bem para a operação.', 1, 8, 7, 8, 9, 7, 9, 8.0, 1, '1-3-anos', 'APROVADA', '2024-03-05 10:00:00.000', '2024-03-05 10:00:00.000'),
('cm5aval0200200000000000', 'cm5fran0200000000000000', 'cm5user0120000000000000', 'Muito satisfeito com o retorno', 'O retorno do investimento veio dentro do prazo estimado, o que me deixou muito satisfeito. A marca é forte na região e atrai clientes naturalmente. A equipe de marketing da franqueadora sempre envia materiais de qualidade para campanhas locais.', 0, 9, 8, 9, 10, 8, 10, 9.0, 1, '3-5-anos', 'APROVADA', '2024-04-08 14:30:00.000', '2024-04-08 14:30:00.000'),
('cm5aval0200300000000000', 'cm5fran0200000000000000', 'cm5user0280000000000000', 'Retorno dentro do esperado', 'Excelente rede de franquias. Desde o início, o processo de implantação foi bem organizado. Recebi todo o suporte necessário para abrir a unidade no prazo e com qualidade. O sistema de gestão fornecido é moderno e fácil de usar.', 1, 7, 7, 7, 8, 6, 8, 7.2, 1, '1-3-anos', 'APROVADA', '2024-05-12 11:15:00.000', '2024-05-12 11:15:00.000');

-- ============================================================
-- RESPOSTAS (Company responses - ~60% of reviews)
-- ============================================================

INSERT INTO `respostas` (`id`, `avaliacaoId`, `conteudo`, `createdAt`) VALUES
-- Burger Town responses (5 of 8 = 62.5%)
('cm5resp0010100000000000', 'cm5aval0010100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-11 10:00:00.000'),
('cm5resp0010200000000000', 'cm5aval0010200000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-16 09:00:00.000'),
('cm5resp0010300000000000', 'cm5aval0010300000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-03-02 10:00:00.000'),
('cm5resp0010400000000000', 'cm5aval0010400000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-11 10:00:00.000'),
('cm5resp0010700000000000', 'cm5aval0010700000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-05-13 10:00:00.000'),

-- Açaí Premium responses (4 of 6 = 66.7%)
('cm5resp0020100000000000', 'cm5aval0020100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-13 10:00:00.000'),
('cm5resp0020200000000000', 'cm5aval0020200000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-06 10:00:00.000'),
('cm5resp0020400000000000', 'cm5aval0020400000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-04-11 10:00:00.000'),
('cm5resp0020600000000000', 'cm5aval0020600000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-05-21 10:00:00.000'),

-- Pizza Express responses (3 of 5 = 60%)
('cm5resp0030100000000000', 'cm5aval0030100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-21 10:00:00.000'),
('cm5resp0030300000000000', 'cm5aval0030300000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-04-03 10:00:00.000'),
('cm5resp0030500000000000', 'cm5aval0030500000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-05-16 10:00:00.000'),

-- Café & Pão responses (4 of 7 = 57.1%)
('cm5resp0040100000000000', 'cm5aval0040100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-09 10:00:00.000'),
('cm5resp0040300000000000', 'cm5aval0040300000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-13 10:00:00.000'),
('cm5resp0040500000000000', 'cm5aval0040500000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-04-19 10:00:00.000'),
('cm5resp0040700000000000', 'cm5aval0040700000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-06-02 10:00:00.000'),

-- Sushi Mais responses (3 of 4 = 75%)
('cm5resp0050100000000000', 'cm5aval0050100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-19 10:00:00.000'),
('cm5resp0050200000000000', 'cm5aval0050200000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-09 10:00:00.000'),
('cm5resp0050300000000000', 'cm5aval0050300000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-04-16 10:00:00.000'),

-- Beleza Natural responses (5 of 9 = 55.6%)
('cm5resp0060100000000000', 'cm5aval0060100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-06 10:00:00.000'),
('cm5resp0060200000000000', 'cm5aval0060200000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-19 10:00:00.000'),
('cm5resp0060500000000000', 'cm5aval0060500000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-09 10:00:00.000'),
('cm5resp0060700000000000', 'cm5aval0060700000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-05-11 10:00:00.000'),
('cm5resp0060900000000000', 'cm5aval0060900000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-06-11 10:00:00.000'),

-- Farma Saúde responses (6 of 10 = 60%)
('cm5resp0070100000000000', 'cm5aval0070100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-04 10:00:00.000'),
('cm5resp0070200000000000', 'cm5aval0070200000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-16 10:00:00.000'),
('cm5resp0070300000000000', 'cm5aval0070300000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-03-02 10:00:00.000'),
('cm5resp0070500000000000', 'cm5aval0070500000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-06 10:00:00.000'),
('cm5resp0070600000000000', 'cm5aval0070600000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-23 10:00:00.000'),
('cm5resp0070900000000000', 'cm5aval0070900000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-06-06 10:00:00.000'),

-- Estética Plus responses (3 of 5 = 60%)
('cm5resp0080100000000000', 'cm5aval0080100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-23 10:00:00.000'),
('cm5resp0080200000000000', 'cm5aval0080200000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-03-11 10:00:00.000'),
('cm5resp0080300000000000', 'cm5aval0080300000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-03 10:00:00.000'),

-- Gênio Cursos responses (4 of 6 = 66.7%)
('cm5resp0090100000000000', 'cm5aval0090100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-15 10:00:00.000'),
('cm5resp0090200000000000', 'cm5aval0090200000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-06 10:00:00.000'),
('cm5resp0090400000000000', 'cm5aval0090400000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-13 10:00:00.000'),
('cm5resp0090500000000000', 'cm5aval0090500000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-05-03 10:00:00.000'),

-- English Now responses (4 of 7 = 57.1%)
('cm5resp0100100000000000', 'cm5aval0100100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-11 10:00:00.000'),
('cm5resp0100200000000000', 'cm5aval0100200000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-03-01 10:00:00.000'),
('cm5resp0100400000000000', 'cm5aval0100400000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-03 10:00:00.000'),
('cm5resp0100600000000000', 'cm5aval0100600000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-05-11 10:00:00.000'),

-- Code School responses (2 of 3 = 66.7%)
('cm5resp0110100000000000', 'cm5aval0110100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-02 10:00:00.000'),
('cm5resp0110200000000000', 'cm5aval0110200000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-04-11 10:00:00.000'),

-- Lava Fácil responses (3 of 5 = 60%)
('cm5resp0120100000000000', 'cm5aval0120100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-21 10:00:00.000'),
('cm5resp0120200000000000', 'cm5aval0120200000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-13 10:00:00.000'),
('cm5resp0120400000000000', 'cm5aval0120400000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-29 10:00:00.000'),

-- Pet Care Brasil responses (2 of 4 = 50%)
('cm5resp0130100000000000', 'cm5aval0130100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-26 10:00:00.000'),
('cm5resp0130200000000000', 'cm5aval0130200000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-03-19 10:00:00.000'),

-- Fix It responses (4 of 6 = 66.7%)
('cm5resp0140100000000000', 'cm5aval0140100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-16 10:00:00.000'),
('cm5resp0140200000000000', 'cm5aval0140200000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-03-06 10:00:00.000'),
('cm5resp0140300000000000', 'cm5aval0140300000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-29 10:00:00.000'),
('cm5resp0140500000000000', 'cm5aval0140500000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-05-09 10:00:00.000'),

-- Urban Style responses (3 of 5 = 60%)
('cm5resp0150100000000000', 'cm5aval0150100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-13 10:00:00.000'),
('cm5resp0150300000000000', 'cm5aval0150300000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-04-03 10:00:00.000'),
('cm5resp0150400000000000', 'cm5aval0150400000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-26 10:00:00.000'),

-- Mini Fashion Kids responses (2 of 4 = 50%)
('cm5resp0160100000000000', 'cm5aval0160100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-01 10:00:00.000'),
('cm5resp0160300000000000', 'cm5aval0160300000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-13 10:00:00.000'),

-- Tech Solutions responses (3 of 5 = 60%)
('cm5resp0170100000000000', 'cm5aval0170100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-11 10:00:00.000'),
('cm5resp0170200000000000', 'cm5aval0170200000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-06 10:00:00.000'),
('cm5resp0170400000000000', 'cm5aval0170400000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-19 10:00:00.000'),

-- Smart Print responses (4 of 6 = 66.7%)
('cm5resp0180100000000000', 'cm5aval0180100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-09 10:00:00.000'),
('cm5resp0180200000000000', 'cm5aval0180200000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-03-02 10:00:00.000'),
('cm5resp0180300000000000', 'cm5aval0180300000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-23 10:00:00.000'),
('cm5resp0180500000000000', 'cm5aval0180500000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-05-03 10:00:00.000'),

-- Gym Express responses (5 of 8 = 62.5%)
('cm5resp0190100000000000', 'cm5aval0190100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-06 10:00:00.000'),
('cm5resp0190200000000000', 'cm5aval0190200000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-02-21 10:00:00.000'),
('cm5resp0190300000000000', 'cm5aval0190300000000000', 'Agradecemos seu feedback honesto. Vamos analisar seus pontos e trabalhar para melhorar. Entre em contato conosco pelo suporte para resolvermos as questões levantadas.', '2024-03-09 10:00:00.000'),
('cm5resp0190500000000000', 'cm5aval0190500000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-13 10:00:00.000'),
('cm5resp0190700000000000', 'cm5aval0190700000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-05-16 10:00:00.000'),

-- Clean House responses (2 of 3 = 66.7%)
('cm5resp0200100000000000', 'cm5aval0200100000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-03-06 10:00:00.000'),
('cm5resp0200200000000000', 'cm5aval0200200000000000', 'Obrigado pelo seu feedback positivo! Ficamos muito felizes em saber que sua experiência tem sido satisfatória. Continuaremos trabalhando para manter a excelência.', '2024-04-09 10:00:00.000');

-- ============================================================
-- UPDATE FRANCHISE SCORES
-- Calculated from the review data above
-- ============================================================

-- Franchise 01: Burger Town (8 reviews, 5 responses, 6 recommend)
-- Scores: S=(9+8+3+7+8+4+10+7)/8=7.0, R=(8+9+2+7+6+3+8+7)/8=6.3, T=(8+7+4+8+9+3+9+8)/8=7.0, Tr=(9+8+5+9+7+4+10+8)/8=7.5, M=(7+8+3+6+7+2+8+6)/8=5.9, Sa=(9+10+3+8+8+4+9+8)/8=7.4
-- NotaGeral = (7.0+6.3+7.0+7.5+5.9+7.4)/6 = 6.9
-- IndiceResposta = 5/8*100 = 62.50, IndiceRecomendacao = 6/8*100 = 75.00
UPDATE `franquias` SET
  `notaGeral` = 6.9, `notaSuporte` = 7.0, `notaRentabilidade` = 6.3, `notaTransparencia` = 7.0,
  `notaTreinamento` = 7.5, `notaMarketing` = 5.9, `notaSatisfacao` = 7.4,
  `totalAvaliacoes` = 8, `indiceResposta` = 62.50, `indiceRecomendacao` = 75.00,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0010000000000000';

-- Franchise 02: Açaí Premium (6 reviews, 4 responses, 5 recommend)
-- S=(8+9+7+4+8+9)/6=7.5, R=(7+8+6+3+9+8)/6=6.8, T=(9+8+7+2+8+9)/6=7.2, Tr=(8+9+8+5+7+10)/6=7.8, M=(7+8+6+3+7+8)/6=6.5, Sa=(9+10+8+3+9+10)/6=8.2
-- NotaGeral = (7.5+6.8+7.2+7.8+6.5+8.2)/6 = 7.3
-- IndiceResposta = 4/6*100 = 66.67, IndiceRecomendacao = 5/6*100 = 83.33
UPDATE `franquias` SET
  `notaGeral` = 7.3, `notaSuporte` = 7.5, `notaRentabilidade` = 6.8, `notaTransparencia` = 7.2,
  `notaTreinamento` = 7.8, `notaMarketing` = 6.5, `notaSatisfacao` = 8.2,
  `totalAvaliacoes` = 6, `indiceResposta` = 66.67, `indiceRecomendacao` = 83.33,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0020000000000000';

-- Franchise 03: Pizza Express (5 reviews, 3 responses, 4 recommend)
-- S=(8+7+3+9+8)/5=7.0, R=(9+6+4+7+8)/5=6.8, T=(7+8+3+9+8)/5=7.0, Tr=(7+9+4+8+9)/5=7.4, M=(8+7+2+6+7)/5=6.0, Sa=(9+8+3+8+9)/5=7.4
-- NotaGeral = (7.0+6.8+7.0+7.4+6.0+7.4)/6 = 6.9
-- IndiceResposta = 3/5*100 = 60.00, IndiceRecomendacao = 4/5*100 = 80.00
UPDATE `franquias` SET
  `notaGeral` = 6.9, `notaSuporte` = 7.0, `notaRentabilidade` = 6.8, `notaTransparencia` = 7.0,
  `notaTreinamento` = 7.4, `notaMarketing` = 6.0, `notaSatisfacao` = 7.4,
  `totalAvaliacoes` = 5, `indiceResposta` = 60.00, `indiceRecomendacao` = 80.00,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0030000000000000';

-- Franchise 04: Café & Pão (7 reviews, 4 responses, 5 recommend)
-- S=(8+3+9+7+5+8+10)/7=7.1, R=(7+2+8+8+3+7+9)/7=6.3, T=(8+3+9+7+4+9+8)/7=6.9, Tr=(9+4+10+7+3+8+9)/7=7.1, M=(7+3+8+6+4+7+8)/7=6.1, Sa=(8+2+9+8+4+9+10)/7=7.1
-- NotaGeral = (7.1+6.3+6.9+7.1+6.1+7.1)/6 = 6.8
-- IndiceResposta = 4/7*100 = 57.14, IndiceRecomendacao = 5/7*100 = 71.43
UPDATE `franquias` SET
  `notaGeral` = 6.8, `notaSuporte` = 7.1, `notaRentabilidade` = 6.3, `notaTransparencia` = 6.9,
  `notaTreinamento` = 7.1, `notaMarketing` = 6.1, `notaSatisfacao` = 7.1,
  `totalAvaliacoes` = 7, `indiceResposta` = 57.14, `indiceRecomendacao` = 71.43,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0040000000000000';

-- Franchise 05: Sushi Mais (4 reviews, 3 responses, 3 recommend)
-- S=(7+9+4+8)/4=7.0, R=(8+7+3+9)/4=6.8, T=(7+9+5+8)/4=7.3, Tr=(8+9+4+10)/4=7.8, M=(6+8+2+7)/4=5.8, Sa=(8+10+3+9)/4=7.5
-- NotaGeral = (7.0+6.8+7.3+7.8+5.8+7.5)/6 = 7.0
-- IndiceResposta = 3/4*100 = 75.00, IndiceRecomendacao = 3/4*100 = 75.00
UPDATE `franquias` SET
  `notaGeral` = 7.0, `notaSuporte` = 7.0, `notaRentabilidade` = 6.8, `notaTransparencia` = 7.3,
  `notaTreinamento` = 7.8, `notaMarketing` = 5.8, `notaSatisfacao` = 7.5,
  `totalAvaliacoes` = 4, `indiceResposta` = 75.00, `indiceRecomendacao` = 75.00,
  `reputacao` = 'BOM', `seloVerificada` = 0, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0050000000000000';

-- Franchise 06: Beleza Natural (9 reviews, 5 responses, 7 recommend)
-- S=(8+9+5+7+10+8+4+7+8)/9=7.3, R=(7+8+3+8+9+7+3+6+8)/9=6.6, T=(8+9+4+7+10+8+2+8+9)/9=7.2, Tr=(9+10+5+8+10+8+3+7+9)/9=7.7, M=(7+8+3+6+9+7+4+6+7)/9=6.3, Sa=(9+10+4+8+10+9+3+7+9)/9=7.7
-- NotaGeral = (7.3+6.6+7.2+7.7+6.3+7.7)/6 = 7.1
-- IndiceResposta = 5/9*100 = 55.56, IndiceRecomendacao = 7/9*100 = 77.78
UPDATE `franquias` SET
  `notaGeral` = 7.1, `notaSuporte` = 7.3, `notaRentabilidade` = 6.6, `notaTransparencia` = 7.2,
  `notaTreinamento` = 7.7, `notaMarketing` = 6.3, `notaSatisfacao` = 7.7,
  `totalAvaliacoes` = 9, `indiceResposta` = 55.56, `indiceRecomendacao` = 77.78,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0060000000000000';

-- Franchise 07: Farma Saúde (10 reviews, 6 responses, 8 recommend)
-- S=(9+8+3+7+8+10+7+5+9+8)/10=7.4, R=(8+9+4+7+8+9+6+3+8+7)/10=6.9, T=(9+8+3+8+9+10+7+4+8+8)/10=7.4, Tr=(9+8+4+8+9+10+8+5+9+8)/10=7.8, M=(8+7+2+7+8+9+6+3+7+7)/10=6.4, Sa=(10+9+3+8+9+10+8+4+9+8)/10=7.8
-- NotaGeral = (7.4+6.9+7.4+7.8+6.4+7.8)/6 = 7.3
-- IndiceResposta = 6/10*100 = 60.00, IndiceRecomendacao = 8/10*100 = 80.00
UPDATE `franquias` SET
  `notaGeral` = 7.3, `notaSuporte` = 7.4, `notaRentabilidade` = 6.9, `notaTransparencia` = 7.4,
  `notaTreinamento` = 7.8, `notaMarketing` = 6.4, `notaSatisfacao` = 7.8,
  `totalAvaliacoes` = 10, `indiceResposta` = 60.00, `indiceRecomendacao` = 80.00,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0070000000000000';

-- Franchise 08: Estética Plus (5 reviews, 3 responses, 3 recommend)
-- S=(8+3+9+4+7)/5=6.2, R=(7+2+8+3+8)/5=5.6, T=(7+3+8+4+9)/5=6.2, Tr=(8+4+9+5+8)/5=6.8, M=(6+3+7+2+7)/5=5.0, Sa=(8+2+9+4+8)/5=6.2
-- NotaGeral = (6.2+5.6+6.2+6.8+5.0+6.2)/6 = 6.0
-- IndiceResposta = 3/5*100 = 60.00, IndiceRecomendacao = 3/5*100 = 60.00
UPDATE `franquias` SET
  `notaGeral` = 6.0, `notaSuporte` = 6.2, `notaRentabilidade` = 5.6, `notaTransparencia` = 6.2,
  `notaTreinamento` = 6.8, `notaMarketing` = 5.0, `notaSatisfacao` = 6.2,
  `totalAvaliacoes` = 5, `indiceResposta` = 60.00, `indiceRecomendacao` = 60.00,
  `reputacao` = 'BOM', `seloVerificada` = 0, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0080000000000000';

-- Franchise 09: Gênio Cursos (6 reviews, 4 responses, 5 recommend)
-- S=(7+8+4+9+8+7)/6=7.2, R=(6+7+3+8+7+8)/6=6.5, T=(7+8+4+9+8+7)/6=7.2, Tr=(8+9+5+10+8+9)/6=8.2, M=(5+7+2+8+6+7)/6=5.8, Sa=(7+8+3+9+8+9)/6=7.3
-- NotaGeral = (7.2+6.5+7.2+8.2+5.8+7.3)/6 = 7.0
-- IndiceResposta = 4/6*100 = 66.67, IndiceRecomendacao = 5/6*100 = 83.33
UPDATE `franquias` SET
  `notaGeral` = 7.0, `notaSuporte` = 7.2, `notaRentabilidade` = 6.5, `notaTransparencia` = 7.2,
  `notaTreinamento` = 8.2, `notaMarketing` = 5.8, `notaSatisfacao` = 7.3,
  `totalAvaliacoes` = 6, `indiceResposta` = 66.67, `indiceRecomendacao` = 83.33,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0090000000000000';

-- Franchise 10: English Now (7 reviews, 4 responses, 5 recommend)
-- S=(8+4+7+9+5+8+7)/7=6.9, R=(7+2+6+8+3+9+7)/7=6.0, T=(8+5+7+9+3+8+7)/7=6.7, Tr=(8+4+8+10+4+9+8)/7=7.3, M=(7+3+6+8+4+7+6)/7=5.9, Sa=(9+3+8+9+4+10+8)/7=7.3
-- NotaGeral = (6.9+6.0+6.7+7.3+5.9+7.3)/6 = 6.7
-- IndiceResposta = 4/7*100 = 57.14, IndiceRecomendacao = 5/7*100 = 71.43
UPDATE `franquias` SET
  `notaGeral` = 6.7, `notaSuporte` = 6.9, `notaRentabilidade` = 6.0, `notaTransparencia` = 6.7,
  `notaTreinamento` = 7.3, `notaMarketing` = 5.9, `notaSatisfacao` = 7.3,
  `totalAvaliacoes` = 7, `indiceResposta` = 57.14, `indiceRecomendacao` = 71.43,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0100000000000000';

-- Franchise 11: Code School (3 reviews, 2 responses, 2 recommend)
-- S=(8+5+9)/3=7.3, R=(7+4+8)/3=6.3, T=(8+3+9)/3=6.7, Tr=(9+5+10)/3=8.0, M=(7+3+8)/3=6.0, Sa=(9+4+10)/3=7.7
-- NotaGeral = (7.3+6.3+6.7+8.0+6.0+7.7)/6 = 7.0
-- IndiceResposta = 2/3*100 = 66.67, IndiceRecomendacao = 2/3*100 = 66.67
UPDATE `franquias` SET
  `notaGeral` = 7.0, `notaSuporte` = 7.3, `notaRentabilidade` = 6.3, `notaTransparencia` = 6.7,
  `notaTreinamento` = 8.0, `notaMarketing` = 6.0, `notaSatisfacao` = 7.7,
  `totalAvaliacoes` = 3, `indiceResposta` = 66.67, `indiceRecomendacao` = 66.67,
  `reputacao` = 'BOM', `seloVerificada` = 0, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0110000000000000';

-- Franchise 12: Lava Fácil (5 reviews, 3 responses, 4 recommend)
-- S=(7+8+3+9+8)/5=7.0, R=(8+7+4+8+7)/5=6.8, T=(7+8+3+9+8)/5=7.0, Tr=(7+9+3+10+8)/5=7.4, M=(6+7+2+8+7)/5=6.0, Sa=(8+9+3+9+8)/5=7.4
-- NotaGeral = (7.0+6.8+7.0+7.4+6.0+7.4)/6 = 6.9
-- IndiceResposta = 3/5*100 = 60.00, IndiceRecomendacao = 4/5*100 = 80.00
UPDATE `franquias` SET
  `notaGeral` = 6.9, `notaSuporte` = 7.0, `notaRentabilidade` = 6.8, `notaTransparencia` = 7.0,
  `notaTreinamento` = 7.4, `notaMarketing` = 6.0, `notaSatisfacao` = 7.4,
  `totalAvaliacoes` = 5, `indiceResposta` = 60.00, `indiceRecomendacao` = 80.00,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0120000000000000';

-- Franchise 13: Pet Care Brasil (4 reviews, 2 responses, 3 recommend)
-- S=(9+4+8+7)/4=7.0, R=(8+3+7+8)/4=6.5, T=(8+4+9+7)/4=7.0, Tr=(9+5+8+8)/4=7.5, M=(8+2+7+6)/4=5.8, Sa=(10+3+9+8)/4=7.5
-- NotaGeral = (7.0+6.5+7.0+7.5+5.8+7.5)/6 = 6.9
-- IndiceResposta = 2/4*100 = 50.00, IndiceRecomendacao = 3/4*100 = 75.00
UPDATE `franquias` SET
  `notaGeral` = 6.9, `notaSuporte` = 7.0, `notaRentabilidade` = 6.5, `notaTransparencia` = 7.0,
  `notaTreinamento` = 7.5, `notaMarketing` = 5.8, `notaSatisfacao` = 7.5,
  `totalAvaliacoes` = 4, `indiceResposta` = 50.00, `indiceRecomendacao` = 75.00,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0130000000000000';

-- Franchise 14: Fix It (6 reviews, 4 responses, 4 recommend)
-- S=(7+3+8+5+9+8)/6=6.7, R=(6+4+7+3+8+7)/6=5.8, T=(7+2+8+4+9+8)/6=6.3, Tr=(7+3+9+5+10+8)/6=7.0, M=(5+3+7+2+7+6)/6=5.0, Sa=(7+3+8+4+9+8)/6=6.5
-- NotaGeral = (6.7+5.8+6.3+7.0+5.0+6.5)/6 = 6.2
-- IndiceResposta = 4/6*100 = 66.67, IndiceRecomendacao = 4/6*100 = 66.67
UPDATE `franquias` SET
  `notaGeral` = 6.2, `notaSuporte` = 6.7, `notaRentabilidade` = 5.8, `notaTransparencia` = 6.3,
  `notaTreinamento` = 7.0, `notaMarketing` = 5.0, `notaSatisfacao` = 6.5,
  `totalAvaliacoes` = 6, `indiceResposta` = 66.67, `indiceRecomendacao` = 66.67,
  `reputacao` = 'BOM', `seloVerificada` = 0, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0140000000000000';

-- Franchise 15: Urban Style (5 reviews, 3 responses, 4 recommend)
-- S=(8+7+4+9+8)/5=7.2, R=(9+7+3+8+7)/5=6.8, T=(8+8+5+9+8)/5=7.6, Tr=(9+8+4+10+9)/5=8.0, M=(8+7+3+8+7)/5=6.6, Sa=(10+8+3+9+9)/5=7.8
-- NotaGeral = (7.2+6.8+7.6+8.0+6.6+7.8)/6 = 7.3
-- IndiceResposta = 3/5*100 = 60.00, IndiceRecomendacao = 4/5*100 = 80.00
UPDATE `franquias` SET
  `notaGeral` = 7.3, `notaSuporte` = 7.2, `notaRentabilidade` = 6.8, `notaTransparencia` = 7.6,
  `notaTreinamento` = 8.0, `notaMarketing` = 6.6, `notaSatisfacao` = 7.8,
  `totalAvaliacoes` = 5, `indiceResposta` = 60.00, `indiceRecomendacao` = 80.00,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0150000000000000';

-- Franchise 16: Mini Fashion Kids (4 reviews, 2 responses, 3 recommend)
-- S=(7+4+8+9)/4=7.0, R=(8+3+7+8)/4=6.5, T=(7+3+9+8)/4=6.8, Tr=(8+5+9+10)/4=8.0, M=(7+4+7+8)/4=6.5, Sa=(8+3+9+10)/4=7.5
-- NotaGeral = (7.0+6.5+6.8+8.0+6.5+7.5)/6 = 7.1
-- IndiceResposta = 2/4*100 = 50.00, IndiceRecomendacao = 3/4*100 = 75.00
UPDATE `franquias` SET
  `notaGeral` = 7.1, `notaSuporte` = 7.0, `notaRentabilidade` = 6.5, `notaTransparencia` = 6.8,
  `notaTreinamento` = 8.0, `notaMarketing` = 6.5, `notaSatisfacao` = 7.5,
  `totalAvaliacoes` = 4, `indiceResposta` = 50.00, `indiceRecomendacao` = 75.00,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0160000000000000';

-- Franchise 17: Tech Solutions (5 reviews, 3 responses, 4 recommend)
-- S=(9+7+5+8+8)/5=7.4, R=(8+7+3+7+9)/5=6.8, T=(9+8+4+8+8)/5=7.4, Tr=(10+8+5+9+9)/5=8.2, M=(8+6+2+7+7)/5=6.0, Sa=(10+8+4+9+9)/5=8.0
-- NotaGeral = (7.4+6.8+7.4+8.2+6.0+8.0)/6 = 7.3
-- IndiceResposta = 3/5*100 = 60.00, IndiceRecomendacao = 4/5*100 = 80.00
UPDATE `franquias` SET
  `notaGeral` = 7.3, `notaSuporte` = 7.4, `notaRentabilidade` = 6.8, `notaTransparencia` = 7.4,
  `notaTreinamento` = 8.2, `notaMarketing` = 6.0, `notaSatisfacao` = 8.0,
  `totalAvaliacoes` = 5, `indiceResposta` = 60.00, `indiceRecomendacao` = 80.00,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0170000000000000';

-- Franchise 18: Smart Print (6 reviews, 4 responses, 4 recommend)
-- S=(7+3+8+4+9+8)/6=6.5, R=(6+2+7+3+8+7)/6=5.5, T=(7+4+8+3+9+8)/6=6.5, Tr=(8+4+9+5+10+8)/6=7.3, M=(6+3+7+4+8+7)/6=5.8, Sa=(7+2+9+3+9+8)/6=6.3
-- NotaGeral = (6.5+5.5+6.5+7.3+5.8+6.3)/6 = 6.3
-- IndiceResposta = 4/6*100 = 66.67, IndiceRecomendacao = 4/6*100 = 66.67
UPDATE `franquias` SET
  `notaGeral` = 6.3, `notaSuporte` = 6.5, `notaRentabilidade` = 5.5, `notaTransparencia` = 6.5,
  `notaTreinamento` = 7.3, `notaMarketing` = 5.8, `notaSatisfacao` = 6.3,
  `totalAvaliacoes` = 6, `indiceResposta` = 66.67, `indiceRecomendacao` = 66.67,
  `reputacao` = 'BOM', `seloVerificada` = 0, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0180000000000000';

-- Franchise 19: Gym Express (8 reviews, 5 responses, 6 recommend)
-- S=(8+9+3+7+8+5+10+7)/8=7.1, R=(7+8+2+6+8+4+9+7)/8=6.4, T=(8+9+3+7+9+4+10+8)/8=7.3, Tr=(9+10+4+8+9+5+10+8)/8=7.9, M=(7+8+2+6+7+3+9+7)/8=6.1, Sa=(9+10+3+7+9+4+10+8)/8=7.5
-- NotaGeral = (7.1+6.4+7.3+7.9+6.1+7.5)/6 = 7.1
-- IndiceResposta = 5/8*100 = 62.50, IndiceRecomendacao = 6/8*100 = 75.00
UPDATE `franquias` SET
  `notaGeral` = 7.1, `notaSuporte` = 7.1, `notaRentabilidade` = 6.4, `notaTransparencia` = 7.3,
  `notaTreinamento` = 7.9, `notaMarketing` = 6.1, `notaSatisfacao` = 7.5,
  `totalAvaliacoes` = 8, `indiceResposta` = 62.50, `indiceRecomendacao` = 75.00,
  `reputacao` = 'BOM', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0190000000000000';

-- Franchise 20: Clean House (3 reviews, 2 responses, 3 recommend)
-- S=(8+9+7)/3=8.0, R=(7+8+7)/3=7.3, T=(8+9+7)/3=8.0, Tr=(9+10+8)/3=9.0, M=(7+8+6)/3=7.0, Sa=(9+10+8)/3=9.0
-- NotaGeral = (8.0+7.3+8.0+9.0+7.0+9.0)/6 = 8.1
-- IndiceResposta = 2/3*100 = 66.67, IndiceRecomendacao = 3/3*100 = 100.00
UPDATE `franquias` SET
  `notaGeral` = 8.1, `notaSuporte` = 8.0, `notaRentabilidade` = 7.3, `notaTransparencia` = 8.0,
  `notaTreinamento` = 9.0, `notaMarketing` = 7.0, `notaSatisfacao` = 9.0,
  `totalAvaliacoes` = 3, `indiceResposta` = 66.67, `indiceRecomendacao` = 100.00,
  `reputacao` = 'OTIMO', `seloVerificada` = 1, `seloFA1000` = 0,
  `updatedAt` = '2024-06-01 00:00:00.000'
WHERE `id` = 'cm5fran0200000000000000';

-- ============================================================
-- RE-ENABLE FOREIGN KEY CHECKS
-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SUMMARY
-- ============================================================
-- 1 admin user (admin@franquiaavalia.com.br / senha123)
-- 30 franchisee users (franqueado1@email.com ... franqueado30@email.com / senha123)
-- 30 franqueado records
-- 20 franchises across 8 segments
-- 110 reviews total (83 positive, 27 negative = ~75%/25%)
-- 68 company responses (~62% response rate)
-- All franchise scores calculated from actual review data
-- ============================================================
