// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/openapi.json')
const path = require('path');
// Routes (sementara placeholder)
// const productRoutes = require('./routes/productRoutes');

const app = express();

// Connect MongoDB (skip when SKIP_DB=true for docs/testing without DB)
connectDB();

// Middleware global
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

// Routes
// app.use('/api/products', productRoutes);

// Serve OpenAPI YAML as static and mount Swagger UI
app.use('/docs', express.static(path.join(__dirname, 'docs')));
// Prefer JSON spec for Swagger UI to avoid YAML parsing/version issues
// Disable Helmet's contentSecurityPolicy for the docs route so Swagger UI can load
// (CSP can block inline scripts/styles that swagger-ui-express relies on)
// app.use('/api-docs', helmet({ contentSecurityPolicy: false }), swaggerUi.serve, swaggerUi.setup({ swaggerUrl: swaggerSpec }));
app.get('/api-docs', (req, res) => {
  res.redirect('https://app.swaggerhub.com/apis-docs/byarak/agroindustrial-supply-chain-api/1.0.0?view=uiDocs')
});

// Default route
app.use('/api', routes);
// Root: describe the API (JSON) and redirect HTML users to Swagger UI
app.get('/', (req, res) => {
  const info = {
    name: pkg.name || 'Agroindustrial Supply Chain API',
    version: pkg.version || '1.0.0',
    description: pkg.description || 'API for managing the agroindustrial supply chain',
    endpoints: {
      apiRoot: '/api',
      docs: '/api-docs',
    },
    notes: 'If you open this URL in a browser you will be redirected to the Swagger UI.',
  };

  // If the client prefers HTML (browser), redirect to the docs UI
  if (req.accepts && req.accepts('html')) {
    return res.redirect(302, '/api-docs');
  }

  // Otherwise return a JSON description suitable for programmatic clients
  return res.json(info);
});


// Error handler
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));