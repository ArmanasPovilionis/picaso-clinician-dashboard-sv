"use strict"
var request = require('sync-request');

const patients = [
    {
        "display": "Sawyer",
        "UPID": "1"
    },
    {
        "display": "Tyrone",
        "UPID": "2"
    },
    {
        "display": "Blaze",
        "UPID": "3"
    }
];
module.exports = class AuthenticationManager {
    constructor() {

    }
    // ────────────────────────────────────────────────────────────────────────────────
    login(req) {    
        //
        // ─── LOGIN API DESCRIPTION ──────────────────────────────────────────────────────
        /*
        1) Authentication Request:
            { "authenticate_user": {
                “service”: ”service-name”,
                "username": "name",
                "password": “pwd"
                }
            };
        // • • • • •
        2) Authentication Response:
            {"success": true,
                "message": "authenticated",
                "cookie": [
                    {
                        "name": "picaso-user",
                        "value": "129aaasaAhgfhgfhg1q846912"
                    }
                ]
            };
        // ─────────────────────────────────────────────────────────────────
        */
        var l1 = { "authenticate-user": {                                       // 1) formulation of the request for login   
                        "service": req.authenticate_user.service,       
                        "username": req.authenticate_user.username,
                        "password": req.authenticate_user.password
                    }
                };
        console.log("--"+Date.now()+"-- Authentication request:");
        console.log("\t Service: "+req.authenticate_user.service);
        console.log("\t Username: "+req.authenticate_user.username);
   
        var res = request('POST', 'http://192.168.160.121:80/UPID', {           // URL of Identity Manager
        json: l1
        });

        var response = JSON.parse(res.getBody('utf8'));                         // Response parser
        console.log("--"+Date.now()+"-- Authentication response:")
        console.log("Response status code: "+res.statusCode);
        console.log("Response: "+response);
        
        return response;
    }
    // ────────────────────────────────────────────────────────────────────────────────
    identify(req) {
        //
        // ─── IDENTIFY API DESCRIPTION ───────────────────────────────────────────────────
        /*
        1) Identification Request:
            {"identify-user":{
                "token": “the value of the cookie picaso_user”
                }
            }
        // • • • • •
        2) Identification Response:
            {“success”: true,
                “message”: “identified”, 
                “data”: [{
                    “UPID”: “alfanumber”,
                    “role”: [“alfanumber”, “alfanumber”, “alfanumber”, …]
                    }]
            }
        // ────────────────────────────────────────────────────────────────────────────────
        */
        var l1 = {"identify-user":{                                             // 1) formulation of the request for identification   
                    "token": req.identify_user.token
                    }
                };

        console.log("--"+Date.now()+"-- Identification request:");
        console.log("\t token: "+req.identify_user.token);
   
        var res = request('POST', 'http://192.168.160.121:80/UPID', {           // URL of Identity Manager
        json: l1
        });

        var response = JSON.parse(res.getBody('utf8'));                         // Response parser
        console.log("--"+Date.now()+"-- Authentication response:")
        console.log("Response status code: "+res.statusCode);
        console.log("Response: "+response);
        
        return response;
    }
    // ────────────────────────────────────────────────────────────────────────────────
    logout() {
        return true;
    }
    // ────────────────────────────────────────────────────────────────────────────────
    findPatients(upid) {
        //filter based on upid (ACL and relation)
        return patients;
    }
    // ────────────────────────────────────────────────────────────────────────────────

};