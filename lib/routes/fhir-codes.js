"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const uuid = require("uuid");
const httpError = require("http-errors");
const valuesets = require("./valuesets/valuesets.json");

var valuesetsArray = {};

valuesets.entry.forEach(entry => {
    if(entry.fullUrl && entry.resource.concept){
        let concepts = entry.resource.concept;
        let values= {};
        concepts.forEach(concept => {
            values[concept.code] = {
                display: concept.display,
                definition: concept.definition
            }
        });
        valuesetsArray[entry.resource.valueSet] = values;
    }
});

module.exports = class FHIRCodes
{
    static getValueSet (request, response, next)
    {
        switch (request.method)
        {
            case "GET":
                try{
                    let system = request.params.system;
                    let valueset = valuesetsArray[system];
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
                    let valueset = valuesetsArray[system];
                    response.format(
                        {
                            "application/json": () =>
                            {
                                response.status(200).json(valueset[code].display);
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