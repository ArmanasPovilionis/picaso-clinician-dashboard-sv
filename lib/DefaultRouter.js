"use strict";

const httpError = require("http-errors");

module.exports = class DefaultRouter extends require("express").Router
{
    constructor(opts = DefaultRouter.defaultOptions())
    {
        super(opts);
        this.all("*", DefaultRouter.xPoweredBy, DefaultRouter.logSession, DefaultRouter.allowOnlyGetMethod);
        this.get("/", require("./routes/index"));
        this.get("/index", require("./routes/index"));
        this.get("/index.html", require("./routes/index"));
        this.get("/system.html", require("./routes/system"));
        this.get("/license.html", require("./routes/license"));
        this.get("/error.html", require("./routes/error"));

        /* ===== 404 Error handling ===== */
        this.use(DefaultRouter._404);
    }

    static allowOnlyGetMethod (request, response, next)
    {
        const message = `Method ${request.method} Not Allowed for URL ${request.originalUrl}`;
        switch (request.method)
        {
            case "GET":
                next();
                break;
            case "CONNECT":
            case "DELETE":
            case "HEAD":
            case "OPTIONS":
            case "POST":
            case "PUT":
            case "TRACE":
            default:
                response.set("allow", "GET");
                next(new httpError.MethodNotAllowed(message));
                break;
        }
    }

    static logSession (request, response, next)
    {
        request.app.locals.logger(request.session);
        next();
    }

    static xPoweredBy (request, response, next)
    {
        response.set("X-Powered-By",
            `${request.app.locals.pkg.name}/${request.app.locals.pkg.version} (${request.app.locals.pkg.description})`);
        next();
    }

    static _404 (request, response, next)
    {
        const message = `Path "${request.originalUrl}" not found in this server`;
        next(new httpError.NotFound(message));
    }

    static defaultOptions()
    {
        return { "caseSensitive": true, "strict": true };
    }
};