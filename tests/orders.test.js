const chai = require('chai');
const chaiHttp = require('chai-http').default || require('chai-http');
const app = require('../index'); // Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe('Orders API', () => {
  let adminToken;
  let distributorToken;
  let productId;
  let orderId;

  const adminUser = {
    name: 'Admin Orders',
    email: 'admin.orders@test.com',
    password: 'adminpass',
    role: 'admin'
  };

  const distributorUser = {
    name: 'Distributor Orders',
    email: 'distributor.orders@test.com',
    password: 'distributorpass',
    role: 'distributor'
  };

  before(async () => {
    // Register admin and distributor
    await chai.request(app).post('/api/auth/register').send(adminUser);
    await chai.request(app).post('/api/auth/register').send(distributorUser);

    // Login admin
    const resAdmin = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: adminUser.email, password: adminUser.password, role: 'admin' });
    adminToken = resAdmin.body.data.token;

    // Login distributor
    const resDist = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: distributorUser.email, password: distributorUser.password, role: 'distributor' });
    distributorToken = resDist.body.data.token;

    // Create a product for the order
    const resProduct = await chai.request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Product',
        category: 'Grains',
        unit: 'kg',
        pricePerUnit: 5000,
        quantityAvailable: 1000,
        harvestDate: '2026-05-17'
      });

    productId = resProduct.body.data._id;
  });

  it('should create a new order', async () => {
    const res = await chai.request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${distributorToken}`)
      .send({
        productId,
        quantity: 100,
        deliveryDate: '2026-05-22'
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data.productId).to.equal(productId);
    orderId = res.body.data._id;
  });

  it('should GET all orders as admin', async () => {
    const res = await chai.request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should GET order by ID', async () => {
    const res = await chai.request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data._id).to.equal(orderId);
  });

  it('should UPDATE order status as admin', async () => {
    const res = await chai.request(app)
      .put(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'confirmed' });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.status).to.equal('confirmed');
  });

  it('should UPDATE order status as distributor', async () => {
    const res = await chai.request(app)
      .put(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${distributorToken}`)
      .send({ status: 'shipped' });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.status).to.equal('shipped');
  });

  it('should DELETE order as admin', async () => {
    const res = await chai.request(app)
      .delete(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('should fail creating order with missing fields', async () => {
    const res = await chai.request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${distributorToken}`)
      .send({});

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
  });
});