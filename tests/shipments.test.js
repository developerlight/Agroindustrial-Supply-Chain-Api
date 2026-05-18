const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe('Shipments API', () => {
  let adminToken;
  let distributorToken;
  let productId;
  let orderId;
  let shipmentId;

  const adminUser = {
    name: 'Admin Shipments',
    email: 'admin.shipments@test.com',
    password: 'adminpass',
    role: 'admin'
  };

  const distributorUser = {
    name: 'Distributor Shipments',
    email: 'distributor.shipments@test.com',
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

    // Create a product
    const resProduct = await chai.request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Shipment Product',
        category: 'Grains',
        unit: 'kg',
        pricePerUnit: 5000,
        quantityAvailable: 1000,
        harvestDate: '2026-05-17'
      });
    productId = resProduct.body.data._id;

    // Create an order by distributor
    const resOrder = await chai.request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${distributorToken}`)
      .send({
        productId,
        quantity: 100,
        deliveryDate: '2026-05-22'
      });
    orderId = resOrder.body.data._id;
  });

  it('should create a new shipment as admin', async () => {
    const res = await chai.request(app)
      .post('/api/shipments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        orderId,
        distributorId: distributorUser._id,
        shipmentDate: '2026-05-23',
        status: 'pending'
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data.orderId).to.equal(orderId);
    shipmentId = res.body.data._id;
  });

  it('should create a shipment as distributor (auto distributorId)', async () => {
    const res = await chai.request(app)
      .post('/api/shipments')
      .set('Authorization', `Bearer ${distributorToken}`)
      .send({
        orderId,
        shipmentDate: '2026-05-24',
        status: 'pending'
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data.distributorId).to.exist;
  });

  it('should GET all shipments', async () => {
    const res = await chai.request(app)
      .get('/api/shipments')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should GET shipment by ID', async () => {
    const res = await chai.request(app)
      .get(`/api/shipments/${shipmentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data._id).to.equal(shipmentId);
  });

  it('should UPDATE shipment as admin', async () => {
    const res = await chai.request(app)
      .put(`/api/shipments/${shipmentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'shipped' });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.status).to.equal('shipped');
  });

  it('should UPDATE shipment status as distributor', async () => {
    const res = await chai.request(app)
      .put(`/api/shipments/${shipmentId}`)
      .set('Authorization', `Bearer ${distributorToken}`)
      .send({ status: 'delivered' });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.status).to.equal('delivered');
  });

  it('should DELETE shipment as admin', async () => {
    const res = await chai.request(app)
      .delete(`/api/shipments/${shipmentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('should fail creating shipment with missing fields', async () => {
    const res = await chai.request(app)
      .post('/api/shipments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
  });

  it('should fail to access shipments endpoint without token', async () => {
    const res = await chai.request(app)
      .get('/api/shipments');

    expect(res.status).to.equal(401);
    expect(res.body.success).to.be.false;
  });
});