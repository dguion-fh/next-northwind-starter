-- ============================================================================
-- Performance Optimization: Add Database Indexes
-- ============================================================================
-- These indexes significantly improve dashboard query performance by:
-- 1. Speeding up ORDER BY queries on orders table
-- 2. Accelerating JOIN operations on foreign keys
-- 3. Improving WHERE clause filtering on dates
--
-- Run this migration with: sqlite3 northwind.db < db/migrations/add_performance_indexes.sql
-- ============================================================================

-- Index for getRecentOrders() - ORDER BY orderDate DESC
-- Improves sorting performance for recent orders query
CREATE INDEX IF NOT EXISTS idx_orders_date ON Orders(OrderDate DESC);

-- Index for foreign key joins in getRevenueByCategory()
-- Speeds up JOIN between OrderDetails and Products
CREATE INDEX IF NOT EXISTS idx_orderdetails_productid ON OrderDetails(ProductID);

-- Index for foreign key joins in getRevenueByCategory()
-- Speeds up JOIN between Products and Categories
CREATE INDEX IF NOT EXISTS idx_products_categoryid ON Products(CategoryID);

-- Index for foreign key joins in getRevenueByCategory()
-- Speeds up JOIN between OrderDetails and Orders
CREATE INDEX IF NOT EXISTS idx_orderdetails_orderid ON OrderDetails(OrderID);

-- Index for WHERE clause filtering on order dates
-- Improves performance of date-based filtering in revenue queries
CREATE INDEX IF NOT EXISTS idx_orders_date_filter ON Orders(OrderDate);

-- Verify indexes were created
SELECT
    name AS index_name,
    tbl_name AS table_name
FROM sqlite_master
WHERE type = 'index'
    AND name LIKE 'idx_%'
ORDER BY tbl_name, name;
