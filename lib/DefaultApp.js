"use strict";

module.exports = class DefaultApp
{
    constructor(worker, pkg, config)
    {
        const fs = require("fs");
        const http = require("http");
        const os = require("os");
        const path = require("path");
        const compress = require("compression");
        const debug = require("debug")(pkg.name);
        const ejs = require("ejs");
        const express = require("express");
        const favicon = require("serve-favicon");
        const mkdirp = require("mkdirp");
        const morgan = require("morgan");
        const session = require("express-session");
        const uuid = require("uuid");
        const cassandraStore = require("cassandra-store")(session);

        /* ===== Define app ===== */
        const app = require("express")();

        /* ===== Define locals ===== */
        app.set("basedir", config.basedir);
        app.set("pkg", pkg);
        app.set("worker", worker);
        app.set("public", path.join(config.basedir, "client", "public"));
        app.set("views", path.join(config.basedir, "client", "views"));
        app.set("dbconfig", config.database);

        /* ===== Define log stream ===== */
        let logdir = path.join(os.homedir(), ".logs");
        try
        {
            fs.accessSync(logdir);
        }
        catch (error)
        {
            debug(error.message);
            debug("Creating directory %s", logdir);
            mkdirp.sync(logdir)
        }
        let access = fs.createWriteStream(
            path.join(logdir, "access_" + worker.id + ".log"),
            { flags: "a" });
        app.use(morgan("combined", { "stream": access }));

        /* ===== Other configurations ===== */
        app.use(compress({
            "threshold": 32,
            "chunkSize": 16 * 1024
        }));
        app.set("etag", "strong");

        /* ===== Session ===== */
        app.set("trust proxy", true);
        app.use(session({
            "store": new cassandraStore(config.database),
            "genid": function ()
            {
                return uuid.v1();
            },
            "name": "sid",
            "resave": true,
            "saveUninitialized": true, // "unset": "destroy",
            // "rolling": false,
            "secret": "7dbcbbea-f0f2-11e4-b9b2-1697f925ec7b",
            "cookie": {
                "path": "/",
                "httpOnly": true,
                "secure": config.http.secure,
                "maxAge": 600000
            }
        }));

        /* ===== Static ===== */
        app.use(express.static(app.get("public")));
        app.use(favicon(path.join(app.get("public"), "images", "favicon.ico")));

        /* ===== Rendering ===== */
        app.engine(".html", ejs.__express);
        app.set("view engine", "html");

        /* ===== Routes ===== */
        const routerOpts =
        {
            "caseSensitive": true,
            "strict": true
        };
        const router = new (require("./DefaultRouter"))(routerOpts);
        app.use("/", router);

        /* ===== Error handling ===== */
        const Error = require("./mw/Error");
        app.use([Error.logger, Error.renderer]);
        app.use(require("./mw/_404"));

        /* ===== Class properties ===== */
        this.app = app;
        this.config = config;
    }

    start()
    {
        const fs = require("fs");
        const path = require("path");
        const ipaddress = this.config["http"]["ipaddress"];
        const port = this.config["http"]["port"];

        let server = null;
        if(this.config["http"]["secure"])
        {
            let kf = path.join(this.config.basedir, "config", "certs",
                this.config["http"]["key"]);
            let cf = path.join(this.config.basedir, "config", "certs",
                this.config["http"]["cert"]);
            if(!fs.existsSync(kf) || !fs.existsSync(cf))
            {
                throw new Error("HTTP certificate file not found.");
            }
            let options =
            {
                "key": fs.readFileSync(kf),
                "cert": fs.readFileSync(cf)
            };
            server = require("https").createServer(options, this.app);
        }
        else
        {
            server = require("http").createServer(this.app);
        }
        server.timeout = 10000;
        server.listen(port, ipaddress);
        console.info("%s (worker: %s) started at %s. IP address: %s, port: %s",
            this.app.get("pkg")["name"], this.app.get("worker").id, new Date(),
            ipaddress, port);
    }

};
