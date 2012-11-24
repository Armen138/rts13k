exports.Message = function(type) {
    var message = {
        get serialized() {
            var sd = { type : type };
            for (prop in message) {
                if(prop !== "serialized" && message.hasOwnProperty(prop)) {
                    sd[prop] = message[prop];
                }
            }
            return JSON.stringify(sd);
        }, 
        eat : function(obj) {
            for(prop in obj) {
                if(obj.hasOwnProperty(prop)) {
                    message[prop] = obj[prop];
                }
            }
        }
    }
    return message;
};