
/* ns(nodes) is a module that facilitates building a hierarchy of nodes such as for drawing to a canvas */
var ns = {}; //namespace

/*  ns.Pooled is a self executing function (IIFE),
	which returns a constructor. This enables the use of static variables.
*/
ns.Pooled = (function() {
	"use strict";
		//(static) privates for ns.Pooled
	var pool = {},
		pull = function(name) {
			if(pool[name]) {
				return pool[name].shift();
			}
			return null;						
		},
		available = function(name) {
			return pool[name];
		},
		//constructor for ns.Pooled
		self = function() {
			return {
				release: function() {
					if(!this.type) {
						throw("Cannot release to pool: object has no type property.");
					}
					if(!pool[this.type]) {
						pool[this.type] = [];
					}
					pool[this.type].push(this);
				},
			};
		};
	//set static public methods for ns.Pooled
	self.pull = pull;
	self.available = available;
	return self;
}());

ns.Node = function() {
	"use strict";	
	var node = ns.Pooled.pull("node");
	if(!node) {
		var children = [];
		node = Object.create(ns.Pooled(), {
			visible: { value: true, enumerable: true, configurable: true },
			each: {
				value: function(func) {
					for(var i = 0; i < children.length; i++) {
						func.apply(children[i]);
					}
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
					children.splice(children.indexOf(child), 1);
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
	}
	return node;
};

// end of engine land.
