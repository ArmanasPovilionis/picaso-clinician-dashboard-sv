"use strict";

describe("express4-skeleton", () =>
{
    const assert = require("assert");
    const request = require("request");
    const uuid = require("uuid");
    const apiURL = "https://localhost:8080/api/users";
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
    let user = {
        "name": "John Doe"
    };
    it("POST a valid user with invalid Accept header (406)", (done) =>
    {
        options.headers = { "Content-Type": "application/json", "Accept": "application/xml" };
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
                assert.strictEqual(typeof body, "string");
                assert(response.headers.hasOwnProperty("location"));
                assert.strictEqual(response.statusCode, 406);
                assert.strictEqual(response.statusMessage, "Not Acceptable");
            }
            done();
        });
    });
    it("POST a valid user (201)", (done) =>
    {
        options.headers = defaultHeaders;
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
                assert.strictEqual(Object.keys(body).length, 2);
                assert(response.headers.hasOwnProperty("location"));
                assert.strictEqual(response.statusCode, 201);
                assert.strictEqual(response.statusMessage, "Created");
                user = body;
            }
            done();
        });
    });
    it("POST an invalid user (400)", (done) =>
    {
        options.headers = defaultHeaders;
        options.body = uuid.v1();
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
                assert.strictEqual(response.statusCode, 400);
                assert.strictEqual(response.statusMessage, "Bad Request");
            }
            done();
        });
    });
    it("Invalid method by /api/users (405)", (done) =>
    {
        options.headers = defaultHeaders;
        options.method = "TRACE";
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
                assert(body.hasOwnProperty("error"));
                assert.strictEqual(response.statusCode, 405);
                assert.strictEqual(response.statusMessage, "Method Not Allowed");
            }
            done();
        });
    });
    it("GET all users (200)", (done) =>
    {
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
                assert.strictEqual(Object.keys(body).length, 1);
                assert(body.hasOwnProperty("users"));
                assert(Array.isArray(body.users));
                assert.strictEqual(response.statusCode, 200);
                assert.strictEqual(response.statusMessage, "OK");
            }
            done();
        });
    });
    it("GET all users with invalid Accept header (406)", (done) =>
    {
        options.headers = { "Content-Type": "application/json", "Accept": "application/xml" };
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
                assert.strictEqual(response.statusCode, 406);
                assert.strictEqual(response.statusMessage, "Not Acceptable");
            }
            done();
        });
    });
    it("GET a valid user (200)", (done) =>
    {
        options.uri = `${apiURL}/${user.id}`;
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
                assert.strictEqual(Object.keys(body).length, 2);
                assert.strictEqual(response.statusCode, 200);
                assert.strictEqual(response.statusMessage, "OK");
            }
            done();
        });
    });
    it("GET a valid user with invalid Accept header (406)", (done) =>
    {
        options.uri = `${apiURL}/${user.id}`;
        options.headers = { "Content-Type": "application/json", "Accept": "application/xml" };
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
                assert.strictEqual(response.statusCode, 406);
                assert.strictEqual(response.statusMessage, "Not Acceptable");
            }
            done();
        });
    });
    it("Update (PUT) a valid user (204)", (done) =>
    {
        options.uri = `${apiURL}/${user.id}`;
        options.headers = defaultHeaders;
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
    it("Verify (GET) a modified user (200)", (done) =>
    {
        options.uri = `${apiURL}/${user.id}`;
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
                assert.strictEqual(body.name, "Jane Doe");
                assert.strictEqual(Object.keys(body).length, 2);
                assert.strictEqual(response.statusCode, 200);
                assert.strictEqual(response.statusMessage, "OK");
            }
            done();
        });
    });
    it("Invalid method by /api/users/:user (405)", (done) =>
    {
        options.headers = defaultHeaders;
        options.method = "TRACE";
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
                assert(body.hasOwnProperty("error"));
                assert.strictEqual(response.statusCode, 405);
                assert.strictEqual(response.statusMessage, "Method Not Allowed");
            }
            done();
        });
    });
    it("GET an invalid user (404)", (done) =>
    {
        options.uri = `${apiURL}/${uuid.v1()}`;
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
        options.headers = defaultHeaders;
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
    it("DELETE a valid user (204)", (done) =>
    {
        options.uri = `${apiURL}/${user.id}`;
        options.headers = defaultHeaders;
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