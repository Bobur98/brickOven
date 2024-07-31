import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { T } from "./libs/types/common";
import cors from "cors";
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

const mongoDBStore = ConnectMongoDBSession(session);

const store = new mongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

/** ENTRANCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public"))); // IT IS OPEN FOR CLIENT
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use(morgan(MORGAN_FORMAT));

/** SESSIONS **/
// to develop sessions first we need to install following packages: connect-mongodb-session and express-session with their types
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 6, // 3hr
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

/** VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** ROUTERS **/
app.use("/admin", routerAdmin); // EJS
app.use("/", router); // REACT

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

let summaryClient = 0;
io.on("connection", (socket) => {
  summaryClient++;
  console.log(`Connection & total [${summaryClient}]`);

  socket.on("disconnect", () => {
    summaryClient--;
    console.log(`Disconnection & total [${summaryClient}]`);
  });
});
export default server;
