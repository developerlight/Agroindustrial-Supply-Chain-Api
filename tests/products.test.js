const chai = require('chai');
const chaiHttp = require('chai-http').default || require('chai-http');
const app = require('../index'); // Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe('Products API', () => {
  let adminToken;
  let productId;

  const adminUser = {
    name: 'Admin Products',
    email: 'admin.products@test.com',
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

  it('should create a new product', async () => {
    const res = await chai.request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Product Test',
        category: 'Grains',
        unit: 'kg',
        pricePerUnit: 5000,
        quantityAvailable: 1000,
        harvestDate: '2026-05-17'
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data.name).to.equal('Product Test');
    productId = res.body.data._id;
  });

  it('should GET all products', async () => {
    const res = await chai.request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should GET product by ID', async () => {
    const res = await chai.request(app)
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data._id).to.equal(productId);
  });

  it('should UPDATE product', async () => {
    const res = await chai.request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        pricePerUnit: 5500,
        quantityAvailable: 1200
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.pricePerUnit).to.equal(5500);
    expect(res.body.data.quantityAvailable).to.equal(1200);
  });

  it('should DELETE product', async () => {
    const res = await chai.request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('should fail creating product without required fields', async () => {
    const res = await chai.request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: '', pricePerUnit: 0 });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
  });

  it('should fail to access products endpoint without token', async () => {
    const res = await chai.request(app)
      .get('/api/products');

    expect(res.status).to.equal(401);
    expect(res.body.success).to.be.false;
  });
});