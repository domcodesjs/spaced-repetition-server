require('dotenv').config();
const knex = require('knex');
const { DB_URL } = require('./src/config');

const db = knex({
  client: 'pg',
  connection: DB_URL
});

const seedDatabase = async () => {
  try {
    await db.raw(`TRUNCATE "word", "language", "user";`);
    await db('user').insert([
      {
        id: 1,
        username: 'admin',
        name: 'Dunder Mifflin Admin',
        password: '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
      }
    ]);
    await db('language').insert([
      {
        id: 1,
        name: 'French',
        user_id: 1
      }
    ]);
    await db('word').insert([
      {
        id: 1,
        language_id: 1,
        original: 'entraine toi',
        translation: 'practice',
        next: 2
      },
      {
        id: 2,
        language_id: 1,
        original: 'bonjour',
        translation: 'hello',
        next: 3
      },
      {
        id: 3,
        language_id: 1,
        original: 'maison',
        translation: 'house',
        next: 4
      },
      {
        id: 4,
        language_id: 1,
        original: 'développeur',
        translation: 'developer',
        next: 5
      },
      {
        id: 5,
        language_id: 1,
        original: 'traduire',
        translation: 'translate',
        next: 6
      },
      {
        id: 6,
        language_id: 1,
        original: 'incroyable',
        translation: 'amazing',
        next: 7
      },
      {
        id: 7,
        language_id: 1,
        original: 'chien',
        translation: 'dog',
        next: 8
      },
      {
        id: 8,
        language_id: 1,
        original: 'chat',
        translation: 'cat',
        next: null
      }
    ]);
    await db.raw(`UPDATE "language" SET head = 1 WHERE id = 1;`);
    await db.raw(`SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));`);
    await db.raw(
      `SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));`
    );
    await db.raw(`SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));`);
    console.log('Seeded the database successfully');
    return process.exit();
  } catch (err) {
    console.log(err);
    return process.exit();
  }
};

seedDatabase();
