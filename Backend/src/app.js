const express      = require('express');
const dotenv       = require('dotenv');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const swaggerUi    = require('swagger-ui-express');
const swaggerSpec  = require('./config/swagger');
const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(rateLimit({windowMs:15 * 60 * 1000, max : 100}));

app.use(morgan('dev'));
app.use(express.json());


const authRoutes       = require('./routes/auth.routes');
const userRoutes       = require('./routes/user.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');
const reviewRoutes = require('./routes/review.routes');
const reservationRoutes= require('./routes/reservation.routes');
const notificationRoutes= require('./routes/notification.routes');
const adminRoutes = require('./routes/admin.routes');


app.use('/api/v1/auth',        authRoutes);
app.use('/api/v1/users',       userRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/menu' , menuRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews',reviewRoutes);
app.use('/api/v1/reservations' , reservationRoutes); 
app.use('/api/v1/notifications', notificationRoutes );
app.use('/api/v1/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.all('/{*splat}', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
});

server.on('error', (error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => process.exit(0));
});

module.exports = app;
