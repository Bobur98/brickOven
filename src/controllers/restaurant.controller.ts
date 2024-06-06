import { Request, Response } from "express";

import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";

const memberService = new MemberService();
const restaurantController: T = {};

restaurantController.goHome = async (req: Request, res: Response) => {
  try {
    res.render("home");
  } catch (err) {
    console.log("Error, goHome:", err);
  }
};

restaurantController.getSignup = async (req: Request, res: Response) => {
  try {
    res.render("signup");
  } catch (err) {
    console.log("Error on signup", err);
  }
};

restaurantController.getLogin = async (req: Request, res: Response) => {
  try {
    res.render("login");
  } catch (err) {
    console.log("Error on getLogin", err);
  }
};

restaurantController.processSignup = async (req: Request, res: Response) => {
  try {
    const newMember: MemberInput = req.body;
    newMember.memberType = MemberType.RESTAURANT;

    const result = await memberService.processSignup(newMember);
    // TODO SESSION AUTHENTICATION

    res.send(result);
  } catch (err) {
    console.log("Error on processSignup", err);
    res.send(err);
  }
};

restaurantController.processLogin = async (req: Request, res: Response) => {
  try {
    const input: LoginInput = req.body;
    console.log(input);

    const result = await memberService.processLogin(input);
    // TODO SESSION AUTHENTICATION

    res.send(result);
  } catch (err) {
    console.log("Error on processLogin", err);
    res.send(err);
  }
};


export default restaurantController;
