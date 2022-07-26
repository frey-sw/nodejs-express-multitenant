const supertest = require('supertest');

const app = require('../../../app');

const server = app.listen(3001);

 
//jest.mock('../../../data_access/report');

const api = supertest(app);

test('returns 200', async () => {
  await api
    .get('/api/brands')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});



afterAll(() => {
  server.close();
});
