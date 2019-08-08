Statsi automatically calculates various summary statistics for arbitrary, potentially deeply nested objects for you. As I've written games and simulations, I've wanted a data structure that would enable me to quickly prototype new features.

I wrote statsi to streamline this thought process:

Right now, each car as a constant speed.

```js
var car = Statsi({speed: 100})
//car.status.speed = 100
```

I really want to adjust it based on every part on the car. I want to potentially modify it with effects I haven't even thought of yet.

Just sketch it as properties of your object and statsi will cope.

```js
car.speed = 0; //Speed now comes from parts!
car.parts = {}; //slots for parts.

//Statsi ignores these names, but they give the data flavor.
car.parts.engine = {name: "fancy turbo engine", speed: 100}
car.parts.tires = {name: "sport tires", speed: 10}
car.parts.fuel = {name: "high_octane_fuel", speed: {$mul: 1.05}} //5% more speed, after all additions.
//car.status.speed is now 115.5.
```

What about a speed boost? Just add a key with the effect, delete it when it's done. Anything reading car.status.speed will get the updated value as it changes.

```js
car.nos_active = {speed: {$mul: 2}} // weeee speed is 231 now.
setTimeout(() => {
	delete car.nos_active;
	//back to 115.
}, 5000)

```

Here's another example that shows how to use statsi to store character data for a contrived RPG.

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
This is the same kind of thing that's in example.js.

Lessons when you're designing: Does this effect get more severe every time it's applied? Put it in an array. Otherwise, object keys are often best since they're easy to overwrite and delete.

## Examples

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

If you run example.js, it'll launch a repl with a statsi object already instantiated. Try monkeying around with it!

Lets say you've got a statsi object like the above. You want to start letting big bad boss monsters debuff your player.

```js
 > player.debuffs = [{health: {$mul: .5}}] //ouch, 50% health debuff :(
 > player.status
{ health: 66.5,
  strength: 5,
  intelligence: 5,
  agility: 5,
  base_damage: 7,
  block_chance: 0.3,
  defense: 13 }
```


A cleanse spell might be as simple as `player.debuffs = [].`

A dispell spell might be as simple as `player.buffs = [].`

An antidote might look like this `player.debuffs = player.debuffs.filter((d) => {return d.name != 'poison'})`

Hopefully this is giving you ideas.

Since adding up the durations of all your debuffs isn't a useful statistic, It's a good idea to start the names of things like that an underscore. _duration and the like will be ignored when .status is calculated.

## Options

Here's a list of options you might want to customize, pass them as the second argument of your Statsi objects.

**aggregateFunctionName**
the function to get your stats. Defaults to `status`.

**operations**
If `$mul` isn't enough for you, you can add more operations here.

**hide**
A function that accepts a key and a value from your statsi objects. Defaults to this:

```js
function (k, v){
		return (k[0] === "_" || typeof v === "string" || typeof v === "function");
}```

This is used so statsi doesn't concatonate all your names together or other such weirdness. Override it if you need more / less things ignored.


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

## TODO
	-  Ergonomic constraints, triggers and lenses for your statsi objects.
	-  Have greater control over the order stats are calculated for non assoiative operations.
	-  Better performance characteristics. Storing your whole activity history for 100 entities in statsi gets unwieldy, but it shouldn't have to be.
