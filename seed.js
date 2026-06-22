import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('db.json');
const dataPath = path.resolve('data/data.json');

try {
  console.log('Seeding check: Initializing db.json...');
  
  let dataSource = { users: [], products: [] };
  if (fs.existsSync(dataPath)) {
    const dataRaw = fs.readFileSync(dataPath, 'utf8');
    dataSource = JSON.parse(dataRaw);
  } else {
    console.warn(`Source data file not found at ${dataPath}`);
  }

  let dbData = {
    users: [],
    products: [],
    carts: [],
    orders: [],
    loginHistory: []
  };

  if (fs.existsSync(dbPath)) {
    try {
      const dbRaw = fs.readFileSync(dbPath, 'utf8');
      dbData = JSON.parse(dbRaw);
    } catch (e) {
      console.error('Failed to parse db.json, starting fresh.', e);
    }
  }

  // Preserve existing users, orders, and loginHistory or fall back to defaults
  dbData.users = dbData.users && dbData.users.length > 0 ? dbData.users : (dataSource.users || []);
  
  // Always override products with source data to guarantee they exist and are correct
  dbData.products = dataSource.products || [];
  
  // Ensure carts list exists and is plural
  dbData.carts = dbData.carts || dbData.cart || [];
  if ('cart' in dbData) {
    delete dbData.cart;
  }

  dbData.orders = dbData.orders || [];
  dbData.loginHistory = dbData.loginHistory || [];

  // Write formatting
  fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
  console.log('db.json successfully seeded with products and schemas verified!');
} catch (error) {
  console.error('Seeding process failed:', error);
}
