import express from 'express';
import { createProfile } from '../controllers/auth/create_profile.controller.ts';

const router = express.Router();

router.post('/create_profile', createProfile);

export default router;
