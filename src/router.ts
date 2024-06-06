import express, { Request, Response } from "express";
import memberController from "./controllers/member.controller";
const router = express.Router();

router.post("/login", memberController.login);

router.post("/signup", memberController.signup);


export default router;
