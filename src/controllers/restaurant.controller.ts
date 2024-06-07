import { NextFunction, Request, Response } from "express";

import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const memberService = new MemberService();
const restaurantController: T = {};

restaurantController.goHome = async (req: Request, res: Response) => {
  try {
    res.render("home");
  } catch (err) {
    console.log("Error, goHome:", err);
    res.redirect("/admin");
  }
};

restaurantController.getSignup = async (req: Request, res: Response) => {
  try {
    res.render("signup");
  } catch (err) {
    console.log("Error on signup", err);
    res.redirect("/admin");
  }
};

restaurantController.getLogin = async (req: Request, res: Response) => {
  try {
    res.render("login");
  } catch (err) {
    console.log("Error on getLogin", err);
  }
};

restaurantController.processSignup = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    const file = req.file;
    if (!file) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.IMAGE_REQUIRED);
    }
    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path.replace(/\\/g, "/");

    newMember.memberType = MemberType.RESTAURANT;

    const result = await memberService.processSignup(newMember);
    // TODO SESSION AUTHENTICATION
    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error on processSignup", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `Hi, <script> alert(" ${message}"); window.replace("/admin/signup)</script>`
    );
  }
};

restaurantController.processLogin = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    const input: LoginInput = req.body;

    const result = await memberService.processLogin(input);
    // TODO SESSION AUTHENTICATION
    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error on processLogin", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `Hi, <script> alert(" ${message}"); window.replace("/admin/login)</script>`
    );
  }
};
restaurantController.logout = async (req: AdminRequest, res: Response) => {
  try {
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error on processLogin", err);
    res.redirect("/admin");
  }
};

restaurantController.checkAuthSession = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    if (req.session?.member) {
      res.send(
        `Hi, <script> alert(" ${req.session.member.memberNick}")</script>`
      );
    } else {
      res.send(`<script> alert("${Message.NOT_AUTHENTICATED}")</script>`);
    }
  } catch (err) {
    console.log("Error on processLogin", err);
    res.send(err);
  }
};

restaurantController.verifyRestaurant = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.session?.member?.memberType === MemberType.RESTAURANT) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login');</script>`
    );
  }
};

export default restaurantController;
