const chai = require('chai');
const chaiHttp = require('chai-http').default || require('chai-http');
const app = require('../index'); // Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe('Farmers API', () => {
  let adminToken;
  let farmerId;

  const adminUser = {
    name: 'Admin Farmers',
    email: 'admin.farmers@test.com',
    password: 'adminpass',
    role: 'admin'
  };

  before(async () => {
    // Register admin
    await chai.request(app)
      .post('/api/auth/register')
      .send(adminUser);

    // Login admin
    const resAdmin = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: adminUser.email, password: adminUser.password, role: 'admin' });

    adminToken = resAdmin.body.data.token;
  });

  it('should create a new farmer', async () => {
    const res = await chai.request(app)
      .post('/api/farmers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Farmer Test',
        farmName: 'Farm Test',
        contact: { email: 'farmer@test.com', phone: '08123456789' },
        password: 'password123'
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data.name).to.equal('Farmer Test');
    farmerId = res.body.data._id;
  });

  it('should GET all farmers', async () => {
    const res = await chai.request(app)
      .get('/api/farmers')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should GET farmer by ID', async () => {
    const res = await chai.request(app)
      .get(`/api/farmers/${farmerId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data._id).to.equal(farmerId);
  });

  it('should UPDATE farmer', async () => {
    const res = await chai.request(app)
      .put(`/api/farmers/${farmerId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        farmName: 'Farm Updated',
        contact: { email: 'updated@test.com', phone: '08123456790' }
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.farmName).to.equal('Farm Updated');
  });

  it('should DELETE farmer', async () => {
    const res = await chai.request(app)
      .delete(`/api/farmers/${farmerId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('should fail to access farmers endpoints without admin', async () => {
    const res = await chai.request(app)
      .get('/api/farmers')
      .set('Authorization', `Bearer invalidtoken123`);

    expect(res.status).to.equal(401);
    expect(res.body.success).to.be.false;
  });
});