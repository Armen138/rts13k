define(["network", "player", "map", "raf", "canvas"], function(Network, Player, Map, raf, Canvas) {
    //local player
    var player;
    //all connections (players, observers)
    var clients = {};
    var map;
    var game = function(server) {
        Network.connect(server);
    };
    //used only for persona authentication, will reimplement later
    game.session = "";
    
    game.run = function() {
        if(map) {
            map.mini.draw();
            map.draw();
            for(var c in clients) {
                clients[c].draw();
            }
        }
        raf.requestAnimationFrame.call(window, game.run);
    };

    var init = function() {
        //opening handshake
        Network.send({ type: "map" });
        Network.send({ type: "user", name: "guest", session: game.session }); 
    };

    var message = function(msg) {
        console.log(msg);
        switch(msg.type) {
            case "map":                        
                map = Map(msg.map, clients);
            break;
            case "player":
                player = Player(msg.credits, msg.id, msg.name);
                clients[msg.id] = player;
            break;
            case "connect":
                clients[msg.id] = Player(msg.credits, msg.id, msg.name);
            break;
            case "unit":
                if(msg.owner === player.id) {
                    map.centerOn(msg.position);                    
                }
                clients[msg.owner].unit(msg);
            break;
            case "position":
                var unit = clients[msg.owner] ? clients[msg.owner].units[msg.id] : null;
                if(unit) {
                    unit.syncPosition(msg.position);
                } else {
                    Network.send({ type: "unit", id: msg.id });
                }
            break;
            default:
            break;
        }
    };

    Network.on("connect", init);
    Network.on("message", message);

    window.addEventListener("keyup", function(e) {
        map.position.X++;
    });

    window.addEventListener("mousemove", function(e) {
        var position = {
            X: e.clientX - Canvas.position.X,
            Y: e.clientY - Canvas.position.Y
        };
        map.mousemove(position);
    });

    window.addEventListener("mouseup", function(e) {
        var position = {
            X: e.clientX - Canvas.position.X,
            Y: e.clientY - Canvas.position.Y
        };
        map.mouseup(position, e.button);
    });

    window.addEventListener("mousedown", function(e) {
        var position = {
            X: e.clientX - Canvas.position.X,
            Y: e.clientY - Canvas.position.Y
        };
        map.mousedown(position, e.button);
    });

    game.run();
    return game;
});