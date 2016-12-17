"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const mkdirp = require("mkdirp");
const uuid = require("uuid");
const httpError = require("http-errors");

module.exports = class Users
{
    static users (request, response, next)
    {
        switch (request.method)
        {
            case "GET":
                fs.readdir(request.app.locals.users, (err, files) =>
                {
                    if(err)
                    {
                        next(new httpError.InternalServerError(err.message));
                    }
                    else
                    {
                        response.format(
                        {
                            "application/json": () =>
                            {
                                response.status(200).json({ "users": files });
                            },
                            "default": () => { next(new httpError.NotAcceptable()); }
                        });
                    }
                });
                break;
            case "POST":
                let id = uuid.v1();
                let user = Object.assign({ "id": id }, request.body);
                fs.writeFile(path.join(request.app.locals.users, id), JSON.stringify(user, null, 4), (err) => {
                    if(err)
                    {
                        next(new httpError.InternalServerError(err.message));
                    }
                    else
                    {
                        response.set("location", `${request.originalUrl}/${id}`);
                        response.format(
                        {
                            "application/json": () =>
                            {
                                response.status(201).json(user);
                            },
                            "default": () => { next(new httpError.NotAcceptable()); }
                        });
                    }
                });
                break;
            case "CONNECT":
            case "DELETE":
            case "HEAD":
            case "OPTIONS":
            case "PUT":
            case "TRACE":
            default:
                response.set("allow", "GET, POST");
                next(new httpError.MethodNotAllowed());
                break;
        }
    }

    static user (request, response, next)
    {
        switch (request.method)
        {
            case "DELETE":
                fs.unlink(path.join(request.app.locals.users, request.params.user), (err) =>
                {
                    if(err)
                    {
                        next(new httpError.InternalServerError(err.message));
                    }
                    else
                    {
                        response.status(204).send();
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
                        next(new httpError.NotFound(err.message));
                    }
                    else
                    {
                        let user = Object.assign(JSON.parse(data), request.body);
                        fs.writeFile(userPath, JSON.stringify(user, null, 4), (err) => {
                            if(err)
                            {
                                next(new httpError.InternalServerError(err.message));
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
                        next(new httpError.NotFound(err.message));
                    }
                    else
                    {
                        response.format(
                        {
                            "application/json": () =>
                            {
                                response.status(200).type("application/json").send(data);
                            },
                            "default": () => { next(new httpError.NotAcceptable()); }
                        });
                    }
                });
                break;
            case "CONNECT":
            case "HEAD":
            case "OPTIONS":
            case "POST":
            case "TRACE":
            default:
                response.set("allow", "GET, PUT, DELETE");
                next(new httpError.MethodNotAllowed());
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
                    next(new httpError.InternalServerError(err.message));
                }
                else
                {
                    next();
                }
            })
        }
    }
};