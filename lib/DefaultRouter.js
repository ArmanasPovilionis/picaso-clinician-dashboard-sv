"use strict";

module.exports = class DefaultRouter extends require("express").Router
{
    constructor(opts)
    {
        super(opts);
        this.use("/", DefaultRouter.xPoweredBy);
        this.use("/", DefaultRouter.allowOnlyGetMethod);
        this.get("/", require("./routes/index"));
        this.get("/index", require("./routes/index"));
        this.get("/index.html", require("./routes/index"));
        this.get("/system.html", require("./routes/system"));
        this.get("/license.html", require("./routes/license"));
    }

    static allowOnlyGetMethod (request, response, next)
    {
        const util = require("util");
        const ErrorMessages = "Method %s Not Allowed for URL %s";
        switch (request.method)
        {
            case "CONNECT":
            case "DELETE":
            case "HEAD":
            case "OPTIONS":
            case "PUT":
            case "TRACE":
            case "POST":
                const error = new Error(util.format(
                    ErrorMessages, request.method, request.originalUrl));
                response.set("Allow", "GET");
                response.statusCode = 405;
                next(error);
                break;
            case "GET":
            default:
                next();
                break;
        }
    }

    static xPoweredBy (request, response, next)
    {
        response.set("X-Powered-By", request.app.get("pkg").name + "/" +
        request.app.get("pkg").version + " (" +
        request.app.get("pkg").description + ")");
        next();
    }
};
