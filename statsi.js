"use strict";

//TODO: figure out a way to inject initial values when an op is the first thing encountered.
var defaultOptions = {
	defaultOperation: "$add",
	aggregateFunctionName: "status",
	operations: {
		$mul: function(n, x) {
			return n * x;
		},
		$add: function(n, x) {
			return n + x;
		},
		$nop: function(n) {
			return n;
		}
	},
	hide: function (k, v){
		return (k[0] === "_" || typeof v === "string" || typeof v === "function");
	}
}

var bakeStat = function(effect, stats, options){
	for (var stat in effect) {
		var change = effect[stat];

		if (options.hide(stat, change)) {
			//the options say hide this property so do that.
		} else if (typeof change !== "object") {
			//It's a primative type of some kind so just set it via the default op
			let operation = options.operations[options.defaultOperation]
			if(stats[stat] === null || stats[stat] === undefined){
				stats[stat] = 0;
			}
			var result = operation(stats[stat], change)
			stats[stat] = operation(stats[stat], change);
		} else {
			let carry = {};
			for (var op in change) {
				let delta = change[op];
				let operation = options.operations[op];
				if(operation !== undefined){
					if(stats[stat] === null || stats[stat] === undefined){
						stats[stat] = 0;
					}
					stats[stat] = operation(stats[stat], delta);
				} else {
					carry[op] = delta
				}
			}

			buildStats(carry, stats, options);
		}
	}
}

var objectToPairs = function(obj){
	let output = [];
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			let pair = {}
			pair[prop] = obj[prop];
			output.push(pair);
		}
	}
	return output;
}

var buildStats = function(obj, stats, options){
	if(typeof obj === "object" && !Array.isArray(obj)){
		buildStats(objectToPairs(obj), stats, options);
		return;
	}

	for (var i = 0; i < obj.length; i++) {
		var effect = obj[i];
		bakeStat(effect, stats, options);
	}
}

var wrapObject = function(effects, options){
	let isDirty = true;
	var stats = {};

	return new Proxy(effects, {
		get: function(obj, prop) {
			if (prop in obj) {
				return obj[prop];
			}
			if(isDirty){
				stats = {}
				buildStats(obj, stats, options);
				//isDirty = false;
				//TODO: need a more robust way to detect if the object has changed.
				//The delete keyword doesn't trigger the set callback, for instance.
			}
			if (prop === options.aggregateFunctionName) {
				return stats;
			}
		},
		 set: function(target, prop, value, receiver){
		 	isDirty = true;
		 	target[prop] = value;
		 	//TODO: scan options.triggers on set to see if any messages need to be sent.
		 	//trigger(objectToWatch, triggerFunction, callback)
		 	return true;
		 }
	});
}

var statsi = function(effects, options) {
	var _options = defaultOptions;
	if(options !== null){
		options = Object.assign({}, defaultOptions, options);
		_options = options;
	}

	if(effects === null){
		//return a builder function preset with the options they chose.
		return function(effects) {
			return wrapObject(effects, _options);
		}
	} else {
		return wrapObject(effects, _options);
	}
};

module.exports = statsi
