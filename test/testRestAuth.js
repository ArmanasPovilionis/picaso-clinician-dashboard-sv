"use strict";

describe("Auth REST", () =>
{
    const assert = require("assert");
    const request = require("request");
    const uuid = require("uuid");
    const apiURL = "https://localhost:8080/api/picaso/authenticate";
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
    it("login success", (done) =>
    {

        options.uri = apiURL + "/login";
        options.headers = defaultHeaders;
        options.method = "POST";
        options.body = {
            "authenticate_user": {
                "service": "clinician_dashboard",
                "username": "test",
                "password": "test"
            }
        };
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
                assert.strictEqual(body.success, true);
                assert.strictEqual(body.cookie.length, 1);
                assert.strictEqual(response.statusCode, 200);
                assert.strictEqual(response.statusMessage, "OK");
            }
            done();
        });
    });
    it("login fail", (done) =>
    {

        options.uri = apiURL + "/login";
        options.headers = defaultHeaders;
        options.method = "POST";
        options.body = {
            "authenticate_user": {
                "service": "clinician_dashboard",
                "username": "test",
                "password": ""
            }
        };
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
                assert.strictEqual(body.success, false);
                assert.strictEqual(response.statusCode, 401);
                assert.strictEqual(response.statusMessage, "Unauthorized");
            }
            done();
        });
    });
    it("identify success", (done) =>
    {
        options.uri = apiURL + "/identify";
        options.headers = defaultHeaders;
        options.method = "POST";
        options.body = {
            "identify_user": {
                "token": "129aaasaA1q846912"
            }
        };
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
                assert.strictEqual(body.success, true);
                assert.strictEqual(body.data.role.length, 1);
                assert.strictEqual(response.statusCode, 200);
                assert.strictEqual(response.statusMessage, "OK");
            }
            done();
        });
    });
    it("identify fail", (done) =>
    {
        options.uri = apiURL + "/identify";
        options.headers = defaultHeaders;
        options.method = "POST";
        options.body = {
            "identify_user": {
                "token": "test"
            }
        };
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
                assert.strictEqual(body.success, false);
                assert.strictEqual(body.identity, undefined);
                assert.strictEqual(response.statusCode, 404);
                assert.strictEqual(response.statusMessage, "Not Found");
            }
            done();
        });
    });
    it("find patients success", (done) =>
    {
        options.uri = apiURL + "/patients";
        options.headers = defaultHeaders;
        options.method = "npm test";
        options.body = {
            "identify_user": {
                "UPID": "129aaasaA1q846912"
            }
        };
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
                assert.strictEqual(body.success, true);
                assert.strictEqual(body.length, 3);
                assert.strictEqual(response.statusCode, 200);
                assert.strictEqual(response.statusMessage, "OK");
            }
            done();
        });
    });
});