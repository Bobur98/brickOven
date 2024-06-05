import { ObjectId } from "mongoose";
import { ViewGroup } from "../enums/view.enum";

export interface View {
  _id: ObjectId;
  memberId: ObjectId;
  viewGroup: ViewGroup;
  viewRefId: ObjectId;
  createdAt: Date;
  udpatedAt: Date;
}

export interface ViewInput {
  memberId: ObjectId;
  viewRefId: ObjectId;
  viewGroup: ViewGroup;
}
