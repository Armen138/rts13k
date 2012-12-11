var log = [];

function timestamp() {
	return (new Date()).getTime();
}

exports.info = function(msg) {
	console.log(timestamp() + " " + msg);
	log.push(msg);
};

exports.log = function() {
	return log.join("<br/>\n");
};