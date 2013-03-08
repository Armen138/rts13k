/*jshint newcap:false, nonew:true */
/*global console, define */
(function() {
	"use strict";
	function audio(files, callback) {
		var file = new Audio(),
			maxChannels = 8,
			channels = [],
			fileType = files.substr(files.lastIndexOf(".") + 1).toLowerCase();

		callback = callback || function(success) { console.log("no callback set for loading audio."); };
		var rfile = {
			canPlay: {
				"mp3": file.canPlayType("audio/mpeg"),
				"ogg": file.canPlayType("audio/ogg"),
				"wav": file.canPlayType("audio/wav")
			},
			volume: function(vol) {
				for(var i = 0; i < channels.length; i++) {
					channels[i].volume = vol;
				}
			},
			play: function(loop) {
				for(var i = 0; i < channels.length; i++) {
					if(channels[i].currentTime === 0 || channels[i].ended) {
						channels[i].loop = loop;
						channels[i].play();
						return;
					}
				}
				//if all else fails.
				channels[0].pause();
				channels[0].loop = loop;
				channels[0].currentTime = 0;
				channels[0].play();
			},
			stop: function() {
				for(var i = 0; i < channels.length; i++) {
					if(channels[i] && !channels[i].paused) {
						channels[i].pause();
						channels[i].currentTime = 0;
					}
				}
			}
		};
		if(!rfile.canPlay[fileType]) {
			callback(false);
			console.log("This filetype cannot be played on this browser: " + fileType);
		} else {
			for(var i = 0; i < maxChannels; i++) {
				channels.push(new Audio(files));
			}
			callback(true);
		}
		return rfile;
	}

	var Racket = {
		create: audio
	};

	if(typeof define !== "undefined") {
		define("racket", Racket);
	} else {
		window.Racket = Racket;
	}
}());
