const { watch } = require("fs-extra");

module.exports = {
  apps : [{
    name   : "BRICKOVEN",
    script : "./dist/server.js",
    watch: false,
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    },
    instances: 1,
    exec_mode: "cluster"
  }]
}

    // "start:prod": "cross-env NODE_ENV=production node dist/server.js",
