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
    }

    static defaultOptions()
    {
        return { "caseSensitive": true, "strict": true };
    }
};