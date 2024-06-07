export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NOT_MODIFIED = 304,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data is found!",
  CREATE_FAILED = "Create is failed!",
  ONLY_ONE_RESTAURENT_ALLOWED = "Only one restaurent can be signup!",
  UPDATE_FAILED = "Update is failed!",
  USED_NICK_NAME = "You are inserting already used nick or phone!",
  NO_MEMBER_NICK = "No member with that nick!",
  WRONG_PASSWORD = "Wrong password, please try again!",
  NOT_AUTHENTICATED = "You are not authenticated, please login first!",
  BLOCKED_USER = "You have been blocked, please contanct restaurent!",
  TOKEN_CREATION_FAILED = "Token creation error!",
  IMAGE_REQUIRED = "Please upload image!",
}

class Errors extends Error {
    public code: HttpCode;
    public message: Message;

    static standard = {
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: Message.SOMETHING_WENT_WRONG
    }

    constructor(statusCode: HttpCode, statusMessage: Message) {
        super();
        this.code = statusCode;
        this.message = statusMessage;
    }
}

export default Errors