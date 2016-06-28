"use strict";

const mkdirp = require("mkdirp");
const uuid = require("uuid");
const fs = require("fs");
const http = require("http");
const path = require("path");

module.exports = class Users
{
    static users (request, response, next)
    {
        switch (request.method)
        {
            case "CONNECT":
            case "DELETE":
            case "HEAD":
            case "OPTIONS":
            case "PUT":
            case "TRACE":
                response.set("allow", "GET, POST");
                response.statusCode = 405;
                next(new Error(http.STATUS_CODES[405]));
                break;
            case "GET":
                fs.readdir(request.app.locals.users, (err, files) =>
                {
                    if(err)
                    {
                        response.statusCode = 500;
                        next(err);
                    }
                    else
                    {
                        response.statusCode = 200;
                        response.json({ "users": files });
                    }
                });
                break;
            case "POST":
                let id = uuid.v1();
                let user = Object.assign({ "id": id }, request.body);
                fs.writeFile(path.join(request.app.locals.users, id), JSON.stringify(user, null, 4), (err) => {
                    if(err)
                    {
                        response.statusCode = 500;
                        next(err);
                    }
                    else
                    {
                        response.set("location", `${request.originalUrl}/${id}`);
                        response.statusCode = 201;
                        response.json(user);
                    }
                });
                break;
            default:
                response.set("allow", "GET, POST");
                response.statusCode = 405;
                next(new Error(http.STATUS_CODES[405]));
                break;
        }
    }

    static user (request, response, next)
    {
        switch (request.method)
        {
            case "CONNECT":
            case "HEAD":
            case "OPTIONS":
            case "POST":
            case "TRACE":
                response.set("allow", "DELETE, GET, PUT");
                response.statusCode = 405;
                next(new Error(http.STATUS_CODES[405]));
                break;
            case "DELETE":
                fs.unlink(path.join(request.app.locals.users, request.params.user), (err) =>
                {
                    if(err)
                    {
                        response.statusCode = 500;
                        next(err);
                    }
                    else
                    {
                        response.statusCode = 204;
                        response.send();
                    }
                });
                break;
            case "PUT":
            case "GET":
                fs.readFile(path.join(request.app.locals.users, request.params.user), (err, data) =>
                {
                    if(err)
                    {
                        response.statusCode = 500;
                        next(err);
                    }
                    else
                    {
                        response.statusCode = 200;
                        response.send(data);
                    }
                });
                break;
            default:
                response.set("allow", "DELETE, GET, POST");
                response.statusCode = 405;
                next(new Error(http.STATUS_CODES[405]));
                break;
        }
    }

    static createStorageDirectory (request, response, next)
    {
        const debug = require("util").debuglog(request.app.locals.pkg.name);
        try
        {
            fs.accessSync(request.app.locals.users);
            next();
        }
        catch (error)
        {
            debug(error.message);
            debug(`Creating new directory: ${request.app.locals.users}`);
            mkdirp(request.app.locals.users, (err) =>
            {
                if (err)
                {
                    debug(`Error creating new directory: ${request.app.locals.users}`);
                    response.statusCode = 500;
                    next(err);
                }
                else
                {
                    next();
                }
            })
        }
    }
};