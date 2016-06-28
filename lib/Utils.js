"use strict";

module.exports = class Utils {
    static argsParser(config)
    {
        const nopt = require("nopt");
        const opts = {
            "-db:hosts": [ nopt.typeDefs.String, Array, null ],
            "-db:port": [ nopt.typeDefs.Number, null ],
            "-db:ks": [ nopt.typeDefs.String, null ]
        };
        const args = nopt(opts);
        if(args.hasOwnProperty("db:hosts"))
        {
            config["database"]["clientOptions"]["contactPoints"] = args["db:hosts"].split(",");
        }
        if(args.hasOwnProperty("db:port"))
        {
            config["database"]["clientOptions"]["protocolOptions"]["port"] = args["db:port"];
        }
        if(args.hasOwnProperty(args, "db:ks"))
        {
            config["database"]["clientOptions"]["keyspace"] = args["db:ks"];
        }
    }

    static launcher(worker, pkg, config)
    {
        const app = new (require("./DefaultApp"))(worker, pkg, config);
        worker.process.title = `${pkg.name}:${worker.id}`;
        app.start();
    }
};