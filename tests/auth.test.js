const chai = require('chai');
const chaiHttp = require('chai-http').default || require('chai-http');
const app = require('../index'); // Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth API', () => {
  let adminToken;
  let farmerToken;

  const adminUser = {
    name: 'Admin Test',
    email: 'admin@test.com',
    password: 'adminpass',
    role: 'admin'
  };

  const farmerUser = {
    name: 'Farmer Test',
    email: 'farmer@test.com',
    password: 'farmerpass',
    role: 'farmer'
  };

  before(async () => {
    // Register admin
    await chai.request(app)
      .post('/api/auth/register')
      .send(adminUser);

    // Register farmer
    await chai.request(app)
      .post('/api/auth/register')
      .send(farmerUser);

    // Login admin
    const resAdmin = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: adminUser.email, password: adminUser.password, role: adminUser.role });
    adminToken = resAdmin.body.data.token;

    // Login farmer
    const resFarmer = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: farmerUser.email, password: farmerUser.password, role: farmerUser.role });
    farmerToken = resFarmer.body.data.token;
  });

  it('should register a new user', async () => {
    const res = await chai.request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'farmer'
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data.email).to.equal('testuser@example.com');
  });

  it('should fail register with existing email', async () => {
    const res = await chai.request(app)
      .post('/api/auth/register')
      .send({
        name: 'Duplicate',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
      });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
  });

  it('should login admin user', async () => {
    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: adminUser.email, password: adminUser.password, role: 'admin' });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.token).to.exist;
  });

  it('should login farmer user', async () => {
    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: farmerUser.email, password: farmerUser.password, role: 'farmer' });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.token).to.exist;
  });

  it('should fail login with wrong password', async () => {
    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: farmerUser.email, password: 'wrongpass', role: 'farmer' });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
  });

  it('should get /me user info', async () => {
    const res = await chai.request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${farmerToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.email).to.equal(farmerUser.email);
  });

  it('should fail /me without token', async () => {
    const res = await chai.request(app)
      .get('/api/auth/me');

    expect(res.status).to.equal(401);
    expect(res.body.success).to.be.false;
  });
});