"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const uuid = require("uuid");
const httpError = require("http-errors");

module.exports = class FHIRResources {
    static getResourceById(request, response, next) {
        switch (request.method) {
            case "GET":
                try {
                    let resourceId = request.params.id;
                    let bundle = require("./fhir-resources-examples/bundle.json");
                    let allResources = bundle.entry;
                    let filtered = allResources.filter(entry => {
                        let resource = entry.resource;
                        return resource.id === resourceId;
                    });
                    response.format(
                        {
                            "application/json": () => {
                                response.status(200).json(filtered);
                            },
                            "default": () => {
                                next(new httpError.NotAcceptable());
                            }
                        });
                }
                catch (err) {
                    next(new httpError.InternalServerError(err.message));
                }
                break;
            default:
                response.set("allow", "GET");
                next(new httpError.MethodNotAllowed());
                break;
        }
    }

    // TODO resolve all references inside the resource
    static getResolvedResourceById(request, response, next) {
        switch (request.method) {
            case "GET":
                try {
                    let resourceId = request.params.id;
                    let bundle = require("./fhir-resources-examples/bundle.json");
                    let allResources = bundle.entry;
                    let filtered = allResources.filter(entry => {
                        let resource = entry.resource;
                        return resource.id === resourceId;
                    });
                    response.format(
                        {
                            "application/json": () => {
                                response.status(200).json(filtered);
                            },
                            "default": () => {
                                next(new httpError.NotAcceptable());
                            }
                        });
                }
                catch (err) {
                    next(new httpError.InternalServerError(err.message));
                }
                break;
            default:
                response.set("allow", "GET");
                next(new httpError.MethodNotAllowed());
                break;
        }
    }
};