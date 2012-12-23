var ServerList = {
	servers: {},
	updateInterval: null
};

function id(i) {
	return document.getElementById(i);
}

function join(serverIndex) {
	var loadingMarkup = "<div class='progress progress-striped active'><div class='bar' style='width: 20%' id='progressbar'></div></div>";
	clearInterval(ServerList.updateInterval);
	//document.body.innerHTML = loadingMarkup;
		document.body.innerHTML = "<canvas id='game'></canvas>" + loadingMarkup;
		document.body.style.margin = "0";
		document.body.style.padding = "0";
		document.body.style.overflow = "hidden";
		document.body.style.width = "100%";
		document.body.style.height = "100%";
	qdip.on("load", function() {
		loadTiles();

		game.connect("ws://" + ServerList.servers[serverIndex].address + ":" + ServerList.servers[serverIndex].port);
	});
	qdip.on("progress", function() {
		var progress = (qdip.loaded / (qdip.total / 100) * 100) | 0;
		id("progressbar").style.width = progress + "%";
	});
	qdip.load({
		"terrain": "images/terrain32.png",
		"tankbody": "images/tankbody.png",
		"cannon1": "images/cannon1_1.png",
		"cannon2": "images/cannon2.png",
		"powerplant": "images/power_plant.png",
		"powerplant_active": "images/power_plant_glow.png",
		"turretbody": "images/turretbody.png",
		"turretcannon": "images/turretcannon.png",
		"mine": "images/mine.png"
	});
}

function fetchServerList() {
	var list = "http://dev138.info:10138/list";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", list, true);
	xhr.onload = function() {
		var table = "";
		var servers = JSON.parse(xhr.responseText);
		for(var server in servers) {
			var button = "<button class='btn btn-primary btn-small btn-block' onclick='join(\"" + server + "\")'>join</button>";
			table += "<tr>" +
					"<td>" + servers[server].name + "</td>" +
					"<td>" + servers[server].players + "/" + servers[server].maxPlayers + "</td>" +
					"<td>" + servers[server].address + "</td>" +
					"<td>" + servers[server].status + "</td>" +
					"<td>" + button + "</td>";
		}
		id("servertable").innerHTML = table;
		ServerList.servers = servers;
	};
	xhr.send();
}
window.addEventListener("load", function() {
	var currentUser = localStorage.currentUser || null;
	var signin = id("sign_in");
	fetchServerList();
	ServerList.updateInterval = setInterval(fetchServerList, 20000);
	signin.addEventListener("click", function() {
		navigator.id.request();
	});

	navigator.id.watch({
		loggedInUser: currentUser,
		onlogin: function(assertion) {
			console.log(assertion);
		},
		onlogout: function() {
			console.log("logout");
		}
	});
});