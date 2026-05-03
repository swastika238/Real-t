import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from './models/user.model.js';
import * as userService from './services/user.service.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const email = 'test@example.com';
      const password = 'password123';
      const existingUser = await userModel.findOne({ email });
      if (!existingUser) {
        await userService.createUser({ email, password });
        console.log('Test user created successfully! You can login with:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
      } else {
        console.log('Test user already exists.');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => console.log(err));
