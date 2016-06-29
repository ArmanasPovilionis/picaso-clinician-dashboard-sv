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
                        request.app.locals.logger(err.message);
                        next();
                    }
                    else
                    {
                        response.statusCode = 204;
                        response.send();
                    }
                });
                break;
            case "PUT":
                let id = request.params.user;
                let userPath = path.join(request.app.locals.users, id);
                fs.readFile(userPath, (err, data) =>
                {
                    if(err)
                    {
                        request.app.locals.logger(err.message);
                        next();
                    }
                    else
                    {
                        let user = Object.assign(JSON.parse(data), request.body);
                        fs.writeFile(userPath, JSON.stringify(user, null, 4), (err) => {
                            if(err)
                            {
                                response.statusCode = 500;
                                next(err);
                            }
                            else
                            {
                                response.status(204).end();
                            }
                        });
                    }
                });
                break;
            case "GET":
                fs.readFile(path.join(request.app.locals.users, request.params.user), (err, data) =>
                {
                    if(err)
                    {
                        request.app.locals.logger(err.message);
                        next();
                    }
                    else
                    {
                        response.statusCode = 200;
                        response.type("application/json").send(data);
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
        try
        {
            fs.accessSync(request.app.locals.users);
            next();
        }
        catch (error)
        {
            request.app.locals.logger(error.message);
            request.app.locals.logger(`Creating new directory: ${request.app.locals.users}`);
            mkdirp(request.app.locals.users, (err) =>
            {
                if (err)
                {
                    request.app.locals.logger(`Error creating new directory: ${request.app.locals.users}`);
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

    static _404 (request, response)
    {
        response.status(404).json({ "error": http.STATUS_CODES[404] })
    }
};