# HCL to JSON v2

This package uses GopherJS[1] to convert the snyk/snyk-iac-parsers
Golang package into JavaScript and provide it as a CommonJS module.
It is suffixed with v2 as we already have an existing hcl2json implementation,
which we will deprecate when we fully switch to this implementation.

## Build

The current path of this folder has to be added into the \$GOPATH environment variable for
the build to work (this is currently a requirement of GopherJS).
e.g:

```
export GOPATH=$HOME/dev/snyk/release-scripts/hcl-to-json-parser-generator-v2
```

Make sure that your `$GOROOT` environment variable is set to where go is installed, for example:

```
GOROOT="/usr/local/go"
```

Then, from this working directory run:

    % make build

This will generate two files a hcltojson-v2.js and an hcltojson-v2.js.map with
source maps for the minified file.
You can find these files under `/release-scripts/hcl-to-json-parser-generator-v2/src/hcltojson-v2/dist/`

The output file is ~ minified and ~ gzipped.

## Usage

The module exposes two functions:

- `extractVariables(fileName, fileContent)` this takes two parameters as input and returns a variableMap and an error as output:
  ```javascript
  const { extractVariables } = require('./hcltojson-v2');
  const fileContent = fs.readFileSync('../path/to/terraform.tf', 'utf-8');
  const variableMap = extractVariables('../path/to/terraform.tf', fileContent);
  ```
- `parseHCL2JSON(fileName, fileContent, variableMap)` this takes three parameters as input and returns a string and an error as output:
  ```javascript
  const { parseHCL2JSON } = require('./hcltojson-v2');
  const fileContent = fs.readFileSync('../path/to/terraform.tf', 'utf-8');
  const parsedJSON = parseHCL2JSON(
    '../path/to/terraform.tf',
    fileContent,
    variableMap,
  );
  ```

## Test

A simple assertion that the compiled file works can be run via:

    % make test

TODO

## Updating the snyk-iac-parsers

TODO

The generated GopherJS artefact is used... TODO

In case that this artefact has to be updated and replaced, please follow the next steps:

1. Build a new artefact with `make build`.
2. Validate it passes the tests with `make test`.
3. Run the following shell script: `copy-artefact-to-destination.sh`, it will overwrite the current artefact being used by the Terraform parser.

TODO: (3) is a big assumption that we are going to use it at the same place as before (iac-local-execution/parsers/terraform-parser) and the shell script above states that path. We need to change this accordingly when we decide the use of it.
