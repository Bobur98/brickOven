import { Request, Response } from "express";

import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";

const memberService = new MemberService();
const restaurantController: T = {};

restaurantController.goHome = async (req: Request, res: Response) => {
  try {
    res.send("You are on Home Page");
  } catch (err) {
    console.log("Error, goHome:", err);
  }
};

restaurantController.getSignup = async (req: Request, res: Response) => {
  try {
    res.send("You are on signup Page");
  } catch (err) {
    console.log("Error on signup", err);
  }
};

restaurantController.getLogin = async (req: Request, res: Response) => {
  try {
    res.send("You are on getLogin Page");
  } catch (err) {
    console.log("Error on getLogin", err);
  }
};

restaurantController.processLogin = async (req: Request, res: Response) => {
  try {
    res.send("You are on processLogin Page");
  } catch (err) {
    console.log("Error on processLogin", err);
  }
};
restaurantController.processSignup = async (req: Request, res: Response) => {
  try {
    res.send("You are on processSignup Page");
  } catch (err) {
    console.log("Error on processSignup", err);
  }
};

export default restaurantController;
