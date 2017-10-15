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
  - [[Experimental] [isValidDeclaration(property: string, value: string): boolean](./src/isValidDeclaration.js)](#experimental-isvaliddeclarationproperty-string-value-string-booleansrcisvaliddeclarationjs)
    - [Examples](#examples-1)
  - [getShorthandComputedProperties(property: string, [recursivelyResolve=false]): Array](#getshorthandcomputedpropertiesproperty-string-recursivelyresolvefalse-array)
      - [Examples](#examples-2)
  - [expandShorthandProperty(property: string, value: string, [recursivelyResolve=false], [includeInitialValues=false]): Object](#expandshorthandpropertyproperty-string-value-string-recursivelyresolvefalse-includeinitialvaluesfalse-object)
      - [Examples](#examples-3)
  - [getShorthandsForProperty(property: string): Array&lt;string&gt;](#getshorthandsforpropertyproperty-string-arrayltstringgt)
      - [Examples](#examples-4)
  - [isInitialValue(property, value)](#isinitialvalueproperty-value)
  - [initialValues(property, recursivelyResolve, includeShorthands)](#initialvaluesproperty-recursivelyresolve-includeshorthands)
      - [Examples](#examples-5)
  - [initialValue(property)](#initialvalueproperty)
      - [Examples](#examples-6)
  - [Developer/Contribution HOWTO](#developercontribution-howto)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Why

- Uses [MDN data](https://github.com/mdn/data/tree/master/css) to generate validators and shorthand property expanders
- Supports experimental properties and values

## Installation
```
$ npm install css-property-parser
```

## Usage
```js
const {
  isShorthandProperty,
  isValidDeclaration,
  getShorthandComputedProperties,
  expandShorthandProperty,
  getShorthandsForProperty,
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
console.log(expandShorthandProperty('margin', '0 3px 10rem'))
// => {
//      'margin-top': '0',
//      'margin-right': '3px',
//      'margin-bottom': '10rem',
//      'margin-left': '3px',
//     }

console.log(expandShorthandProperty('background', 'fixed padding-box url(image.png) rgb(255, 255, 0) 10px top / cover repeat-x'))
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

console.log(getShorthandsForProperty('border-left-width'));
// => [ 'border-left-width', 'border-left', 'border-width', 'border' ]
```

## API

### [isShorthandProperty(property: string): boolean](./src/isShorthandProperty.js)
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

### [Experimental] [isValidDeclaration(property: string, value: string): boolean](./src/isValidDeclaration.js)
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

### [getShorthandComputedProperties(property: string, [recursivelyResolve=false]): Array](./src/getShorthandComputedProperties.js)
Given a shorthand property, returns an array of the computed properties for that shorthand property. If given
a known property that is not a shorthand, simply returns the given property. If given an unknown property,
returns an empty array.
 
 * shorthandProperty - the shorthand property name. For example, "background" or "border".
 * [recursivelyResolve=false] - recursively resolve additional longhand properties if the shorthands expand to additional shorthands. For example, the border property expands to border-width, which expands further to border-left-width, border-right-width, etc.
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
getShorthandComputedProperties('border', true); 
// -> [
//       'border-width',
//       'border-style',
//       'border-color',
//       'border-bottom-width',
//       'border-left-width',
//       'border-right-width',
//       'border-top-width',
//       'border-bottom-style',
//       'border-left-style',
//       'border-right-style',
//       'border-top-style',
//       'border-bottom-color',
//       'border-left-color',
//       'border-right-color',
//       'border-top-color'
// ];
```

```js
 getShorthandComputedProperties('unknownProperty');
// -> []
``` 

### [expandShorthandProperty(property: string, value: string, [recursivelyResolve=false], [includeInitialValues=false]): Object](./src/expandShorthandProperty.js)

Given a property and value attempts to expand the value into its longhand equivalents. Returns an object
mapping the property longhand names to the longhand values. If the property cannot be expanded (i.e. the property
is not a shorthand property) simply returns an object mapping the original property to the original value.

 * propertyName - the property name for the given value
 * propertyValue - the value of the property
 * [recursivelyResolve=false] - recursively resolve additional longhand properties if the shorthands expand to additional shorthands. For example, the border property expands to border-width, which expands further to border-left-width, border-right-width, etc.
 * [includeInitialValues=false] - when expanding the shorthand property, fill in any missing longhand values with their initial value. For example, the property declaration "border: 1px" only explicitly sets the "border-width" longhand property. If this param is true, the returned object will fill in the initial values for "border-style" and "border-color". By default, the returned object will only contain the "border-width".
 * throws {[ParseError](./src/errors/ParseError.js)} - if the propertyValue cannot be parsed.
 * throws {[UnknownPropertyError](./src/errors/UnknownPropertyError.js)} - if the propertyName is not defined in mdn.
 * throws {[UnsupportedPropertyError](./src/errors/UnsupportedPropertyError.js)} - if the propertyName is a shorthand property, but we don't support expanding it yet.

Currently supports the following properties:

  - animation
  - background
  - border
  - border-bottom
  - border-color
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
expandShorthandProperty('margin', '0 3px 10rem')
// => {
//      'margin-top': '0',
//      'margin-right': '3px',
//      'margin-bottom': '10rem',
//      'margin-left': '3px',
//     }
```

```js
expandShorthandProperty('flex', 'initial')
// => {
//  'flex-grow': 'initial',
//  'flex-shrink': 'initial',
//  'flex-basis': 'initial',
// }
```

```js
expandShorthandProperty('border-radius', '10px 5px 2em / 20px 25px 30%')
// => {
//   'border-top-left-radius': '10px / 20px',
//   'border-top-right-radius': '5px / 25px',
//   'border-bottom-left-radius': '5px / 25px',
//   'border-bottom-right-radius': '2em / 30%',
// }
```

### [getShorthandsForProperty(property: string): Array&lt;string&gt;](./src/getShorthandsForProperty.js)

This function is the inverse of `getShorthandComputedProperties`.

It returns all properties that set the given property, including the property itself.
If the property is unknown, an empty array is returned.

##### Examples

```js
console.log(getShorthandsForProperty('border-left-width'));
// => [ 'border-left-width', 'border-left', 'border-width', 'border' ]
```

```js
console.log(getShorthandsForProperty('float'));
// => [ 'float' ]
```

```js
console.log(getShorthandsForProperty('unknown'));
// => [ ]
```

### [isInitialValue(property, value)](./src/getShorthandsForProperty.js)

Because of the `initial` keyword and shorthand expansion,
there are many possible values that are equivalently identical
with the initial value of a css property. This function
returns true for all possible values that have the effect of
setting a property to its initial value.

 * `property` - string. the property to which the value is assigned.
 * `value` string. the value to check.

### [initialValues(property, recursivelyResolve, includeShorthands)](./src/initialValueMap.js)

Get the initial values for a property.

Returns the initial value or values a property has by
default according the CSS specification. If the property's initial
value(s) is/are unknown, the global keyword `initial` is returned.

 * `property` - (string) the property name
 * `recursivelyResolve` - (boolean) when given a shorthand property,
   causes the result to include long hand values.
 * `includeShorthands` - (boolean) when resolving recursively, causes the
   the result to include the specified shorthand property as well as any
   intermediate shorthands of this property set to the initial value.

##### Examples

```js
console.log(initialValues('border-width'));
// => { 'border-width': 'medium' }
console.log(initialValues('border-width', true));
// => {
//   'border-bottom-width': 'medium',
//   'border-left-width': 'medium',
//   'border-right-width': 'medium',
//   'border-top-width': 'medium',
//   'border-width': 'medium'
// }
```

### [initialValue(property)](./src/initialValueMap.js)

Get the initial value for a property. Returns a string that is the initial
value has by default according the CSS specification. If the property's
initial value is unknown, the global keyword `initial` is returned.

* `property` - the css property name

##### Examples

```js
console.log(initialValue('border-width'));
=> 'medium'
```

### Developer/Contribution HOWTO

To use a locally-built version of `css-values-parser`:

```
$ npm install
$ npm run start
$ npm test
```

This will generate grammars and javascript code required to parse the
css properties.
