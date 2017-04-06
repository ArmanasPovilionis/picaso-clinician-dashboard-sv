"use strict"
/*
 const reqModel = {
 "authenticate_user": {
 "service": "clinician_dashboard",
 "username": "name",
 "password": "pwd"
 }
 };
 const resModel = {
 "success": true,
 "message": "authenticated",
 "cookie": [{
 "cookie_name": "picaso_user",
 "cookie_value": "129aaasaA1q846912"
 }]
 };
 */
const patients = [
    {
        "Display": "Sawyer",
        "pid": "1"
    },
    {
        "Display": "Tyrone",
        "pid": "2"
    },
    {
        "Display": "Blaze",
        "pid": "3"
    }
];
module.exports = class AuthenticationManager {
    constructor() {

    }

// HTTP Method POST ?
// HTTP return status codes? 200/401?
// HTTP access control (CORS)? allow or jsonp or proxy?

    login(req) {
        if (req && req.authenticate_user &&
            req.authenticate_user.username === "test" &&
            req.authenticate_user.password === "test" &&
            req.authenticate_user.service === "clinician_dashboard"
        ) {
            return {
                "success": true,
                "message": "authenticated",
                "cookie": [
                    {
                        "name": "picaso_user",
                        "value": "129aaasaA1q846912"
                    }
                ]
            };
        }
        else {
            return {
                "success": false,
                "message": "failed to authenticate"
            };
        }
    }

// HTTP Method GET ?
// HTTP return status codes? 200?
// HTTP access control (CORS)? allow or jsonp or proxy?
// return Patient array or empty array

    findPatients(req) {
        let upid = req.identify_user.UPID;
        //filter based on upid (ACL and relation)
        return patients;
    }

// token?
// HTTP Method POST ?
// HTTP return status codes? 200?
// HTTP access control (CORS)? allow or jsonp or proxy?

    identify(req) {
        if (req && req.identify_user && req.identify_user.token === "129aaasaA1q846912") {
            return {
                "success": true,
                "message": "identified",
                "data": {
                    "UPID": "alfanumber",
                    "role": ["cardiologist"]
                }
            };
        }
        return {
            "success": false,
            "message": "not identified",
        };
    }

    logout() {
        return true;
    }

};