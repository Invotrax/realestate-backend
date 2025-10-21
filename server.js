require('dotenv').config();
require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const propertyRoutes = require('./routes/property.routes');
const queryRoutes = require('./routes/query.routes');
const locationRoutes =  require('./routes/location.routes');
const amenityRoutes =  require('./routes/amenity.routes');
const propertyTypeRoutes =  require('./routes/propertyTypeRoutes');
const stateRoutes =  require('./routes/state.routes');

const app = express();
connectDB();
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3000'], // allowed domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // credentials: true, // allow cookies/auth headers
};
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.send('Property Listing API'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/location',locationRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/property-type', propertyTypeRoutes);


// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
