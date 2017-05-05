"use strict";

const parser = require("body-parser");
const DefaultRouter = require("./DefaultRouter");
const AuthRoute = require("./routes/authentication/auth-route");
const cors = require('cors')
const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};
module.exports = class APIRouter extends require("express").Router
{
    constructor(opts = APIRouter.defaultOptions())
    {
        super(opts);
        this.all("*", DefaultRouter.xPoweredBy);

        this.all("/picaso/authenticate/login", cors(corsOptions), parser.json({
            "inflate": true,
            "strict": true
        }), AuthRoute.login);
        this.all("/picaso/authenticate/identify", cors(corsOptions), parser.json({
            "inflate": true,
            "strict": true
        }), AuthRoute.identify);
        this.all("/picaso/authenticate/patients", cors(corsOptions), parser.json({
            "inflate": true,
            "strict": true
        }), AuthRoute.findPatients);

        /* ===== 404 Error handling ===== */
        this.use(DefaultRouter._404);
    }

    static defaultOptions()
    {
        return { "caseSensitive": true, "strict": true };
    }
};