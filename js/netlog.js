/**
 * NetLog, a canvas-based logger for network output and other things
 * @class
 * @param {HTMLContext} context to draw on
 * @param {object} rect top, left, width, height rectangle to populate on the canvas
 * @param {object} [optional] settings any additional settings you wish to set
 **/
 (function() {
	window.NetLog = function(context, rect, settings) {
		var queue = [],
			entry = "",
			scrollIndex = 0,
			messageHandlers = [],
			idleTime = 0,
			dequeue = function() {
				if(queue.length > netlog.bufferSize) {
					queue.shift();
				}
			};
			/** @scope NetLog **/
			console.log("poop");
		var netlog = {
			inputMode: false,
			shadow: true,
			outline: false,
			messageColor: "black",
			errorColor: "red",
			infoColor: "yellow",
			backgroundColor: "rgba(0,0,0,0.5)",
			chatColor: "white",
			bufferSize: 200,
			idleDelay: 2000,
			fadeDuration: 2000,
			/**
			 * add message handler
			 * @param {function} handler
			 **/
			onMessage: function(handler) {
				messageHandlers.push(handler);
			},
			/**
			 * remove message handler
			 * @param {function} handler (same one as passed to onMessage)
			 **/
			removeMessageHandler: function(handler) {
				for(i = 0; i < messageHandlers.length; i++) {
					if(messageHandlers[i] === handler) {
						messageHandlers.splice(i, 1);
						break;
					}
				}
			},
			/**
			 * draw the log output
			 **/
			draw: function() {
				var now = (new Date()).getTime(),
					idleLevel = (now - idleTime - netlog.idleDelay),
					bgalpha = 1.0;
				context.save();
				if(netlog.inputMode) {
					if(idleLevel > 0 && entry === "") {
						if(idleLevel > netlog.fadeDuration) {
							netlog.inputMode = false;
							idleTime = 0;
							bgalpha = 0;
						} else {
							bgalpha = 1.0 - idleLevel / netlog.fadeDuration;
							if(bgalpha < 0) { bgalpha = 0; }
						}
					}
					context.globalAlpha = bgalpha;
					context.fillStyle = netlog.backgroundColor;
					context.fillRect(rect.left, rect.top, rect.width, rect.height);
				}
				var line = rect.top + rect.height - 50,
					alpha = 1.0;
				context.textBaseline = "hanging";
				context.font = "16px Arial";
				context.strokeStyle = "rgba(0, 0, 0, 1.0)";
				for(var i = queue.length - 1 - scrollIndex; i >= 0; --i) {
					switch(queue[i].level) {
						case "message":
							context.fillStyle = netlog.messageColor;
						break;
						case "error":
							context.fillStyle = netlog.errorColor;
						break;
						case "info":
							context.fillStyle = netlog.infoColor;
						break;
						default:
							context.fillStyle = "gray";
						break;
					}
					if(netlog.inputMode === false || (idleLevel > 0 && idleLevel < netlog.fadeDuration && entry === "")) {
						var levelCorrector = 0;
						if(idleLevel > 0 && netlog.inputMode) {
							levelCorrector = (1.0 - idleLevel / netlog.fadeDuration) * (1.0 - alpha);
						}
						context.globalAlpha = alpha + levelCorrector;
					}
					context.lineWidth = 2;
					if(netlog.shadow) {						
						context.shadowColor = "black";
						context.shadowOffsetX = 0;
						context.shadowOffsetY = 0;
						context.shadowBlur = 4;
					} 
					if(netlog.outline) {
						context.strokeText(queue[i].message, rect.left + 10, line);
					}
					context.fillText(queue[i].message, rect.left + 10, line);
					line -= 20;
					alpha -= 0.1;
					if(line < rect.top) {
						break;
					}
				}
				if(netlog.inputMode) {
					context.font = "20px Arial";
					context.fillStyle = netlog.chatColor;
					context.fillText(entry, rect.left + 10, rect.top + rect.height - 25);
				}
				context.restore();
			},
			/**
			 * send a message to the logger
			 * @param {string} msg message to display
			 **/
			message: function(msg) {
				queue.push({ level: "message", message: msg });
				dequeue();
			},
			/**
			 * send an error message to the logger
			 * @param {string} msg message to display
			 **/
			error: function(msg) {
				queue.push({ level: "error", message: msg });
				dequeue();
			},
			/**
			 * send an informative message to the logger
			 * @param {string} msg message to display
			 **/
			info: function(msg) {
				queue.push({ level: "info", message: msg });
				dequeue();
			},
			/**
			 * remove last character from input
			 **/
			backspace: function() {
						entry = entry.substr(0, entry.length - 1);
			},
			/**
			 * key input handler
			 * @param {number} keyCode
			 */
			key: function(keyCode) {
				switch(keyCode) {
					case 13:
						scrollIndex = 0;
						idleTime = (new Date()).getTime();
						if(!netlog.inputMode) {
							netlog.inputMode = true;
						} else {
							if(entry !== "") {
								for(var i = 0; i < messageHandlers.length; i++) {
									messageHandlers[i](entry);
								}
							}
							entry = "";
						}
					break;
					case 8:
					break;
					default:
						if(netlog.inputMode) {
							scrollIndex = 0;
							entry += String.fromCharCode(keyCode);
						}
					break;
				}
			}
		};
		document.addEventListener("keypress", function(e) {
			//because the keyup event doesn't populate e.keyCode with a proper char code
			netlog.key(e.charCode || e.keyCode);
		});

		document.addEventListener("keydown", function(e) {
			//because chrome will navigate 'back' on backspace. do not want.
			if(e.keyCode === 8) {
				e.preventDefault();
				return false;
			}
			//because firefox will kill the websocket connection on escape. do not want.
			if(e.keyCode === 27) {
				e.preventDefault();
				return false;				
			}
			//because all browsers "scroll down" on space
			if(e.keyCode === 32) {
				e.preventDefault();
				return false;								
			}
		});
		document.addEventListener("keyup", function(e) {
			//because keypress doesn't trigger for special keys
			if(netlog.inputMode) {
				idleTime = (new Date()).getTime();
				if(e.keyCode === 27) {
					netlog.inputMode = false;
				}
				if(e.keyCode === 8) {
					netlog.backspace();
				}
				if(e.keyCode === 33) {
					//pgUp
					scrollIndex += 10;
					if(scrollIndex >= queue.length) {
						scrollIndex = queue.length - 1;
					}
				}
				if(e.keyCode === 34) {
					//pgDwn
					scrollIndex -= 10;
					if(scrollIndex < 0) {
						scrollIndex = 0;
					}
				}
			}
		});

		if(settings) {
			for(var setting in settings) {
				if(settings.hasOwnProperty(setting)) {
					netlog[setting] = settings[setting];
				}
			}
		}
		return netlog;
	};
 }());