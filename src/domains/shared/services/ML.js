const knex = require('../../../dataStores/knex');

async function getAllProductsAndUsers() {
  try {
    const queryString = `SELECT users.id as userId, products.id as itemId,
    (SELECT AVG(rating) FROM reviews WHERE reviews.product_id = itemId) as rating,
    (SELECT COUNT(product_id) FROM user_product_views WHERE user_product_views.product_id = itemId AND user_product_views.user_id = userId) as views,
    CASE 
      WHEN EXISTS 
        (SELECT 1 FROM favourite_product WHERE user_id = userId and product_id = itemId) 
        THEN 1 ELSE 0
    END AS is_favourite
    FROM users, products ORDER BY userId ASC, itemId ASC;`;
    const data = await knex.raw(queryString);

    // console.log(data[0]);

    return data[0];
  } catch (error) {
    throw error;
  }
}

function caluculateProductRank(rate, fav, viewCount) {
  let rank = 0;

  rank += rate * 10;

  if (fav) rank += 50;

  rank += viewCount;

  return rank > 100 ? 100 : rank;
}

async function getDataSet() {
  try {
    const dataSet = await getAllProductsAndUsers();
    dataSet.map(record => {
      record.lable = caluculateProductRank(
        record.rating,
        record.is_favourite,
        record.views
      );
      delete record.rating;
      delete record.is_favourite;
      delete record.views;
    });

    console.log(dataSet[0]);

    return dataSet;
  } catch (error) {
    throw error;
  }
}

module.exports = getDataSet;
