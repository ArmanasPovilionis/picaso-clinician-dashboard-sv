"use strict";

module.exports = function (request, response)
{
    response.render("fhir-validate-page", {
        "menu_name": "Validate",
        "header": "Validate"
    });
};