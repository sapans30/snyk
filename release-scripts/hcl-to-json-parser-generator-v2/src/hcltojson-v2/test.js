const fs = require('fs');
const hcltojson = require('./dist/hcltojson-v2.js');
const assert = require('assert');

const filePath = './sg_open_ssh-defaults.tf';
const originalFileContent = fs.readFileSync(filePath, 'utf-8');

// console.log(hcltojson.parseHCL2JSON());
// console.log(hcltojson.extractVariables(filePath, originalFileContent));

const expectedFake = {
  variable: { name: 'value', name2: { type: 'int', default: 123 } },
};

//TODO - doesn't work yet
const variables = hcltojson.extractVariables(filePath, originalFileContent);
assert.deepEqual(
  variables,
  expectedFake,
  'Parsed JSON for deref variables does not match expected',
);
console.log('Test 1 - OK');

assert.deepEqual(
  hcltojson.parseHCL2JSON(filePath, originalFileContent, variables),
  'parsed JSON is back',
  'Parsed JSON does not match expected',
);

console.log('Test 2 - OK');
