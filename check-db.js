const mysql = require('mysql2/promise');

async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '1234',
      database: 'toy_ecommerce'
    });

    console.log('✅ Database connected successfully!');

    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📊 Tables in database:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    // Check data
    const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    console.log(`\n📁 Categories: ${categories[0].count}`);

    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log(`📦 Products: ${products[0].count}`);

    const [adminUsers] = await connection.execute('SELECT COUNT(*) as count FROM admin_users');
    console.log(`👑 Admin users: ${adminUsers[0].count}`);

    // Show sample products
    const [sampleProducts] = await connection.execute('SELECT name, price, category_id FROM products LIMIT 3');
    console.log('\n🎮 Sample products:');
    sampleProducts.forEach(product => {
      console.log(`  - ${product.name}: $${product.price}`);
    });

    await connection.end();
    console.log('\n✅ Database check completed!');
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

checkDatabase();