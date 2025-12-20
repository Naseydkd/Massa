-- Script pour ajouter des produits de démonstration

USE resto_donuts;

INSERT INTO products (name, category, description, price, available) VALUES
-- Classiques
('Donut Sucre', 'classique', 'Donut simple saupoudré de sucre blanc', 1.50, 1),
('Donut Chocolat', 'classique', 'Donut nature avec glaçage chocolat noir', 2.00, 1),
('Donut Rose', 'classique', 'Donut avec glaçage rose sucré', 1.50, 1),
('Donut Vanille', 'classique', 'Donut fourré à la vanille', 2.50, 1),

-- Gourmands
('Donut Nutella', 'gourmand', 'Donut fourré aux noisettes Nutella', 3.50, 1),
('Donut Caramel Beurre Salé', 'gourmand', 'Donut avec caramel et fleur de sel', 3.00, 1),
('Donut Fraise Chantilly', 'gourmand', 'Donut garni de fraise fraîche et chantilly', 3.50, 1),
('Donut Cookies & Cream', 'gourmand', 'Donut avec morceaux de cookies et crème', 3.00, 1),

-- Sains
('Donut Complet', 'sain', 'Donut aux céréales complètes', 2.50, 1),
('Donut sans Sucre', 'sain', 'Donut sucré avec édulcorant naturel', 2.50, 1),
('Donut Fruits Rouges', 'sain', 'Donut fourré aux fruits rouges', 2.75, 1),
('Donut Amande Miel', 'sain', 'Donut à base de farine d\'amande', 3.00, 1),

-- Spéciaux
('Donut Café', 'special', 'Donut au parfum café intense', 2.50, 1),
('Donut Pistache', 'special', 'Donut fourré à la pistache', 3.50, 1),
('Donut Matcha', 'special', 'Donut au thé matcha japonais', 3.50, 1),
('Donut Lavande Miel', 'special', 'Donut parfumé à la lavande avec miel', 3.00, 1);
