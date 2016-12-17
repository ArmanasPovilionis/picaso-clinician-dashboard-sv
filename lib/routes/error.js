"use strict";

const httpError = require("http-errors");

module.exports = function (request, response, next)
{
    next(new httpError.InternalServerError("This is a provoked server error!"));
};