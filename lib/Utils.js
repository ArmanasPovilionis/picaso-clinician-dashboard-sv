"use strict";

module.exports = class Utils {

    static argsParser(config)
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

    static launcher(worker, pkg, config)
    {
        worker.process.title = pkg.name + ":" + worker.id;
        let app = new (require("./DefaultApp"))(worker, pkg, config);
        app.start();
    }

};
