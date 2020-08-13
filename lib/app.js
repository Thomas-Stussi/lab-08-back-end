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

app.get('/foods', async(req, res) => {
  const data = await client.query('SELECT * from foods');

  res.json(data.rows);
});

app.get('/foods/:id', async(req, res) => {
  const foodId = req.params.id;

  const data = await client.query(`SELECT * from foods where id=${foodId}`);
  
  res.json(data.rows[0]);
});

app.post('/foods', async(req, res) => {
  const newFood = {
    name: req.body.name,
    deliciousness: req.body.deliciousness,
    can_be_vegetarian: req.body.can_be_vegetarian,
    meal: req.body.meal,
    img: req.body.img,
  };

  const data = await client.query(`
  INSERT INTO foods(name, deliciousness, can_be_vegetarian, meal, img, owner_id)
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *
`, [newFood.name, newFood.deliciousness, newFood.can_be_vegetarian, newFood.meal, newFood.img, fakeUser.id]); 
  
  res.json(data.rows[0]);
});

app.use(require('./middleware/error'));

module.exports = app;
