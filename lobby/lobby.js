var http = require("http");
var serverlist = {};

var update = function(server, status) {
    for(var prop in status) {
        server[prop] = status[prop];
    }
};

var updateServers = function() {
    for(var server in serverlist) {
        var options = {
            hostname: serverlist[server].address,
            port: serverlist[server].port,
            path: "/status.json",
            method: "GET"
        };
        console.log("fetching update...");
        (function(index, options){
            var request = http.request(options, function(response) {
                response.on("data", function(data) {
                    var serverStatus = JSON.parse(data);
                    console.log("update: " + data);
                    update(serverlist[index], serverStatus);
                });
                response.on("error", function(e) {
                    console.log("update error: " + e.message);
                });
                request.on("error", function(e) {
                    console.log("server went offline? " + e.message);
                    delete serverlist[index];
                });
            });
            request.end();
        }(server, options));
    }
};

var respond = function(request) {
    if(request.method === "POST") {
        var data = "";
        request.on("data", function(msg) {
            data += msg;
        });
        request.on("end", function() {
            var dataObject;
            try {
                dataObject = JSON.parse(data);
            } catch(e) {
                dataObject = {};
            }
            if(dataObject.type = "auth") {
               console.log(dataObject);
            } else {
                var serverIdentity = dataObject;
                serverIdentity.address = request.connection.remoteAddress;
                console.log(serverIdentity);
                serverlist[serverIdentity.address + serverIdentity.port] = serverIdentity;
            }
        });
        return {"status" : "ok" };
    } else {
        switch(request.url) {
            case "/list":
            return serverlist;
            case "/count":
            return { "players" : 0 };
            default:
            return { "error" : "404" };
        }
    }
};

var server = http.createServer(function(req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    var response = respond(req);
    res.end(JSON.stringify(response));
});

setInterval(updateServers, 20000);
server.listen(10138);