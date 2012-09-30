exports.attach = function(obj) {
    var eventList = {},
        eventTarget = {
            on: function(ev, f) {
                if(!eventList[ev]) eventList[ev] = [];
                eventList[ev].push(f);
            },
            fire: function(ev, obj) {
                if(eventList[ev]) {
                    for(var i = 0; i < eventList[ev].length; i++) {
                        eventList[ev][i](obj);
                    }
                }
            }
        };
    for(prop in eventTarget) {
        obj[prop] = eventTarget[prop];
    }
};
