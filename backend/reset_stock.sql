-- Seed Data Script for Chez Hadjo
-- Reset products with proper stock values

USE resto_donuts;

-- Update all products stock to initial values (simple approach)
UPDATE products SET stock = 50 WHERE id IN (1, 2, 3, 4);
UPDATE products SET stock = 45 WHERE id IN (5, 6, 7, 8);
UPDATE products SET stock = 40 WHERE id IN (9, 10, 11, 12);
UPDATE products SET stock = 30 WHERE id IN (13, 14, 15, 16);
UPDATE products SET stock = 25 WHERE id = 17;
UPDATE products SET stock = 20 WHERE id = 18;

-- Verify all products have stock
SELECT id, name, category, price, stock FROM products ORDER BY id;

-- Show summary
SELECT 
    category,
    COUNT(*) as total,
    SUM(stock) as total_stock
FROM products
GROUP BY category;
