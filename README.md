# CSS Property Validation and Shorthand Expansion
> Validate css properties and expand css shorthand properties

## Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Why](#why)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [isShorthandProperty(property: string): boolean](#isshorthandpropertyproperty-string-boolean)
    - [Examples](#examples)
  - [[Experimental] isValidDeclaration(property: string, value: string): boolean](#experimental-isvaliddeclarationproperty-string-value-string-boolean)
    - [Examples](#examples-1)
  - [getShorthandComputedProperties(property: string): Array](#getshorthandcomputedpropertiesproperty-string-array)
      - [Examples](#examples-2)
  - [expandPropertyShorthand(property: string, value: string, [recursivelyResolve=false]): Object](#expandpropertyshorthandproperty-string-value-string-recursivelyresolvefalse-object)
      - [Examples](#examples-3)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Why

- Uses [MDN data](https://github.com/mdn/data/tree/master/css) to generate validators and shorthand property expanders
- Supports experimental properties and values

## Installation
```
$ npm instal css-property-parser
```

## Usage
```js
const {
  isShorthandProperty,
  isValidDeclaration,
  getShorthandComputedProperties,
  expandShorthandProperty,
} = require('css-property-parser');

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
// returns an obejct mapping longhand property names to their values
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
 
#### Examples

```js
isShorthandProperty('border')
// => true

isShorthandProperty('color')
// => false
```

### [Experimental] isValidDeclaration(property: string, value: string): boolean
Checks if the given property, value pair is valid.

 * property - the property name. For example, 'border' or 'color'.
 * value - the property value. For example, '1px solid black'.
 * returns true if the given value is valid for the property. Else, false.
 
#### Examples
 
 ```js
isValidDeclaration('color', 'currentColor')
// => true

isValidDeclaration('color', 'rgb(0)')
// => false (rgba expects at least 3 parameters)

isValidDeclaration('z-index', '-1')
// => true

isValidDeclaration('z-index', 'abc')
// => false (z-index expects an integer)

isValidDeclaration('width', '300px')
// => true

isValidDeclaration('width', '300ms')
// => false ('ms' is not a valid length unit)
```

### getShorthandComputedProperties(property: string): Array
Given a shorthand property, returns an array of the computed properties for that shorthand property. If given
a known property that is not a shorthand, simply returns the given property. If given an unknown property,
returns an empty array.
 
 * shorthandProperty - the shorthand property name. For example, "background" or "border".
 * returns an array containing the computed properties for the given shorthand property. Returns an empty array if the given property is not a valid property.
 * throws {ParseError} - if the propertyValue cannot be parsed.
 * throws {UnknownPropertyError} - if the propertyName is not defined in mdn.
 * throws {UnsupportedPropertyError} - if the propertyName is a shorthand property, but we don't support expanding it yet.
 
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

### expandPropertyShorthand(property: string, value: string, [recursivelyResolve=false]): Object

Given a property and value attempts to expand the value into its longhand equivalents. Returns an object
mapping the property longhand names to the longhand values. If the property cannot be expanded (i.e. the property
is not a shorthand property) simply returns an object mapping the original property to the original value.

 * propertyName - the property name for the given value
 * propertyValue - the value of the property
 * [recursivelyResolve=false] - recursively resolve additional longhand properties if the shorthands expand to additional shorthands. For example, the border property expands to border-width, which expands further to border-left-width, border-right-width, etc.

Currently supports the following properties:

  - animation
  - background
  - border
  - border-block-end
  - border-block-start
  - border-bottom
  - border-color
  - border-inline-end
  - border-inline-start
  - border-left
  - border-radius
  - border-right
  - border-style
  - border-top
  - border-width
  - column-rule
  - columns
  - flex
  - flex-flow
  - font
  - list-style
  - margin
  - outline
  - padding
  - text-decoration
  - text-emphasis
  - transition

##### Examples

```js
expandPropertyShorthand('margin', '0 3px 10rem')
// => {
//      'margin-top': '0',
//      'margin-right': '3px',
//      'margin-bottom': '10rem',
//      'margin-left': '3px',
//     }
```

```js
expandPropertyShorthand('flex', 'initial')
// => {
//  'flex-grow': 'initial',
//  'flex-shrink': 'initial',
//  'flex-basis': 'initial',
// }
```

```js
expandPropertyShorthand('border-radius', '10px 5px 2em / 20px 25px 30%')
// => {
//   'border-top-left-radius': '10px / 20px',
//   'border-top-right-radius': '5px / 25px',
//   'border-bottom-left-radius': '5px / 25px',
//   'border-bottom-right-radius': '2em / 30%',
// }
```
