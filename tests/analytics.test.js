const chai = require('chai');
const chaiHttp = require('chai-http').default || require('chai-http');
const app = require('../index'); // Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe('Analytics API', () => {
  let adminToken;

  const adminUser = {
    name: 'Admin Analytics',
    email: 'admin.analytics@test.com',
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

  describe('GET /api/analytics/sales', () => {
    it('should return sales analytics', async () => {
      const res = await chai.request(app)
        .get('/api/analytics/sales')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('totalOrders');
      expect(res.body.data).to.have.property('totalRevenue');
      expect(res.body.data).to.have.property('revenuePerProduct');
      expect(res.body.data).to.have.property('ordersPerStatus');
    });

    it('should fail without token', async () => {
      const res = await chai.request(app)
        .get('/api/analytics/sales');

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });

  describe('GET /api/analytics/stock', () => {
    it('should return stock analytics', async () => {
      const res = await chai.request(app)
        .get('/api/analytics/stock')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('totalStock');
      expect(res.body.data).to.have.property('stockPerProduct');
      expect(res.body.data).to.have.property('stockPerFarmer');
    });
  });

  describe('GET /api/analytics/delivery-time', () => {
    it('should return delivery time analytics', async () => {
      const res = await chai.request(app)
        .get('/api/analytics/delivery-time')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.data).to.have.property('totalShipments');
      expect(res.body.data).to.have.property('avgDeliveryTimeDays');
      expect(res.body.data).to.have.property('avgPerDistributor');
    });
  });
});