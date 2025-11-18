
-- CREATE DATABASE finance_db;
USE finance_db;

-- 1. Companies Table

DROP TABLE IF EXISTS companies;
CREATE TABLE companies (
  company_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  sector VARCHAR(100),
  headquarters VARCHAR(100)
);

-- Insert Companies
INSERT INTO companies (name, sector, headquarters) VALUES
('Tata Motors', 'Automobile', 'Mumbai'),
('Infosys', 'IT Services', 'Bangalore'),
('Wipro', 'IT Services', 'Bangalore'),
('Bajaj Finance', 'Financial Services', 'Pune'),
('Reliance', 'Conglomerate', 'Mumbai'),
('Mahindra', 'Automobile', 'Mumbai');

-- 2. Stocks Table (linked to companies)

DROP TABLE IF EXISTS stocks;
CREATE TABLE stocks (
  stock_id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT,
  date DATE,
  open_price FLOAT,
  close_price FLOAT,
  volume BIGINT,
  FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Tata Motors (company_id = 1)
INSERT INTO stocks (company_id, date, open_price, close_price, volume) VALUES
(1, '2025-09-20', 840.0, 845.5, 1200000),
(1, '2025-09-21', 846.0, 850.2, 1185000),
(1, '2025-09-22', 852.5, 860.1, 1250000),
(1, '2025-09-23', 858.0, 855.0, 1100000),
(1, '2025-09-24', 860.0, 870.4, 1320000),
(1, '2025-09-25', 875.0, 880.7, 1400000);

-- Infosys (company_id = 2)
INSERT INTO stocks (company_id, date, open_price, close_price, volume) VALUES
(2, '2025-09-20', 1545.0, 1550.2, 950000),
(2, '2025-09-21', 1552.0, 1565.5, 980000),
(2, '2025-09-22', 1560.0, 1578.3, 1000000),
(2, '2025-09-23', 1570.0, 1568.0, 940000),
(2, '2025-09-24', 1575.0, 1582.9, 990000),
(2, '2025-09-25', 1588.0, 1590.0, 1020000);

-- Wipro (company_id = 3)
INSERT INTO stocks (company_id, date, open_price, close_price, volume) VALUES
(3, '2025-09-20', 418.0, 420.3, 600000),
(3, '2025-09-21', 421.0, 422.7, 620000),
(3, '2025-09-22', 425.0, 430.1, 640000),
(3, '2025-09-23', 429.0, 428.4, 580000),
(3, '2025-09-24', 431.0, 432.9, 610000),
(3, '2025-09-25', 433.0, 435.2, 650000);

-- Reliance (company_id = 4)
INSERT INTO stocks (company_id, date, open_price, close_price, volume) VALUES
(4, '2025-09-20', 2445.0, 2450.2, 1600000),
(4, '2025-09-21', 2455.0, 2462.8, 1620000),
(4, '2025-09-22', 2468.0, 2475.4, 1580000),
(4, '2025-09-23', 2470.0, 2468.7, 1550000),
(4, '2025-09-24', 2482.0, 2488.9, 1650000),
(4, '2025-09-25', 2495.0, 2500.0, 1700000);

-- Mahindra (company_id = 5)
INSERT INTO stocks (company_id, date, open_price, close_price, volume) VALUES
(5, '2025-09-20', 1620.0, 1632.5, 500000),
(5, '2025-09-21', 1630.0, 1640.8, 510000),
(5, '2025-09-22', 1645.0, 1652.2, 530000),
(5, '2025-09-23', 1650.0, 1648.5, 480000),
(5, '2025-09-24', 1655.0, 1660.0, 550000),
(5, '2025-09-25', 1665.0, 1675.3, 570000);

-- 3. Users Table

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  city VARCHAR(100)
);

-- Insert Users
INSERT INTO users (name, email, city) VALUES
('Amit Sharma', 'amit@example.com', 'Pune'),
('Priya Mehta', 'priya@example.com', 'Mumbai'),
('Rahul Singh', 'rahul@example.com', 'Delhi');

-------------------------------------------------
-- 4. Transactions Table
-------------------------------------------------
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
  txn_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  company_id INT,
  txn_date DATE,
  shares INT,
  buy_price FLOAT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Sample Transactions
INSERT INTO transactions (user_id, company_id, txn_date, shares, buy_price) VALUES
(1, 1, '2025-09-21', 50, 850.0),    -- Amit bought Tata Motors
(1, 4, '2025-09-22', 10, 7250.0),   -- Amit bought Bajaj Finance
(2, 2, '2025-09-20', 20, 1550.0),   -- Priya bought Infosys
(2, 5, '2025-09-23', 15, 2470.0),   -- Priya bought Reliance
(3, 3, '2025-09-25', 100, 435.0),   -- Rahul bought Wipro
(3, 6, '2025-09-24', 30, 1660.0);   -- Rahul bought Mahindra
