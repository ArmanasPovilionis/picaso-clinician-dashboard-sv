"use strict";

module.exports = function (app, worker, config, basedir)
{
    let fs = require("fs");
    let path = require("path");

    let ipaddress = config["http"]["ipaddress"];
    let port = config["http"]["port"];
    let server = null;
    if(config["http"]["secure"])
    {
        let kf = path.join(basedir, "config", "certs", config["http"]["key"]);
        let cf = path.join(basedir, "config", "certs", config["http"]["cert"]);
        if(!fs.existsSync(kf) || !fs.existsSync(cf))
        {
            throw new Error("HTTP certificate file not found.");
        }
        let options =
        {
            "key": fs.readFileSync(kf),
            "cert": fs.readFileSync(cf)
        };
        server = require("https").createServer(options, app);
    }
    else
    {
        server = require("http").createServer(app);
    }
    server.timeout = 10000;
    server.listen(port, ipaddress);
    console.info("%s (worker: %s) started at %s. IP address: %s, port: %s",
        app.get("pkg")["name"], worker.id, new Date(), ipaddress, port);
};
