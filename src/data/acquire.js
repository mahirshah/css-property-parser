/**
 * Script used to acquire CSS data from MDN repo. Writes json files out to DATA_PATH.
 * TODO: once MDN publishes data via npm, we can remove this
 */
const fetch = require('node-fetch');
const fs = require('fs-extra');
const PATHS = require('../constants/paths');

const BASE_URL = 'https://raw.githubusercontent.com/mdn/data/master/css/';
const FILES_TO_ACQUIRE = ['at-rules', 'properties', 'selectors', 'syntaxes', 'types', 'units'];

Promise
  .all(FILES_TO_ACQUIRE.map(fileName => fetch(`${BASE_URL}${fileName}.json`)))
  .then(files => Promise.all(files.map(file => file.json())))
  .then(resolvedFiles => resolvedFiles
    .map((file, idx) => fs.writeJson(`${PATHS.DATA_PATH}${FILES_TO_ACQUIRE[idx]}.json`, file, { spaces: 2 })))
  .then(() => console.log(`Successfully wrote files in ${PATHS.DATA_PATH}`))
  .catch(err => console.log('error: ', err));
