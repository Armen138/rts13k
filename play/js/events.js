(function() {
 	var events = {
        attach: function(obj) {
            var eventList = {},
                eventTarget = {
                    on: function(ev, f) {
                        if(!eventList[ev]) eventList[ev] = [];
                        eventList[ev].push(f);
                        return obj;
                    },
                    fire: function(ev, evobj) {
                        if(eventList[ev]) {
                            for(var i = 0; i < eventList[ev].length; i++) {
                                if(eventList[ev][i].call(obj, evobj)) {
                                    return;
                                }
                            }
                        }
                    },
                    remove: function(ev, f) {
                        if(!eventList[ev]) {
                            return;
                        }
                        for(var i = 0; i < eventList[ev].length; i++) {
                            if(eventList[ev][i] === f) {
                                eventList[ev].splice(i, 1);
                                break;
                            }
                        }
                    }
                };
            for(var prop in eventTarget) {
                obj[prop] = eventTarget[prop];
            }
        }
    };
    define("events", events);
}());
