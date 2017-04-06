"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const uuid = require("uuid");
const httpError = require("http-errors");
const AuthenticationManager = require("./AuthManager");
let authManager = new AuthenticationManager();

module.exports = class AuthRoute {
    static findPatients(request, response, next) {
        switch (request.method) {
            case "POST":
                let upid = request.body.identify_user.UPID;
                response.format(
                    {
                        "application/json": () => {
                            response.status(200).json(authManager.findPatients(upid));
                        },
                        "default": () => {
                            next(new httpError.NotAcceptable());
                        }
                    });
                break;
            case "GET":
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

    static login(request, response, next) {
        switch (request.method) {
            case "POST":
                let json = request.body;
                let data = authManager.login(json);
                if (data.success) {
                    response.format(
                        {
                            "application/json": () => {
                                response.status(200).type("application/json").send(data);
                            },
                            "default": () => {
                                next(new httpError.NotAcceptable());
                            }
                        });
                }
                else {
                    response.format(
                        {
                            "application/json": () => {
                                response.status(401).type("application/json").send(data);
                            },
                            "default": () => {
                                next(new httpError.NotAcceptable());
                            }
                        });
                }

                break;
            case "CONNECT":
            case "DELETE":
            case "HEAD":
            case "OPTIONS":
            case "PUT":
            case "TRACE":
            default:
                response.set("allow", "GET, PUT, DELETE");
                next(new httpError.MethodNotAllowed());
                break;
        }
    }

    static identify(request, response, next) {
        switch (request.method) {
            case "POST":
                let json = request.body;
                let data = authManager.identify(json);
                if (data.success) {
                    response.format(
                        {
                            "application/json": () => {
                                response.status(200).type("application/json").send(data);
                            },
                            "default": () => {
                                next(new httpError.NotAcceptable());
                            }
                        });
                }
                else {
                    response.format(
                        {
                            "application/json": () => {
                                response.status(404).type("application/json").send(data);
                            },
                            "default": () => {
                                next(new httpError.NotAcceptable());
                            }
                        });
                }

                break;
            default:
                response.set("allow", "GET, PUT, DELETE");
                next(new httpError.MethodNotAllowed());
                break;
        }
    }
 };