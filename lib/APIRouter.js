"use strict";

const parser = require("body-parser");
const DefaultRouter = require("./DefaultRouter");

module.exports = class APIRouter extends require("express").Router
{
    constructor(opts = APIRouter.defaultOptions())
    {
        super(opts);
        this.all("*", DefaultRouter.xPoweredBy);
        /* ===== 404 Error handling ===== */
        this.use(DefaultRouter._404);
    }

    static defaultOptions()
    {
        return { "caseSensitive": true, "strict": true };
    }
};