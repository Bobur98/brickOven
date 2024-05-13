import { Request, Response } from "express";

import { T } from "../libs/types/common";

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

export default restaurantController;
