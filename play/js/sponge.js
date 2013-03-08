define(function() {
	//attach a sponge to an object to allow it to absorb other objects (mixins)
	var sponge = {
		attach: function(obj) {
			obj.absorb = function(other) {
				for(var property in other) {
					if(other.hasOwnProperty(property)) {
						var descriptor = Object.getOwnPropertyDescriptor(other, property);
						Object.defineProperty(obj, property, descriptor);
					}
				}
			};
		}
	};
	return sponge;
});