define(["events"], function(Events) {
    var socket;

    var init = function(event) {        
        network.fire("connect");
    };

    var message = function(event) {
        var data = JSON.parse(event.data);
        if(!data || !data.type) {
            return;
        }
        //hide pings from listeners        
        if(data.type === "ping") {
            network.send({ type: "pong", timestamp: data.timestamp });
        } else {
            network.fire("message", data);    
        }        
    };

    var error = function(event) {
        console.log("Error: " + event);
    };

    var close = function(event) {
        console.log("disconnected.");
        network.fire("disconnect");
    };

    var network = {
        connect: function(server) {
            socket = new WebSocket(server, "tt.0");
            socket.addEventListener("open", init);
            socket.addEventListener("message", message);
            socket.addEventListener("error", error);
            socket.addEventListener("close", close);
        },
        send: function(message) {
            if(typeof(message) !== "string") {
                message = JSON.stringify(message);
            }
            socket.send(message);
        }
    };

    Events.attach(network);

    return network;
});
