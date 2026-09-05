#!/usr/bin/env node

const pg = require('pg');

const connectionString = process.env.DATABASE_URL;

console.log('🔍 Testing Neon Database Connection...\n');

const pool = new pg.Pool({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 10000,
});

async function testConnection() {
  let client;
  try {
    console.log('⏳ Attempting to connect...');
    const start = Date.now();
    
    client = await pool.connect();
    const duration = Date.now() - start;
    
    console.log(`✅ Connected successfully in ${duration}ms\n`);
    
    // Test a simple query
    console.log('⏳ Testing query...');
    const queryStart = Date.now();
    const result = await client.query('SELECT NOW()');
    const queryDuration = Date.now() - queryStart;
    
    console.log(`✅ Query executed in ${queryDuration}ms`);
    console.log(`   Server time: ${result.rows[0].now}\n`);
    
    // Check if tables exist
    console.log('⏳ Checking database schema...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('⚠️  No tables found. Run: pnpm prisma db push');
    } else {
      console.log(`✅ Found ${tablesResult.rows.length} tables:`);
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    // Check for stores
    const storeCheck = await client.query('SELECT COUNT(*) FROM "Store"');
    const storeCount = parseInt(storeCheck.rows[0].count);
    
    console.log(`\n📊 Database Status:`);
    console.log(`   Stores: ${storeCount}`);
    
    if (storeCount === 0) {
      console.log('\n⚠️  No stores found!');
      console.log('   Visit http://localhost:3000 to create your first store');
    }
    
    console.log('\n✅ Database connection test passed!\n');
    
  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error(`   ${error.message}\n`);
    
    if (error.code === 'ETIMEDOUT') {
      console.log('💡 Suggestions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify DATABASE_URL in .env file');
      console.log('   3. Check if Neon database is active');
      console.log('   4. Try restarting the database in Neon console');
    }
    
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

testConnection();
