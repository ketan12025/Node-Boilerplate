import express from 'express';
import user from './user/userRoute.js';

const router = express.Router();

router.use('/users', user);

export default router;
