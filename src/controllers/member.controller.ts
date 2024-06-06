import { Request, Response } from "express";

import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { LoginInput, Member } from "../libs/types/member";
import { MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors from "../libs/Errors";

const memberService = new MemberService();

const memberController: T = {};

memberController.signup = async (req: Request, res: Response) => {
  try {
    const input: MemberInput = req.body;
    // TODO TOKENS AUTHENTICATION

    const result: Member = await memberService.signup(input);
    res.json({ member: result });
  } catch (err) {
    console.log("Error on processSignup", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard.message);
    // res.json({});
  }
};

memberController.login = async (req: Request, res: Response) => {
  try {
    const input: LoginInput = req.body;

    const result = await memberService.login(input);
    // TODO TOKENS AUTHENTICATION

    res.json({ member: result });
  } catch (err) {
    console.log("Error on processLogin", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard.message);
  }
};


export default memberController;
