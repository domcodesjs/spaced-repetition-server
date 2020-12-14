const { DATABASE_URL, TEST_DB_URL, LOCAL_DB_URL } = require('./src/config');

module.exports = {
  development: {
    client: 'pg',
    connection: LOCAL_DB_URL
  },
  production: {
    client: 'pg',
    connection: DATABASE_URL
  },
  test: {
    client: 'pg',
    connection: TEST_DB_URL
  }
};
