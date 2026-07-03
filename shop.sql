USE shop;

-- 1. Categorii de produse
CREATE TABLE categories (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- 2. Produse
CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)   NOT NULL,
  description TEXT,
  price       DECIMAL(10,2)  NOT NULL,
  image_url   VARCHAR(500),
  stock       INT            NOT NULL DEFAULT 0,
  category_id INT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 3. Utilizatori
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,   -- stocat ca hash
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Comenzi
CREATE TABLE orders (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT,               -- poate fi NULL (comandă ca oaspete)
  customer_name    VARCHAR(255)  NOT NULL,
  customer_address TEXT          NOT NULL,
  customer_phone   VARCHAR(50),
  total            DECIMAL(10,2) NOT NULL,
  status           VARCHAR(50)   NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5. Produsele din fiecare comandă
CREATE TABLE order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   INT           NOT NULL,
  product_id INT           NOT NULL,
  quantity   INT           NOT NULL,
  price      DECIMAL(10,2) NOT NULL,  -- prețul la momentul comenzii
  FOREIGN KEY (order_id)   REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

SHOW TABLES;

INSERT INTO categories (name) VALUES
  ('Electronice'), ('Îmbrăcăminte'), ('Accesorii');

INSERT INTO products (name, description, price, image_url, stock, category_id)
VALUES
  ('Căști wireless', 'Căști Bluetooth cu microfon', 199.99,
     'https://picsum.photos/id/1/400', 25, 1),
  ('Tricou bumbac', 'Tricou unisex, 100% bumbac', 79.50,
     'https://picsum.photos/id/2/400', 40, 2),
  ('Rucsac urban', 'Rucsac 20L rezistent la apă', 149.00,
     'https://picsum.photos/id/3/400', 15, 3);

SELECT * FROM categories
SELECT * FROM products