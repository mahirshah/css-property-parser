# CSS Property Validation and Shorthand Expansion
> Validate and expand css shorthand properties

## Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Why](#why)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [isShorthandProperty(property: string): boolean](#isshorthandpropertyproperty-string-boolean)
  - [isValidDeclaration(property: string, value: string): boolean](#isvaliddeclarationproperty-string-value-string-boolean)
  - [getShorthandComputedProperties(property: string): Array](#getshorthandcomputedpropertiesproperty-string-array)
  - [expandPropertyShorthand(property: string, value: string, [recursivelyResolve=true]): Object](#expandpropertyshorthandproperty-string-value-string-recursivelyresolvetrue-object)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Why

- Uses [MDN data](https://github.com/mdn/data/tree/master/css) to generate validators and shorthand property expanders
- Supports experimental properties and values

## Installation
```
$ npm instal TODO_
```

## Usage
```js
const {
  isShorthandProperty,
  isValidDeclaration,
  getShorthandComputedProperties,
  expandShorthandProperty,
} = require('TODO');

// isShorthandProperty
// returns boolean indicating if the given property is a shorthand property
console.log(isShorthandProperty('border')); // => true
console.log(isShorthandProperty('color')); // => false

// isValidDeclaration
// returns boolean indicating if the given property value pair is valid
console.log(isValidDeclaration('border', '1px solid black')); // => true
console.log(isValidDeclaration('color', 'rgba(0, 0, 0, .25)')); // => true
console.log(isValidDeclaration('z-index', 'abc')); // => false
console.log(isValidDeclaration('height', 'red')); // => false

// getShorthandComputedProperties
// returns an array of computed property names for the given shorthand
console.log(getShorthandComputedProperties('background'))
// => [
//      "background-image",
//      "background-position",
//      "background-size",
//      "background-repeat",
//      "background-origin",
//      "background-clip",
//      "background-attachment",
//      "background-color"
//     ]
console.log(getShorthandComputedProperties('color')) 
// => ["color"]
console.log(getShorthandComputedProperties('unknown'))
// => []

// expandShorthandProperty
console.log(expandPropertyShorthand('margin', '0 3px 10rem'))
// => {
//      'margin-top': '0',
//      'margin-right': '3px',
//      'margin-bottom': '10rem',
//      'margin-left': '3px',
//     }

console.log(expandPropertyShorthand('background', 'fixed padding-box url(image.png) rgb(255, 255, 0) 10px top / cover repeat-x'))
// => {
//      'background-attachment': 'fixed',
//      'background-clip': 'padding-box',
//      'background-origin': 'padding-box',
//      'background-image': 'url(image.png)',
//      'background-repeat': 'repeat-x',
//      'background-color': 'rgb(255, 255, 0)',
//      'background-position': '10px top',
//      'background-size': 'cover',
//     }
```

## API

### isShorthandProperty(property: string): boolean
Checks if a given property is a shorthand property

 * property - the property name
 * returns true if property is a shorthand, false otherwise

### isValidDeclaration(property: string, value: string): boolean
Checks if the given property, value pair is valid.

 * property - the property name. For example, 'border' or 'color'.
 * value - the property value. For example, '1px solid black'.
 * returns true if the given value is valid for the property. Else, false.

### getShorthandComputedProperties(property: string): Array
Given a shorthand property, returns an array of the computed properties for that shorthand property. If given
a known property that is not a shorthand, simply returns the given property. If given an unknown property,
returns an empty array.
 
 * shorthandProperty - the shorthand property name. For example, "background" or "border".
 * returns an array containing the computed properties for the given shorthand property. Returns an empty array if the given property is not a valid property.
 
 ##### Examples
```js
getShorthandComputedProperties('background');
 // -> [
 //   "background-image",
 //   "background-position",
 //   "background-size",
 //   "background-repeat",
 //   "background-origin",
 //   "background-clip",
 //   "background-attachment",
 //   "background-color"
 // ]
```

```js
getShorthandComputedProperties('color');
// -> ["color"]
```

```js
 getShorthandComputedProperties('unknownProperty');
// -> []
``` 

### expandPropertyShorthand(property: string, value: string, [recursivelyResolve=true]): Object

Given a property and value attempts to expand the value into its longhand equivalents. Returns an object
mapping the property longhand names to the longhand values. If the property cannot be expanded (i.e. the property
is not a shorthand property) simply returns an object mapping the original property to the original value.

 * propertyName - the property name for the given value
 * propertyValue - the value of the property
 * [recursivelyResolve=true] - recursively resolve additional longhand properties if the shorthands expand to additional shorthands. For example, the border property expands to border-width, which expands further to border-left-width, border-right-width, etc.



