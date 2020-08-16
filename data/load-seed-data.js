/* eslint-disable no-console */
const client = require('../lib/client');
// import our seed data:
const mealsData = require('./meals.js');
const foods = require('./foods.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      mealsData.map(meal => {
        return client.query(`
                      INSERT INTO meals (meal)
                      VALUES ($1);
                    `,
        [meal.meal]);
      })
    );

    await Promise.all(
      foods.map(food => {
        return client.query(`
                    INSERT INTO foods (name, deliciousness, can_be_vegetarian, img, owner_id, meal_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [food.name, food.deliciousness, food.can_be_vegetarian, food.img, user.id, food.meal_id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
