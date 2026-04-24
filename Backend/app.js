// app.js
import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoutes from './Routes/user.routes.js';
import projectRoutes from './Routes/project.routes.js';
import cookieParser from 'cookie-parser';
// Connect to DB
import cors from 'cors';
connect();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users',userRoutes);
app.use('/projects',projectRoutes);

// Routes
app.get('/', (req, res) => {
  res.send("Hello World");
});

export default app;