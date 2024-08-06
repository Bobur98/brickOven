import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});



import mongoose from "mongoose";
import server from "./app";

mongoose
  .connect(`${process.env.MONGO_URL}` as string, {})
  .then((data) => {
    console.log("MongoDb connection succeed");
    const PORT = process.env.PORT ?? 3003;
    server.listen(PORT, function () {
      console.info(`The server is running successfully on port: ${PORT}`);
      console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });
  })
  .catch((err) => console.log("Error on connection MongoDB", err));
  

  /**
   * PM2 COMMANDS
   * pm2 ls
   * pm2 start dist/server.js --name=BRICKOVEN
   * pm2 start "npm run start:prod" --name=BRICKOVEN
   * pm2 stop id
   * pm2 delete id
   * pm2 restart id
   * pm2 monit
   * pm2 kill
   */