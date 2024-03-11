import {
  login,
  register,
  googleLogin,
  googleRegister,
} from "../controllers/userController.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/google/register", googleRegister);

router.post("/google/login", googleLogin);

export default router;
