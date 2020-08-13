require('dotenv').config();

const { execSync } = require('child_process');

// const fakeRequest = require('supertest');
// const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  beforeAll(done => {
    return client.connect(done);
  });

  beforeEach(() => {
    // TODO: ADD DROP SETUP DB SCRIPT
    execSync('npm run setup-db');
  });

  afterAll(done => {
    return client.end(done);
  });

  test('returns foods', async() => {

    const expectation = [
      {
        name: 'pizza',
        deliciousness: 10,
        can_be_vegetarian: true,
        meal: 'dinner',
        img: 'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?cs=srgb&dl=pexels-engin-akyurt-2619967.jpg&fm=jpg'
      },
      {
        name: 'pancakes',
        deliciousness: 9,
        can_be_vegetarian: true,
        meal: 'breakfast',
        img: 'https://images.pexels.com/photos/574111/pexels-photo-574111.jpeg?cs=srgb&dl=pexels-sheena-wood-574111.jpg&fm=jpg'
      },
      {
        name: 'panini',
        deliciousness: 8,
        can_be_vegetarian: true,
        meal: 'lunch',
        img: 'https://images.pexels.com/photos/1885578/pexels-photo-1885578.jpeg?cs=srgb&dl=pexels-lisa-fotios-1885578.jpg&fm=jpg'
      },
      {
        name: 'pancetta',
        deliciousness: 7,
        can_be_vegetarian: false,
        meal: 'snack',
        img: 'https://images.pexels.com/photos/4202891/pexels-photo-4202891.jpeg?cs=srgb&dl=pexels-karolina-grabowska-4202891.jpg&fm=jpg'
      },
    ];
    
    const data = [
      {
        name: 'pizza',
        deliciousness: 10,
        can_be_vegetarian: true,
        meal: 'dinner',
        img: 'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?cs=srgb&dl=pexels-engin-akyurt-2619967.jpg&fm=jpg'
      },
      {
        name: 'pancakes',
        deliciousness: 9,
        can_be_vegetarian: true,
        meal: 'breakfast',
        img: 'https://images.pexels.com/photos/574111/pexels-photo-574111.jpeg?cs=srgb&dl=pexels-sheena-wood-574111.jpg&fm=jpg'
      },
      {
        name: 'panini',
        deliciousness: 8,
        can_be_vegetarian: true,
        meal: 'lunch',
        img: 'https://images.pexels.com/photos/1885578/pexels-photo-1885578.jpeg?cs=srgb&dl=pexels-lisa-fotios-1885578.jpg&fm=jpg'
      },
      {
        name: 'pancetta',
        deliciousness: 7,
        can_be_vegetarian: false,
        meal: 'snack',
        img: 'https://images.pexels.com/photos/4202891/pexels-photo-4202891.jpeg?cs=srgb&dl=pexels-karolina-grabowska-4202891.jpg&fm=jpg'
      },
    ];

    expect(data.body).toEqual(expectation);
  });
});
