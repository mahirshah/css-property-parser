const Benchmark = require('benchmark');

const expandPropertyShorthand = require('../src/expandShorthandProperty');
const cssValues = require("css-values").default;

let suite = new Benchmark.Suite;

function ms(n) {
    return Math.round(n * 100000) / 100;
}

function dumbBorderImpl(prop, val) {
    let vals = val.split(/\s+/);
    return {
        "border-width": vals.unshift(),
        "border-style": vals.unshift(),
        "border-color": vals.unshift(),
    };
}
const borderDefaults = {
    "border-width": "medium",
    "border-style": "none",
    "border-color": "currentcolor",
};
const borderKeys = Object.keys(borderDefaults);

function cssValuesBorderImpl(prop, val) {
    let vals = val.split(/\s+/);
    let rv = {};
    for (let i = 0; i < vals.length; i++) {
        for (let j = 0; j < vals.length; j++) {
            let k = borderKeys[j];
            let taken = [];
            if (cssValues(k, vals[i]) === true) {
                if (taken.indexOf(k) >= 0) {
                    throw new Error(`invalid value for ${prop}: ${val}`);
                } else {
                    rv[k] = vals[i];
                    taken.push(k);
                }
            }
        }
    }
    return Object.assign({}, borderDefaults, rv);
}

// add tests
suite.add('border: 1px solid black;', function() {
    expandPropertyShorthand('border', '1px solid black')
}).add('border: 1px;', function() {
    expandPropertyShorthand('border', '1px')
}).add('border: solid;', function() {
    expandPropertyShorthand('border', 'solid')
}).add('border: black;', function() {
    expandPropertyShorthand('border', 'black')
}).add('dumb impl of border: 1px solid black;', function() {
    dumbBorderImpl('border', '1px solid black')
}).add('css-values impl of border: 1px solid black;', function() {
    cssValuesBorderImpl('border', '1px solid black');
}).on('complete', function () {
    for (let i = 0; i < this.length; i++) {
        let stats = this[i].stats;
        console.log(`"${this[i].name}" expanded ${this[i].count} times. Average: ${ms(stats.mean)}ms +/- ${ms(stats.deviation)}ms`);
    }
})
// run async
.run({ 'async': true });
