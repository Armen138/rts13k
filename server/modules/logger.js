var log = [];

function timestamp() {
	return (new Date()).getTime();
}

exports.info = function(msg) {
	console.log(timestamp() + " " + msg);
	var logMessage = { time: timestamp(), message: msg };
	log.push(logMessage);
};

exports.log = function() {
	return JSON.stringify(log);
};