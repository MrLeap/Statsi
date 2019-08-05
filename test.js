let test = require('ava');

let statsi = require('./statsi.js');

test('Default operation works', t => {
	let a = statsi([{armor: 1}, {armor:  10}]);
	t.is(a.status.armor, 11)
});

test('Array of objects aggregates correctly', t => {
	let a = statsi([{armor: 1}, {armor: {$add: 10}}]);
	t.is(a.status.armor, 11)
});

test('Object with inner array aggregates correctly', t => {
	let a = statsi({armor: 1,
		gear: [{armor: {$add: 1}}, {armor: {$add: 1}}]
	});
	t.is(a.status.armor, 3)
});

test('Single operation sets _something_', t => {
	let a = statsi({armor: {$add: 9}});
	t.is(a.status.armor, 9)
});

test('Options and no collection returns the builder function', t => {
	let a = statsi(null, {});
	t.is(typeof a, 'function')
});

test('Can override the method name via the options', t => {
	let a = statsi({armor: 10}, {aggregateFunctionName: "compute"}); //gross, but I want it to work anyways
	t.is(a.status, undefined);
	t.is(a.compute.armor, 10);
})
