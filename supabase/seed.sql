-- ============================================================
--  BCB Multielectro - Datos de prueba
--  Ejecutar en Supabase SQL Editor DESPUÉS del schema.sql
-- ============================================================

-- Insertar productos de prueba
INSERT INTO products (name, description, price, brand, condition, category_id, is_available, is_featured)
VALUES

-- Refrigeración
(
  'Heladera No Frost Samsung 370L',
  'Heladera con freezer superior, sistema No Frost total para evitar la formación de hielo. Capacidad total 370 litros (freezer 100L + refrigerador 270L). Tecnología Multi Flow de circulación de aire frío uniforme. Incluye bandeja de vidrio templado, cajón para verduras con humedad controlada y luz LED interior. Color inox.',
  389000,
  'Samsung',
  'nuevo',
  (SELECT id FROM categories WHERE slug = 'refrigeracion'),
  TRUE, TRUE
),
(
  'Heladera Bambi con Freezer 310L',
  'Heladera familiar de 2 puertas con freezer superior. Capacidad 310 litros. Sistema de enfriamiento estático, bandeja de vidrio y cajón para vegetales. Ideal para cocinas medianas. Color blanco. Clase energética A.',
  195000,
  'Bambi',
  'nuevo',
  (SELECT id FROM categories WHERE slug = 'refrigeracion'),
  TRUE, FALSE
),
(
  'Freezer Horizontal Friat 260L',
  'Freezer horizontal de 260 litros con cierre automático y canasta interna removible. Temperatura de trabajo hasta -18°C. Consumo eficiente. Ideal para almacenar grandes cantidades de alimentos. Color blanco.',
  230000,
  'Friat',
  'usado',
  (SELECT id FROM categories WHERE slug = 'refrigeracion'),
  TRUE, FALSE
),

-- Lavado
(
  'Lavarropas Automático Drean Next 9 kg',
  'Lavarropas carga frontal de 9 kg con 1000 RPM de centrifugado. 16 programas de lavado incluyendo algodón, sintéticos, delicados y rápido. Panel digital con pantalla LED. Función eco-ahorro y retardo de inicio. Puerta con vidrio templado. Clase energética A++.',
  420000,
  'Drean',
  'nuevo',
  (SELECT id FROM categories WHERE slug = 'lavado'),
  TRUE, TRUE
),
(
  'Lavarropas Semi Automático Drean 7 kg',
  'Lavarropas semi automático de 7 kg con doble tina. Centrifugado separado de 4.5 kg. Timer mecánico. Ideal para familias que buscan practicidad y bajo consumo. Manguera de desagüe incluida. Color blanco.',
  145000,
  'Drean',
  'usado',
  (SELECT id FROM categories WHERE slug = 'lavado'),
  TRUE, FALSE
),

-- Cocina
(
  'Cocina Longvie 4 Hornallas con Horno',
  'Cocina a gas de 4 hornallas con horno y gratinador. Encendido automático en todas las hornallas. Parrilla de hierro fundido. Horno con ventana de vidrio y luz interior. Termostato regulable. Puerta con doble vidrio para mayor seguridad. Color acero inoxidable.',
  280000,
  'Longvie',
  'nuevo',
  (SELECT id FROM categories WHERE slug = 'cocina'),
  TRUE, TRUE
),
(
  'Microondas Whirlpool 30L Digital',
  'Microondas con grill de 30 litros de capacidad. Panel digital táctil con 8 programas automáticos. Potencia 900W. Incluye función grill para dorar y gratinar. Plato giratorio de vidrio de 31.5 cm. Temporizador y reloj. Color negro.',
  98000,
  'Whirlpool',
  'nuevo',
  (SELECT id FROM categories WHERE slug = 'cocina'),
  TRUE, FALSE
),

-- Climatización
(
  'Aire Acondicionado Split Inverter BGH 3000 Frig',
  'Aire acondicionado split frío/calor con tecnología Inverter para máxima eficiencia energética. 3000 frigorías de frío y 3200 de calor. Control remoto inalámbrico. Función turbo, sleep y auto restart. Filtro antibacterial. Clase energética A+++. Instalación en hasta 3 metros lineales incluida.',
  580000,
  'BGH',
  'nuevo',
  (SELECT id FROM categories WHERE slug = 'climatizacion'),
  TRUE, TRUE
),
(
  'Estufa a Gas Emege 4 Cuerpos',
  'Estufa a gas natural o envasado de 4 cuerpos con termostato. Encendido piezoeléctrico. Pantalla de acero inoxidable. Ideal para habitaciones de hasta 40m². Incluye regulador y manguera. Color cromado/negro.',
  75000,
  'Emege',
  'usado',
  (SELECT id FROM categories WHERE slug = 'climatizacion'),
  FALSE, FALSE
),

-- Televisión
(
  'Smart TV LG 55" 4K UHD',
  'Televisor Smart TV 55 pulgadas con resolución 4K Ultra HD. Sistema operativo webOS con acceso a Netflix, YouTube, Disney+ y más. HDR10 Pro y Dolby Vision. Procesador α5 de 4ª generación. 3 entradas HDMI, 2 USB. Sonido 2.0 de 20W con Dolby Atmos. Soporte de pared incluido.',
  750000,
  'LG',
  'nuevo',
  (SELECT id FROM categories WHERE slug = 'television'),
  TRUE, TRUE
);

-- ─────────────────────────────────────────
-- Insertar imágenes de prueba (usando picsum.photos con seeds fijas)
-- ─────────────────────────────────────────

-- Heladera Samsung
INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/fridge1/600/600', TRUE, 0
FROM products WHERE name = 'Heladera No Frost Samsung 370L';

INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/fridge2/600/600', FALSE, 1
FROM products WHERE name = 'Heladera No Frost Samsung 370L';

INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/fridge3/600/600', FALSE, 2
FROM products WHERE name = 'Heladera No Frost Samsung 370L';

-- Heladera Bambi
INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/bambi1/600/600', TRUE, 0
FROM products WHERE name = 'Heladera Bambi con Freezer 310L';

-- Freezer Friat
INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/freezer1/600/600', TRUE, 0
FROM products WHERE name = 'Freezer Horizontal Friat 260L';

INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/freezer2/600/600', FALSE, 1
FROM products WHERE name = 'Freezer Horizontal Friat 260L';

-- Lavarropas Drean Automático
INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/washer1/600/600', TRUE, 0
FROM products WHERE name = 'Lavarropas Automático Drean Next 9 kg';

INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/washer2/600/600', FALSE, 1
FROM products WHERE name = 'Lavarropas Automático Drean Next 9 kg';

-- Lavarropas Semi
INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/washer3/600/600', TRUE, 0
FROM products WHERE name = 'Lavarropas Semi Automático Drean 7 kg';

-- Cocina Longvie
INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/stove1/600/600', TRUE, 0
FROM products WHERE name = 'Cocina Longvie 4 Hornallas con Horno';

INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/stove2/600/600', FALSE, 1
FROM products WHERE name = 'Cocina Longvie 4 Hornallas con Horno';

-- Microondas
INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/micro1/600/600', TRUE, 0
FROM products WHERE name = 'Microondas Whirlpool 30L Digital';

-- Aire Acondicionado
INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/ac1/600/600', TRUE, 0
FROM products WHERE name = 'Aire Acondicionado Split Inverter BGH 3000 Frig';

INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/ac2/600/600', FALSE, 1
FROM products WHERE name = 'Aire Acondicionado Split Inverter BGH 3000 Frig';

INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/ac3/600/600', FALSE, 2
FROM products WHERE name = 'Aire Acondicionado Split Inverter BGH 3000 Frig';

-- Estufa
INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/heater1/600/600', TRUE, 0
FROM products WHERE name = 'Estufa a Gas Emege 4 Cuerpos';

-- Smart TV
INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/tv1/600/600', TRUE, 0
FROM products WHERE name = 'Smart TV LG 55" 4K UHD';

INSERT INTO product_images (product_id, url, is_cover, "order")
SELECT id, 'https://picsum.photos/seed/tv2/600/600', FALSE, 1
FROM products WHERE name = 'Smart TV LG 55" 4K UHD';
