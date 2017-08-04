const Benchmark = require('benchmark');

const expandPropertyShorthand = require('../src/expandShorthandProperty');

let suite = new Benchmark.Suite;

function ms(n) {
    return Math.round(n * 100000) / 100;
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
}).on('complete', function () {
    for (let i = 0; i < this.length; i++) {
        let stats = this[i].stats;
        console.log(`"${this[i].name}" expanded ${this[i].count} times. Average: ${ms(stats.mean)}ms +/- ${ms(stats.deviation)}ms`);
    }
})
// run async
.run({ 'async': true });
