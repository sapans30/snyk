const fs = require('fs');
const hcltojson = require('./dist/hcltojson-v2.js');
const assert = require('assert');

const filePath = './sg_open_ssh_defaults.tf';
const originalFileContent = fs.readFileSync(filePath, 'utf-8');

const hcl2JSONParser = hcltojson.newHCL2JSONParser(
  filePath,
  originalFileContent,
);
const expectedVariables = '{\n\t"local": {},\n\t"var": {}\n}';
const expectedparsedJSON =
  '{\n' +
  '\t"resource": {\n' +
  '\t\t"aws_security_group": {\n' +
  '\t\t\t"allow_ssh": {\n' +
  '\t\t\t\t"cidr_blocks": "${var.dummy}",\n' +
  '\t\t\t\t"description": "Allow SSH inbound from anywhere",\n' +
  '\t\t\t\t"name": "allow_ssh"\n' +
  '\t\t\t}\n' +
  '\t\t}\n' +
  '\t}\n' +
  '}';

hcl2JSONParser
  .extractVariables()
  .then((response) => {
    console.log('extractVariables is resolved');
    assert.strictEqual(
      response,
      expectedVariables,
      'Parsed JSON for deref variables does not match expected',
    );
  })
  .catch((error) => {
    console.log('extractVariables is rejected');
    console.log(error, 'Assertion error on extractVariables');
  })
  .finally(() => {
    console.log('Test 1 completed');
    console.log('----------------');
  })
  .then(() => {
    hcl2JSONParser
      .parseHCL2JSON()
      .then((response) => {
        console.log('parseHCL2JSON is resolved');
        return response;
      })
      .then((response) => {
        assert.strictEqual(
          response,
          expectedparsedJSON,
          'Parsed JSON does not match expected',
        );
      })
      .catch((error) => {
        console.log('parseHCL2JSON is rejected');
        console.log(error, 'Assertion error on parseHCL2JSON');
      });
  })
  .finally(() => {
    console.log('Test 2 completed');
  });
