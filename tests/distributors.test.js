const chai = require('chai');
const chaiHttp = require('chai-http').default || require('chai-http');
const app = require('../index'); // Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe('Distributors API', () => {
  let adminToken;
  let distributorId;

  const adminUser = {
    name: 'Admin Distributor',
    email: 'admin.distributor@test.com',
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

  it('should create a new distributor', async () => {
    const res = await chai.request(app)
      .post('/api/distributors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Distribusi Test',
        type: 'Distributor',
        contact: { email: 'distribusi@test.com', phone: '08123456789' },
        password: 'password123'
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data.name).to.equal('Distribusi Test');
    distributorId = res.body.data._id; // simpan untuk test berikutnya
  });

  it('should GET all distributors', async () => {
    const res = await chai.request(app)
      .get('/api/distributors')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should GET distributor by ID', async () => {
    const res = await chai.request(app)
      .get(`/api/distributors/${distributorId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data._id).to.equal(distributorId);
  });

  it('should UPDATE distributor', async () => {
    const res = await chai.request(app)
      .put(`/api/distributors/${distributorId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Distribusi Test Updated',
        contact: { email: 'updated@test.com', phone: '08123456790' }
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.name).to.equal('Distribusi Test Updated');
  });

  it('should DELETE distributor', async () => {
    const res = await chai.request(app)
      .delete(`/api/distributors/${distributorId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('should fail to access distributors endpoints without admin', async () => {
    // Create fake token with farmer role
    const res = await chai.request(app)
      .get('/api/distributors')
      .set('Authorization', `Bearer invalidtoken123`);

    expect(res.status).to.equal(401); // unauthorized
  });
});