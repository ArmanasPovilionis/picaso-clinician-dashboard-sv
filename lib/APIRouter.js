"use strict";

const parser = require("body-parser");
const Users = require("./routes/users");
const DefaultRouter = require("./DefaultRouter");

module.exports = class APIRouter extends require("express").Router
{
    constructor(opts = APIRouter.defaultOptions())
    {
        super(opts);
        this.all("*", DefaultRouter.xPoweredBy);
        this.all("/users/:user",
            parser.json({ "inflate": true, "strict": true }),
            Users.createStorageDirectory, Users.user);
        this.all("/users",
            parser.json({ "inflate": true, "strict": true }),
            Users.createStorageDirectory, Users.users);

        /* ===== 404 Error handling ===== */
        this.use(DefaultRouter._404);
    }

    static defaultOptions()
    {
        return { "caseSensitive": true, "strict": true };
    }
};