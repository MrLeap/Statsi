A proxy that watches your collections and makes.. note of them..

It automatically calculates various summary statistics for arbitrary, potentially deeply nested collections for you. When making games or simulations, often times you'll want to add a new statistic to keep track of. Wouldn't it be nice if your data structures accomodated this behavior? I wrote statsi to do just that.

Other than ava for testing, Statsi doesn't have any dependencies, and I intend to keep it that way. Once I have some more time, I'll remove ava as well.


```js
let statsi = require('statsi');
let player = statsi({
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
});

```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install statsi
```

## Philosophy

Sometimes, for things like simulators and games, the data informs the processing often enough to abstract away the act of writing code to process data.