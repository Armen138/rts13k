define("resources", ["events", "racket"], function(events, Racket) {
    var audio = ["wav", "mp3", "ogg"];
    var reserved = ["on", "fire", "load", "prototype", "remove"];
    var resources = {
        loaded: 0,
        load: function(files) {
            resources.load.total = 0;
            resources.load.loaded = 0;
            function loaded(file) {
                resources.load.loaded++;
                resources.fire("progress", file);
                if(resources.load.loaded === resources.load.total) {
                    resources.fire("load");
                }
            }
            for(var file in files) {
                if(reserved.indexOf(file) !== -1) {
                    throw "naming conflict: cannot load resource named " + file;
                }
                resources.load.total++;
                if(audio.indexOf(files[file].slice(-3)) !== -1) {
                    (function(file) {
                        resources[file] = Racket.create(files[file], function(success) {
                            if(!success) {
                                console.log("failed to load: " + files[file]);
                            }
                            loaded(file);
                        });
                    }(file));
                } else {
                    var img = new Image();
                    (function(img, file){
                        img.onload = function() {
                            loaded(file);
                        };
                        img.onerror = function() {
                            //fail silently.
                            console.log("failed to load: " + files[file]);
                            loaded(file);
                        };
                    }(img, file));
                    img.src = files[file];
                    resources[file] = img;
                }
            }
        }
    };
    events.attach(resources);
    return resources;
});