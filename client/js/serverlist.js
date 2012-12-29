(function() {
	var account = {
			logged: false,
			email: null
		},
		lobbyServer = "";//"http://13tanks.com/",
		ServerList = {
			servers: {},
			updateInterval: null
		};

	var dom = {};
	dom.id = function(i) {
		return document.getElementById(i);
	};

	dom.tag = function(i) {
		var list = document.getElementsByTagName(i);
		return {
			each: function(callback) {
				for(var i = 0; i < list.length; i++) {
					callback.call(list[i]);
				}
			},
			get: function() {
				return list;
			}
		};
	};

	function postMessage(data, callback) {
		var xhr = new XMLHttpRequest(),
			params = JSON.stringify(data);
		xhr.onload = function() {
			callback(JSON.parse(xhr.responseText));
		};
		xhr.open("POST", lobbyServer + "register.json", true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//"application/json");
		xhr.send(params);
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
			dom.id("progressbar").style.width = progress + "%";
		});
		qdip.load({
			"terrain": "images/terrain32.png",
			"tankbody": "images/tankbody.png",
			"tankbody2": "images/tankbody2.png",
			"cannon1": "images/cannon1_1.png",
			"cannon2": "images/cannon2.png",
			"powerplant": "images/power_plant.png",
			"powerplant_active": "images/power_plant_glow.png",
			"turretbody": "images/turretbody.png",
			"turretcannon": "images/turretcannon.png",
			"mine": "images/mine.png",
			"button64": "images/button64.png",
			"hud": "images/hud1.png",
			"hudborder": "images/hudborder.png"
		});
	}

	function fetchServerList() {
		var list = lobbyServer + "list.json";
		var xhr = new XMLHttpRequest();
		xhr.open("GET", list, true);
		xhr.onload = function() {
			var table = "";
			var servers = JSON.parse(xhr.responseText);
			for(var server in servers) {
				var button = "<button class='btn btn-primary btn-small btn-block' server='" + server + "' >join</button>";
				table += "<tr>" +
						"<td>" + servers[server].name + "</td>" +
						"<td>" + servers[server].players + "/" + servers[server].maxPlayers + "</td>" +
						"<td>" + servers[server].address + ":" + servers[server].port + "</td>" +
						"<td>" + servers[server].status + "</td>" +
						"<td>" + button + "</td>";
			}
			dom.id("servertable").innerHTML = table;
			dom.tag("button").each(function() {
				(function(button) {
					button.addEventListener("click", function(e) {
						var srv = button.getAttribute("server");
						console.log(srv);
						join(srv);
					});
				}(this));
			});
			ServerList.servers = servers;
		};
		xhr.send();
	}

	window.addEventListener("load", function() {
		var currentUser = localStorage.currentUser || null;
		var signin = dom.id("sign_in");
		fetchServerList();
		dom.id("refresh").addEventListener("click", function() {
			fetchServerList();
		});
		//ServerList.updateInterval = setInterval(fetchServerList, 20000);
		signin.addEventListener("click", function() {
			if(account.logged) {
				//offer options to change nickname or log out.
				navigator.id.logout();
			} else {
				navigator.id.request();
			}
		});

		navigator.id.watch({
			loggedInUser: currentUser,
			onlogin: function(assertion) {
				console.log(assertion);
				postMessage({ "assertion" : assertion, "type": "auth" }, function(data) {
					if(data.status === "okay") {
						localStorage.currentUser = data.email;
						account.logged = true;
						account.email = data.email;
						account.nickname = data.email.substr(0, data.email.indexOf("@"));
						game.session = data.session;
						dom.id("persona-label").innerHTML = account.nickname;
					}
				});
			},
			onlogout: function() {
				console.log("logout");
				dom.id("persona-label").innerHTML = "Sign in";
			}
		});
	});
}());
/*
var account = {
	logged: false,
	email: null
};
var lobbyServer = "http://dev138.info:10138/";
var ServerList = {
	servers: {},
	updateInterval: null
};

function id(i) {
	return document.getElementById(i);
}

function postMessage(data, callback) {
	var xhr = new XMLHttpRequest(),
		params = JSON.stringify(data);
	xhr.onload = function() {
		console.log(xhr.responseText);
		callback(JSON.parse(xhr.responseText));
	};
	xhr.open("POST", lobbyServer, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(params);
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
	var list = lobbyServer + "list";
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
		if(account.logged) {
			//offer options to change nickname or log out.
			navigator.id.logout();
		} else {
			navigator.id.request();
		}
	});

	navigator.id.watch({
		loggedInUser: currentUser,
		onlogin: function(assertion) {
			console.log(assertion);
			postMessage({ "assertion" : assertion, "type": "auth" }, function(data) {
				if(data.status === "okay") {
					localStorage.currentUser = data.email;
					account.logged = true;
					account.email = data.email;
					account.nickname = data.email.substr(0, data.email.indexOf("@"));
					id("persona-label").innerHTML = account.nickname;
				}
			});
		},
		onlogout: function() {
			console.log("logout");
			id("persona-label").innerHTML = "Sign In";
		}
	});
});*/