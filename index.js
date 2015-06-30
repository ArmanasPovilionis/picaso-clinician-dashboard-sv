"use strict";

var cassandra = require("cassandra-driver");
var domain = require("domain");
var main = domain.create();

main.on("error", function (error)
{
    if(error instanceof cassandra.errors.NoHostAvailableError)
    {
        console.error("[main:db] " + JSON.stringify(error.innerErrors, null, 0));
    }
    else
    {
        console.error("[main] " + error.message);
        console.error("[main]\n" + error.stack);
    }
    process.exit(1);
});

main.run(function ()
{
    let cluster = require("cluster");
    let cpus = require("os").cpus().length;
    let path = require("path");
    let app = require("express")();

    let pkg = require(path.join(__dirname, "package.json"));
    let config = require(path.join(__dirname, "config", "start.json"));
    let debug = require("debug")(pkg.name);

    process.title = pkg.name;
    parseArgs(config);
    if(config.http.secure)
    {
        let https = require("https");
        https.globalAgent.maxSockets = 16384;
        https.globalAgent.options.agent = false;
    }
    else
    {
        let http = require("http");
        http.globalAgent.maxSockets = 16384;
        http.globalAgent.options.agent = false;
    }

    if (cluster.isMaster)
    {
        let client = new cassandra.Client(config["database"]);
        client.connect(function (error)
        {
            if(error)
            {
                throw error;
            }
            else
            {
                for (let i = 0; i < cpus; ++i)
                {
                    cluster.fork();
                }
            }
        });
    }
    else
    {
        launcher(app, cluster.worker, pkg, config);
    }

    cluster.on("fork", function(worker)
    {
    });

    cluster.on("disconnect", function()
    {
    });

    cluster.on("exit", function(worker, code, signal)
    {
        console.error("Worker with id: " + worker.id + " died.");
        console.error("Code: " + code);
        console.error("Signal: " + signal);
        // restart may be possible
        // cluster.fork();
    });
});

function launcher(app, worker, pkg, config)
{
    let d = domain.create();
    worker.process.title = pkg.name + ":" + worker.id;

    d.on("error", function (error)
    {
        let id = "[main:" + worker.id + "] ";
        console.error(id + error.message);
        console.error(id + "\n" + error.stack);
        worker.process.exit(worker.id);
    });
    d.run(function ()
    {
        require("./lib/configure")(app, worker, pkg, config, __dirname);
        require("./lib/start")(app, worker, config, __dirname);
    });
}

function parseArgs(config)
{
    let _ = require("underscore");
    let nopt = require("nopt");
    let opts = {
        "-db:hosts": [ nopt.typeDefs.String, Array, null ],
        "-db:port": [ nopt.typeDefs.Number, null ],
        "-db:ks": [ nopt.typeDefs.String, null ]
    };
    let args = nopt(opts);
    if(_.has(args, "db:hosts"))
    {
        config["database"]["contactPoints"].length = 0;
        if(_.isArray(args["db:hosts"]))
        {
            _.each(args["db:hosts"], function (host)
            {
                config["database"]["contactPoints"].push(host);
            })
        }
        else
        {
            config["database"]["contactPoints"].push(args["db:hosts"]);
        }
    }
    if(_.has(args, "db:port"))
    {
        config["database"]["protocolOptions"]["port"] = args["db:port"];
    }
    if(_.has(args, "db:ks"))
    {
        config["database"]["keyspace"] = args["db:ks"];
    }
}