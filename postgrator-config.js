const { NODE_ENV } = require('./src/config');

require('dotenv').config();

module.exports = {
  migrationDirectory: 'migrations',
  driver: 'pg',
  connectionString:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DB_URL
      : process.env.LOCAL_DB_URL
};
