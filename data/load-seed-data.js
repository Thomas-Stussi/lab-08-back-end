/* eslint-disable no-console */
const client = require('../lib/client');
// import our seed data:
const foods = require('./foods.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      foods.map(food => {
        return client.query(`
                    INSERT INTO foods (name, deliciousness, can_be_vegetarian, meal)
                    VALUES ($1, $2, $3, $4);
                `,
        [food.name, food.deliciousness, food.can_be_vegetarian, food.meal]);
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
