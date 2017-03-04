"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const uuid = require("uuid");
const httpError = require("http-errors");
const valuesets = {
    "http://snomed.info/sct" : {
        src: "./valuesets/participant-role.json",
        value: null
    },
    "http://hl7.org/fhir/ValueSet/event-timing" : {
        src: "./valuesets/event-timing.json",
        value: null
    }
};
module.exports = class FHIRCodes
{
    static getValueSet (request, response, next)
    {
        switch (request.method)
        {
            case "GET":
                try{
                    let system = request.params.system;
                    let valueset = require(valuesets[system].src);
                    response.format(
                        {
                            "application/json": () =>
                            {
                                response.status(200).json(valueset);
                            },
                            "default": () => { next(new httpError.NotAcceptable()); }
                        });
                }
                catch(err){
                    next(new httpError.InternalServerError(err.message));
                }
                break;
            default:
                response.set("allow", "GET");
                next(new httpError.MethodNotAllowed());
                break;
        }
    }

    static getCodeValue (request, response, next)
    {
        switch (request.method)
        {
            case "GET":
                try{
                    let system = request.params.system;
                    let code = request.params.code;
                    let valueset = require(valuesets[system].src);
                    response.format(
                        {
                            "application/json": () =>
                            {
                                response.status(200).json(valueset[code].Display);
                            },
                            "default": () => { next(new httpError.NotAcceptable()); }
                        });
                }
                catch(err){
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