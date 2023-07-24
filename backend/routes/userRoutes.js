import express from "express";
const router = express.Router();
import {
  authUser,
  regsiterUser,
  logoutUser,
  getUserProfile,
  UpdateUserProfile,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", regsiterUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser)
router.route("/profile").get(protect, getUserProfile).put(protect, UpdateUserProfile)

//router.get('/profile', getUserProfile)
//router.put('/profile', UpdateUserProfile)
export default router;
