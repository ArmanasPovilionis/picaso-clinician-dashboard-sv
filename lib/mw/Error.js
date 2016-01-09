"use strict";

module.exports = class Error {

    static logger (error, request, response, next)
    {
        const debug = require("debug")(request.app.get("pkg").name);
        debug(error.message);
        next(error);
    }

    static renderer (error, request, response, next)
    {
        let util = require("util");
        response.charset = "utf-8";
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
                response.render("_500", {
                    menu_name: "",
                    header: util.format("HTTP error status: %s ", error.status),
                    request: request,
                    error: error
                });
            },
            "application/xhtml+xml": function ()
            {
                response.render("_500", {
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
    }

};
