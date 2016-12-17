"use strict";

describe("express4-skeleton", () =>
{
    const assert = require("assert");
    const request = require("request");
    const uuid = require("uuid");
    const apiURL = "https://localhost:8080/api/users";
    const options = {
        "uri": apiURL,
        "method": "POST",
        "headers": { "Content-Type": "application/json", "Accept": "application/json" },
        "body": {},
        "gzip": true,
        "json": true,
        "strictSSL": false,
        "encoding": "utf8",
        "timeout": 10000
    };
    let user = {
        "name": "John Doe"
    };
    it("POST a valid user", (done) =>
    {
        options.body = user;
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
                assert(Object.keys(body).length);
                assert.strictEqual(response.statusCode, 201);
                assert.strictEqual(response.statusMessage, "Created");
                user = body;
            }
            done();
        });
    });
    it("GET a valid user", (done) =>
    {
        options.uri = `${apiURL}/${user.id}`;
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
                assert(Object.keys(body).length);
                assert.strictEqual(response.statusCode, 200);
                assert.strictEqual(response.statusMessage, "OK");
            }
            done();
        });
    });
    it("Update (PUT) a valid user", (done) =>
    {
        options.uri = `${apiURL}/${user.id}`;
        options.method = "PUT";
        options.body = {
            "name": "Jane Doe"
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
                assert.strictEqual(typeof body, "undefined");
                assert.strictEqual(response.statusCode, 204);
                assert.strictEqual(response.statusMessage, "No Content");
            }
            done();
        });
    });
    it("Verify (GET) a modified user", (done) =>
    {
        options.uri = `${apiURL}/${user.id}`;
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
                assert.strictEqual(body.name, "Jane Doe");
                assert(Object.keys(body).length);
                assert.strictEqual(response.statusCode, 200);
                assert.strictEqual(response.statusMessage, "OK");
            }
            done();
        });
    });
    it("GET an invalid user (404)", (done) =>
    {
        options.uri = `${apiURL}/${uuid.v1()}`;
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
                assert(Object.keys(body).length);
                assert(body.hasOwnProperty("error"));
                assert.strictEqual(response.statusCode, 404);
                assert.strictEqual(response.statusMessage, "Not Found");
            }
            done();
        });
    });
    it("PUT an invalid user (404)", (done) =>
    {
        options.uri = `${apiURL}/${uuid.v1()}`;
        options.method = "PUT";
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
                assert(Object.keys(body).length);
                assert(body.hasOwnProperty("error"));
                assert.strictEqual(response.statusCode, 404);
                assert.strictEqual(response.statusMessage, "Not Found");
            }
            done();
        });
    });
    it("DELETE a valid user", (done) =>
    {
        options.uri = `${apiURL}/${user.id}`;
        options.method = "DELETE";
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
                assert.strictEqual(typeof body, "undefined");
                assert.strictEqual(response.statusCode, 204);
                assert.strictEqual(response.statusMessage, "No Content");
            }
            done();
        });
    });
});