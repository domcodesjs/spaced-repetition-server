const express = require('express');
const router = express.Router();
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

router.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(req.user.id);

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(req.language.id);

    res.json({
      language: req.language,
      words
    });
    next();
  } catch (error) {
    next(error);
  }
});

router.get('/head', async (req, res, next) => {
  // implement me
  res.send('implement me!');
});

router.post('/guess', async (req, res, next) => {
  // implement me
  res.send('implement me!');
});

module.exports = router;
