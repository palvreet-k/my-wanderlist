import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from './middleware/passport.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import authRoutes from './routes/auth.js';
import wishlistRoutes from './routes/wishlist.js';
import visitedRoutes from './routes/visited.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(session({
  secret:            "secret",
  resave:            false,
  saveUninitialized: false,
  store:             MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
// app.use('/api/auth', require('./routes/auth'));

// Test route
// app.get('/', (req, res) => {
//   res.json({ message: 'Server is running' });
// });

app.use('/api', authRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/visited', visitedRoutes)

// Route not found middleware function

app.use((a,b,c) =>{
  const error = new Error("We don't have that route in our API listings");
  error.status = 404;
  c(error);
});

app.use((err, req, res, next)=>{
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    ERROR:{
      status: statusCode,
      message: err.message
    }
  })
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));