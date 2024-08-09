/* eslint-disable @typescript-eslint/no-var-requires */
const bcrypt = require('bcryptjs');

const password = 'Password123&'; // Ваш пароль
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Hashed password:', hash);
});
