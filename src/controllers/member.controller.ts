import { Request, Response } from "express";

import { T } from "../libs/types/common";

const memberController: T = {};

memberController.goHome = async (req: Request, res: Response) => {
  try {
    res.send("You are on Home Page");
  } catch (err) {
    console.log("Error, goHome:", err);
  }
};

memberController.getSignup = async (req: Request, res: Response) => {
  try {
    res.send("You are on signup Page");
  } catch (err) {
    console.log("Error on signup", err);
  }
};

memberController.getLogin = async (req: Request, res: Response) => {
  try {
    res.send("You are on getLogin Page");
  } catch (err) {
    console.log("Error on getLogin", err);
  }
};

export default memberController;
