const { sequelize } = require('../../config/db');

async function getUserby(selectors) {
  const s = '';
  selectors.keys.forEach(k => {
    s += `${k}= ? `;
  });

  console.log(s);

  const selectUserQuery = `SELECT token, token_expire FROM users WHERE ${s};`;
  const user = await sequelize.query(selectUserQuery, {
    replacements: selectors.values(),
    type: sequelize.QueryTypes.SELECT,
  });

  console.log(user);
}

getUserby({
  email: 'fastmemoapp@gmail.com',
  token: 'a7a03a940cd9c8468bb71fe958558266',
}).then();
