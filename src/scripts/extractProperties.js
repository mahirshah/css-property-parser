/**
 * Takes raw data from MDN, filters out the shorthand properties, and decorates the data with additional properties.
 * Writes the formatted data to FORMATTED_DATA_PATH.
 */
const fs = require('fs-extra');
const { css: { properties } } = require('mdn-data');
const PATHS = require('../constants/paths');

const ALL_PROPERTIES_DATA_FILE_NAME = 'properties.json';
const OUTPUT_FILE = `${PATHS.FORMATTED_DATA_PATH}${ALL_PROPERTIES_DATA_FILE_NAME}`;
fs.writeJson(OUTPUT_FILE, properties, { spaces: 2 })
  .then(() => (
    console.log(`Successfully extracted properties to ${OUTPUT_FILE}`)
  ));
