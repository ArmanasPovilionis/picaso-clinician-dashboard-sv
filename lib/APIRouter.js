"use strict";

const Users = require("./routes/users");
const DefaultRouter = require("./DefaultRouter");

module.exports = class APIRouter extends require("express").Router
{
    constructor(opts)
    {
        super(opts || APIRouter.defaultOptions());
        this.all("/users/:user", DefaultRouter.xPoweredBy, Users.createStorageDirectory, Users.user);
        this.all("/users", DefaultRouter.xPoweredBy, Users.createStorageDirectory, Users.users);

        /* ===== 404 Error handling ===== */
        this.use(Users._404);
    }

    static defaultOptions()
    {
        return { "caseSensitive": true, "strict": true };
    }
};