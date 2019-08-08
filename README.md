A proxy that watches your collections and makes.. note of them..

Statsi automatically calculates various summary statistics for arbitrary, potentially deeply nested collections for you. When making games or simulations, often times you'll want to add a new statistic to keep track of. Wouldn't it be nice if your data structures accomodated this behavior? I wrote statsi to do just that.

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


## Examples

If you run example.js, it'll launch a repl with a statsi object already instantiated. Try monkeying around with it!

```js
 > player.status
{ health: 133,
  strength: 5,
  intelligence: 5,
  agility: 5,
  base_damage: 7,
  block_chance: 0.3,
  defense: 13 }
```

Lets say you've got a statsi object like the above. You want to start letting big bad boss monsters debuff your player.

 > player.debuffs = [{health: {$mul: .5}}] //ouch, 50% health debuff :(
 > player.status
{ health: 66.5,
  strength: 5,
  intelligence: 5,
  agility: 5,
  base_damage: 7,
  block_chance: 0.3,
  defense: 13 }

A cleanse spell might be as simple as player.debuffs = [].

A dispell spell might be as simple as player.buffs = [].

By default, keys with a name that start with an _, have a value that's a string or a function aren't considered by .status.



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