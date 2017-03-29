"use strict";

describe("express4-skeleton", () =>
{
    const assert = require("assert");
    const request = require("request");
    const uuid = require("uuid");
    const apiURL = "https://localhost:8080/api/fhir";
    const defaultHeaders = { "Content-Type": "application/json", "Accept": "application/json" };
    const options = {
        "uri": apiURL,
        "method": "POST",
        "headers": defaultHeaders,
        "body": {},
        "gzip": true,
        "json": true,
        "strictSSL": false,
        "encoding": "utf8",
        "timeout": 10000
    };
    it("GET a valueset", (done) =>
    {
        options.uri = apiURL + "/coding/http%3A%2F%2Fhl7.org%2Ffhir%2FValueSet%2Faudit-entity-type";
        options.headers = defaultHeaders;
        options.method = "GET";
        options.body = undefined;
        request(options, (error, response, body) =>
        {
            if (error)
            {
                console.error(error.message);
            }
            else
            {
                assert.strictEqual(error, null);
                assert.strictEqual(typeof body, "object");
                assert.strictEqual(Object.keys(body).length, 4);
                assert.strictEqual(response.statusCode, 200);
                assert.strictEqual(response.statusMessage, "OK");
            }
            done();
        });
    });
    it("GET a code from a valueset", (done) =>
    {
        options.uri = apiURL + "/coding/http%3A%2F%2Fhl7.org%2Ffhir%2FValueSet%2Faudit-entity-type/3";
        options.headers = defaultHeaders;
        options.method = "GET";
        options.body = undefined;
        request(options, (error, response, body) =>
        {
            if (error)
            {
                console.error(error.message);
            }
            else
            {
                assert.strictEqual(error, null);
                assert.strictEqual(typeof body, "string");
                assert.strictEqual(response.statusCode, 200);
                assert.strictEqual(response.statusMessage, "OK");
            }
            done();
        });
    });
});