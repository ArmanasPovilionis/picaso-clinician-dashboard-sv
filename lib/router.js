"use strict";

module.exports = function (app, worker)
{
    let Router = require("express").Router;
    let opts =
    {
        "caseSensitive": true,
        "strict": true
    };
    let root = Router(opts);

    root.use("/", require("./mw/methods"));
    root.get("/", require("./routes/index"));
    root.get("/index", require("./routes/index"));
    root.get("/index.html", require("./routes/index"));
    root.get("/system.html", require("./routes/system"));
    root.get("/license.html", require("./routes/license"));

    app.use("/", root);
};