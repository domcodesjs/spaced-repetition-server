const db = require('../../knex/knex');

const LanguageService = {
  async getUsersLanguage(user_id) {
    return await db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },
  async getLanguageWords(language_id) {
    return await db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },
  async getHeadWord(headId) {
    return await db('word').select('*').where('id', headId);
  },
  async updateLanguage(user_id, newLanguageFields) {
    return await db('language').where({ user_id }).update(newLanguageFields);
  },
  async updateWord(word_id, newWordFields) {
    return await db('word').where('id', word_id).update(newWordFields);
  }
};

module.exports = LanguageService;
