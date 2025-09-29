const mysql = require('mysql2/promise');

async function updateProductImages() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '1234',
      database: 'toy_ecommerce'
    });

    console.log('✅ Connected to database');

    // Update product images based on category
    const updates = [
      // Sports Cars
      {
        query: `UPDATE products SET image_url = '/images/products/sports-car-placeholder.svg' 
                WHERE category_id = 1`,
        description: 'Sports Cars'
      },
      // Helicopters
      {
        query: `UPDATE products SET image_url = '/images/products/helicopter-placeholder.svg' 
                WHERE category_id = 2`,
        description: 'Helicopters'
      },
      // Fighter Jets
      {
        query: `UPDATE products SET image_url = '/images/products/fighter-jet-placeholder.svg' 
                WHERE category_id = 3`,
        description: 'Fighter Jets'
      },
      // Speed Boats
      {
        query: `UPDATE products SET image_url = '/images/products/speed-boat-placeholder.svg' 
                WHERE category_id = 4`,
        description: 'Speed Boats'
      }
    ];

    for (const update of updates) {
      const [result] = await connection.execute(update.query);
      console.log(`✅ Updated ${result.affectedRows} products in ${update.description} category`);
    }

    // Verify the updates
    const [products] = await connection.execute(`
      SELECT p.name, p.image_url, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY c.name, p.name
    `);

    console.log('\n📦 Updated product images:');
    products.forEach(product => {
      console.log(`  - ${product.category_name}: ${product.name}`);
      console.log(`    Image: ${product.image_url}`);
    });

    await connection.end();
    console.log('\n✅ Database update completed!');
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

updateProductImages();