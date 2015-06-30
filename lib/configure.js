"use strict";

module.exports = function (app, worker, pkg, config, basedir)
{
    let fs = require("fs");
    let http = require("http");
    let path = require("path");

    let express = require("express");
    let session = require("express-session");
    let CassandraStore = require("cassandra-store")(session);
    let compress = require("compression");
    let morgan = require("morgan");
    let favicon = require("serve-favicon");
    let ejs = require("ejs");
    let uuid = require("uuid");

    /* ===== Define locals ===== */
    app.set("basedir", basedir);
    app.set("pkg", pkg);
    app.set("worker", worker);
    app.set("public", path.join(basedir, "public"));
    app.set("views", path.join(basedir, "lib", "views"));
    app.set("dbconfig", config.database);

    /* ===== Define log stream ===== */
    let logfile = path.join(basedir, "logs", "access_" + worker.id + ".log");
    let access = fs.createWriteStream(logfile, {flags: "a"});
    app.use(morgan("combined", {"stream": access}));

    /* ===== Other configurations ===== */
    app.use(require("./mw/xPoweredBy"));
    app.use(compress({
        "threshold": 32,
        "chunkSize": 16 * 1024
    }));
    app.set("etag", "strong");

    /* ===== Session ===== */
    app.set("trust proxy", true);
    app.use(session({
        "store": new CassandraStore(config.database),
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
    require("./router")(app, worker);

    /* ===== Error handling ===== */
    app.use(require("./mw/logError"));
    app.use(require("./mw/renderError"));
    app.use(require("./mw/notFound"));
};