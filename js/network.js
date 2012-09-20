var network = {};
network.connect = function(server) {
socket = new WebSocket(server, "tt.0");
    socket.addEventListener("open", function(event) {      
      	menu.log("connected");
      	socket.send('{"request": "map"}');
        socket.send('{"request": "user", "name": "Armen"}');
    });

    socket.addEventListener("message", function(event) {
    	var dataObject = JSON.parse(event.data);
    	if(dataObject.map) {    		
    		game.init(0);
    		gameView(window.innerWidth, window.innerHeight, dataObject.map);
    		game.run();
    	} else {
            menu.log("Server Says: " + event.data);
        }
    });

        // Display any errors that occur
    socket.addEventListener("error", function(event) {
	    menu.log("Error: " + event);
    });

    socket.addEventListener("close", function(event) {
      	menu.log("Not Connected/Disconnected");
    });	
};

Events.attach(network);