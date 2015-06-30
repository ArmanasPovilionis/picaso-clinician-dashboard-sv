"use strict";

module.exports = function (error, request, response, next)
{
    let util = require("util");
    response.charset = "utf-8";
    if (response.statusCode === 405)
    {
        response.set("Allow", "GET");
    }
    if (response.status < 400)
    {
        response.status(500);
    }
    response.format({
        "text/plain": function ()
        {
            response.type("text/plain");
            response.send(error.message);
        },
        "text/html": function ()
        {
            response.render("e500", {
                menu_name: "",
                header: util.format("HTTP error status: %s ", error.status),
                request: request,
                error: error
            });
        },
        "application/xhtml+xml": function ()
        {
            response.render("e500", {
                menu_name: "",
                header: util.format("HTTP error status: %s ", error.status),
                request: request,
                error: error
            });
        },
        "application/json": function ()
        {
            response.json({"error": error.message});
        },
        "default": function ()
        {
            response.type("text/plain");
            response.send(error.message);
        }
    });
};