const express = require('express');
const path = require('path');
const UserService = require('./user-service');

const userRouter = express.Router();
const jsonBodyParser = express.json();

userRouter.post('/', jsonBodyParser, async (req, res, next) => {
  const { password, username, name } = req.body;

  for (const field of ['name', 'username', 'password'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  try {
    const passwordError = UserService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    const hasUserWithUserName = await UserService.hasUserWithUserName(username);

    if (hasUserWithUserName)
      return res.status(400).json({ error: `Username already taken` });

    const hashedPassword = await UserService.hashPassword(password);

    const newUser = {
      username,
      password: hashedPassword,
      name
    };

    const user = await UserService.insertUser(newUser);

    await UserService.populateUserWords(user.id);

    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${user.id}`))
      .json(UserService.serializeUser(user));
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
