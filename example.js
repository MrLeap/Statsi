statsi = require("./statsi.js");

var context = {
	statsi: statsi,
	player: statsi({
		base_stats: {
			health: 100,
			strength: 5,
			intelligence: 5,
			agility: 5
		},
		gear: {
			right_hand: {name: "short sword", base_damage: 7},
			left_hand: {name: "buckler", block_chance: 0.3, defense: 3},
			chest: {name: "leather armor", defense: 10, health: 10}
		},
		buffs : [{name: "health buff", health: {$mul: 1.3}}],
		history : [{health: -10, name: "got attacked ouch!"}],
		attack: function(target) {
			var damage = (this.status.base_damage + this.status.strength);
			console.log("going to do this much damage: " + damage);
		}
	})
}

console.dir(context.player)

var repl = require("repl").start({
		prompt: " > "
}).context = require("vm").createContext(context);