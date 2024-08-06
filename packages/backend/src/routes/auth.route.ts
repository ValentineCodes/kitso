import { createProfile } from "@controllers/auth/create_profile.controller.ts";
import express from "express"

const router = express.Router();

router.post("create_profile", createProfile)

export default router