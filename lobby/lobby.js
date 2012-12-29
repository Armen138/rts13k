var http = require("http"),
    https = require("https");
var serverlist = {};
var sessions = {};
var update = function(server, status) {
    for(var prop in status) {
        server[prop] = status[prop];
    }
};
/*
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
                    try {
                        var serverStatus = JSON.parse(data);
                        console.log("update: " + data);
                        update(serverlist[index], serverStatus);
                    } catch(e) {
                        console.log("invalid data: " + data);
                    }
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
*/

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

var authenticate = function(assertion, res) {
    var content = JSON.stringify({
        "assertion": assertion,
        "audience": "http://13tanks.com:80"
    });//"assertion=" + assertion + "&audience=http://dev138.info:80";
    var options = {
        hostname: "verifier.login.persona.org",
        port: "443",
        path: "/verify",
        method: "POST",
        headers: {
            "Content-Length": content.length,
            "Content-Type": "application/json"
        }
    };
    var request = https.request(options, function(response){
        var data = "";
        response.on("data", function(d) {
            data += d;
        });
        response.on("end", function() {
            console.log(data);
            var identity = JSON.parse(data);
            identity.session = generateUUID();
            sessions[identity.session] = identity;
            res.end(JSON.stringify(identity));
        });
    });
    request.write(content);
    request.end();
};

var respond = function(request, res) {
    if(request.method === "POST") {
        console.log("post got");
        console.log('HEADERS: ' + JSON.stringify(request.headers));
        var data = "";
        request.on("data", function(msg) {
            data += msg;
        });
        request.on("end", function() {
            var dataObject;
            try {
                dataObject = JSON.parse(data);
            } catch(e) {
                console.log("invalid data: " + data);
                dataObject = {};
            }
            if(dataObject.type === "ident") {
                res.end(JSON.stringify(sessions[dataObject.session]));
                return;
            }
            if(dataObject.type === "auth") {
               console.log(dataObject);
               authenticate(dataObject.assertion, res);
               return;
            } else {
                var serverIdentity = dataObject;
                serverIdentity.address = request.connection.remoteAddress;
                if(request.headers["x-real-ip"]) {
                    serverIdentity.address = request.headers["x-real-ip"];
                }
                //console.log(serverIdentity);
                console.log("server registered: " + serverIdentity.name);
                serverlist[serverIdentity.address + serverIdentity.port] = serverIdentity;
                res.end(JSON.stringify({ "status" : "ok" }));
            }
        });
        return;
    } else {
        var response;
        switch(request.url) {
            case "/list.json":
            response = serverlist;
            break;
            case "/count.json":
            response = { "players" : 0 };
            break;
            default:
            response = { "error" : "404" };
            break;
        }
        res.end(JSON.stringify(response));
    }
};

var server = http.createServer(function(req, res) {
    res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
    var response = respond(req, res);
});

//setInterval(updateServers, 20000);
server.listen(8080);
//server.listen(10138);