exports.Node = function() {
	"use strict";	
	var children = [],
		node = Object.create({}, {
		visible: { value: true, enumerable: true, configurable: true },
		each: {
			value: function(func) {
				var stop = false;
				for(var i = 0; i < children.length; i++) {
					stop = func.apply(children[i]);
					if(stop) {
						break;
					}
				}
			},
			enumerable: true
		},
		find: {
			value: function(key, value) {
				for(var i = 0; i < children.length; i++) {
					if(children[i][key] === value) {
						return children[i];
					}
				}
				return null;
			},
			enumerable: true
		},		
		get: {
			value: function(idx) {
				return children[idx];
			}
		},
		clear: {
			value: function() {
				children.length = 0;
			}
		},
		add: {
			value : function(child) {
				children.push(child);
				child.parent = node;
			},
			enumerable: true
		},
		remove: {
			value: function(child) {
				var idx = children.indexOf(child);
				if(idx !== -1) children.splice(idx, 1);
			},
			enumerable: true
		},
		up: {
			get: function() {
				return Object.getPrototypeOf(this);
			}
		},
		length: {
			get: function() {
				return children.length;
			}
		}
	});
	return node;
};