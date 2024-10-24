const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Microservices URLs (assuming they are running on different ports)
const userService = 'http://localhost:5001';
const packageService = 'http://localhost:5002';

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check route for the API gateway
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is up and running!' });
});

// Routes to different microservices
app.use(
  '/users',
  createProxyMiddleware({
    target: userService,
    changeOrigin: true,
    pathRewrite: {
      '^/users': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Redirecting to: ${userService}${proxyReq.path}`);
    },
  })
);

app.use(
  '/package',
  createProxyMiddleware({
    target: packageService,
    changeOrigin: true,
    pathRewrite: {
      '^/package': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Redirecting to: ${packageService}${proxyReq.path}`);
    },
  })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(`${new Date().toISOString()} - Error:`, err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the API Gateway
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});