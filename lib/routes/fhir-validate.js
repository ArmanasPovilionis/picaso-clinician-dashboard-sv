"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const uuid = require("uuid");
const httpError = require("http-errors");

module.exports = class FHIRValidate
{
    static validate (request, response, next)
    {
        switch (request.method)
        {
            case "POST":
                try{
                    let json = request.body;
                    let fhir = require('fhir-validator');
                    // Run the validation on the resource
                    let result = fhir.validate(json);
                    // Use the validation result
                    let valid = true;
                    if(result.errors.length>0)
                        valid = false;
                    let res = {
                        valid: valid,
                        errors: result.errors
                    };
                    console.log(res);
                    response.format(
                        {
                            "application/json": () =>
                            {
                                response.status(200).json(res);
                            },
                            "default": () => { next(new httpError.NotAcceptable()); }
                        });
                }
                catch(err){
                    next(new httpError.InternalServerError(err.message));
                }
                break;
            default:
                response.set("allow", "POST");
                next(new httpError.MethodNotAllowed());
                break;
        }
    }


};