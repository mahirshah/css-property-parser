/**
 * Takes all of the units in data/units.json and writes standard json grammars for each type of unit.
 * Each type of unit is defined in the TYPE_MAP below, which maps the unit type to the grammar file name.
 * For example, CSS Length units will be written to the file 'length-units.json'.
 */
const { css: { units } } = require('mdn-data');
const fs = require('fs-extra');
const PATHS = require('./constants/paths');
const GRAMMAR_CONSTANTS = require('./constants/grammars');

const TYPE_MAP = {
  'CSS Lengths': 'length-unit',
  'CSS Angles': 'angle-unit',
  'CSS Resolutions': 'resolution-unit',
  'CSS Frequencies': 'frequency-unit',
  'CSS Times': 'time-unit',
};

const unitToTypesMap = Object.entries(units).reduce((unitMap, [unit, { groups }]) => {
  const unitKey = groups.map(group => TYPE_MAP[group]).find(Boolean) || 'other-unit';

  if (unitMap[unitKey]) {
    return Object.assign(unitMap, { [unitKey]: unitMap[unitKey].concat(unit) });
  }

  return Object.assign(unitMap, { [unitKey]: [unit] });
}, {});

Promise.all(
  Object.entries(unitToTypesMap).map(([fileName, unitList]) => (
    fs.writeJson(`${PATHS.GENERATED_JSON_GRAMMAR_PATH}${fileName}.json`, [
      [GRAMMAR_CONSTANTS.BASE_GRAMMAR_RULE_NAME, `( ${unitList.map(unit => `"${unit}"`).join(' | ')} )`],
    ], { spaces: 2 })
  )))
  .then(() => console.log(`Successfully wrote to ${PATHS.GENERATED_JSON_GRAMMAR_PATH}`))
  .catch(err => console.log(`Failure in writing unit grammars to ${PATHS.GENERATED_JSON_GRAMMAR_PATH}`, err));
