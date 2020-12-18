const express = require('express');
const router = express.Router();
const bodyParser = express.json();
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const LinkedList = require('./LinkedList');

router.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(req.user.id);

    if (!language) {
      return res.status(404).json({
        error: `You don't have any languages`
      });
    }

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
  try {
    const head = await LanguageService.getHeadWord(req.language.id);

    res.json({
      nextWord: head[0].original,
      totalScore: req.language.total_score,
      wordCorrectCount: head[0].correct_count,
      wordIncorrectCount: head[0].incorrect_count
    });
    next();
  } catch (error) {
    next(error);
  }
});

router.post('/guess', bodyParser, async (req, res, next) => {
  try {
    const { guess } = req.body;
    const list = new LinkedList();

    if (!guess) {
      return res.status(400).json({
        error: `Missing 'guess' in request body`
      });
    }

    let headWord = await LanguageService.getHeadWord(req.language.head);
    let words = await LanguageService.getLanguageWords(req.language.id);
    list.insertFirst(headWord[0]);

    while (headWord[0].next !== null) {
      let currNode = words.find((word) => word.id === headWord[0].next);
      list.insertLast(currNode);
      headWord = [currNode];
    }

    let isCorrect;
    if (guess !== list.head.value.translation) {
      isCorrect = false;
      list.head.value.memory_value = 1;
      list.head.value.incorrect_count++;
    } else {
      isCorrect = true;
      list.head.value.memory_value *= 2;
      list.head.value.correct_count++;
      req.language.total_score++;
    }

    const removedHead = list.head.value;

    list.remove(list.head.value);
    list.insertAt(list, removedHead, removedHead.memory_value);

    let tempNode = list.head;
    let head = tempNode.value.id;

    while (tempNode !== null) {
      await LanguageService.updateWord(tempNode.value.id, {
        memory_value: tempNode.value.memory_value,
        correct_count: tempNode.value.correct_count,
        incorrect_count: tempNode.value.incorrect_count,
        next: tempNode.next !== null ? tempNode.next.value.id : null
      });
      tempNode = tempNode.next;
    }

    await LanguageService.updateLanguage(req.user.id, {
      total_score: req.language.total_score,
      head
    });

    return res.status(200).json({
      nextWord: list.head.value.original,
      wordCorrectCount: list.head.value.correct_count,
      wordIncorrectCount: list.head.value.incorrect_count,
      totalScore: req.language.total_score,
      answer: removedHead.translation,
      isCorrect
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
