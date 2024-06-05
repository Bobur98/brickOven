import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./routerAdmin";
import morgan from "morgan";
/** ENTRANCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(`:method :url :response-time [:status] \n`));
/** SESSIONS **/

/** VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** ROUTERS **/
app.use("/admin", routerAdmin); // EJS
app.use("/", router); // REACT

export default app;
