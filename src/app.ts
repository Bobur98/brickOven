import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import session from "express-session";
import ConnectMongoDBSession, { MongoDBStore } from "connect-mongodb-session";

const mongoDBStore = ConnectMongoDBSession(session);

const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

/** ENTRANCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(`:method :url :response-time [:status] \n`));
/** SESSIONS **/
// to develop sessions first we need to install following packages: connect-mongodb-session and express-session with their types
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 3, // 3hr
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);
/** VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** ROUTERS **/
app.use("/admin", routerAdmin); // EJS
app.use("/", router); // REACT

export default app;
