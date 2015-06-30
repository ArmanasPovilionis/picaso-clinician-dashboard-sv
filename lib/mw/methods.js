"use strict";

module.exports = function (request, response, next)
{
    let ErrorMessages = "Method %s Not Allowed";
    let util = require("util");
    let error = undefined;

    switch (request.method)
    {
        case "CONNECT":
        case "DELETE":
        case "HEAD":
        case "OPTIONS":
        case "PUT":
        case "TRACE":
        case "POST":
            error = new Error(util.format(ErrorMessages, request.method));
            response.statusCode = 405;
            next(error);
            break;
        case "GET":
        default:
            next();
            break;
    }
};