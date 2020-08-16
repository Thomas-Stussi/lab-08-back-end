const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

const fakeUser = {
  id: 1,
  email: 'jon@arbuckle.net',
  hash: '42r8c24',
};

//join
app.get('/foods', async(req, res) => {
  try {
    const data = await client.query(`
      SELECT foods.id, name, deliciousness, can_be_vegetarian, img, meals.meal AS meal_name
          FROM foods 
          JOIN meals
          ON foods.meal_id=meals.id
      `);
  
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
  
});

// read meals
app.get('/meals', async(req, res) => {
  const data = await client.query(`
      SELECT * FROM meals`);
  
  res.json(data.rows);
});


//delete
app.delete('/foods/:id', async(req, res) => {
  try {
    const foodId = req.params.id;

    const data = await client.query('DELETE FROM foods WHERE foods.id=$1;', [foodId]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/foods/:id', async(req, res) => {
  const foodId = req.params.id;

  const data = await client.query(`
    SELECT foods.id, name, deliciousness, can_be_vegetarian, img, meals.meal AS meal_name
      FROM foods 
      JOIN meals
      ON foods.meal_id=meals.id
      WHERE foods.id=$1
  `, [foodId]);

  res.json(data.rows[0]);
});

//update
app.put('/foods/:id', async(req, res) => {
  const foodId = req.params.id;

  try {
    const updatedFood = {
      name: req.body.name,
      deliciousness: req.body.deliciousness,
      can_be_vegetarian: req.body.can_be_vegetarian,
      img: req.body.img,
      meal_id: req.body.meal_id
    };

    const data = await client.query(`
      UPDATE foods
        SET name=$1, deliciousness=$2, can_be_vegetarian=$3, img=$4, meal_id=$5
        WHERE foods.id = $6
        RETURNING *
    `, [updatedFood.name, updatedFood.deliciousness, updatedFood.can_be_vegetarian, updatedFood.img, updatedFood.meal_id, foodId]); 

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

//create
app.post('/foods', async(req, res) => {
  try {
    const newFood = {
      name: req.body.name,
      deliciousness: req.body.deliciousness,
      can_be_vegetarian: req.body.can_be_vegetarian,
      img: req.body.img,
      meal_id: req.body.meal_id
    };

    const data = await client.query(`
      INSERT INTO foods(name, deliciousness, can_be_vegetarian, img, meal_id, owner_id)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *
      `, [newFood.name, newFood.deliciousness, newFood.can_be_vegetarian, newFood.img, newFood.meal_id, fakeUser.id]); 
  
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
