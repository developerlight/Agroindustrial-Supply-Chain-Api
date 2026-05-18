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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, { swaggerUrl: '/docs/openapi.json' }));

// Default route
app.use('/api', routes);
app.get('/', (req, res) => {
  res.send('Agroindustrial Supply Chain API Running');
});


// Error handler
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));