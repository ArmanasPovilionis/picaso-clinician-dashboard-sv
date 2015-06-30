"use strict";

module.exports = function (request, response, next)
{
    response.set("X-Powered-By", request.app.get("pkg").name + "/" +
        request.app.get("pkg").version + " (" +
        request.app.get("pkg").description + ")");
    next();
};