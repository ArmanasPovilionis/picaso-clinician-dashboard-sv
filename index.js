"use strict";

const cassandra = require("cassandra-driver");
const cluster = require("cluster");
const cpus = require("os").cpus().length;
const path = require("path");
const Utils = require("./lib/Utils");
const config = require(path.join(__dirname, "config", "start.json"));
const pkg = require(path.join(__dirname, "package.json"));
const debug = require("debug")(pkg.name);

process.title = pkg.name;
config.basedir = __dirname;
Utils.argsParser(config);
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
    Utils.launcher(cluster.worker, pkg, config);
}

cluster.on("fork", function(worker)
{
});

cluster.on("disconnect", function()
{
});

cluster.on("error", function(error)
{
    debug(error);
});

cluster.on("exit", function(worker, code, signal)
{
    debug("Worker with id: " + worker.id + " died.");
    debug("Code: " + code);
    debug("Signal: " + signal);
    // restart may be possible
    // cluster.fork();
});

process.on("uncaughtException", function (error)
{
    if(error instanceof cassandra.errors.NoHostAvailableError)
    {
        debug(JSON.stringify(error.innerErrors, null, 0));
    }
    else
    {
        debug(error.message);
        debug(error.stack);
    }
    process.exit(1);
});
