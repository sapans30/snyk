package main

import (
"github.com/gopherjs/gopherjs/js"
"github.com/miratronix/jopher"
"github.com/snyk/snyk-iac-parsers/terraform"
// "fmt"
)
func main() {
  js.Module.Get("exports").Set("newHCL2JSONParser", newHCL2JSONParser);
}

type HCLJ2SONParser struct {
	*js.Object
	FileName              string                          `js:"fileName"`
	FileContent           string                          `js:"fileContent"`
	VariableMap           terraform.VariableMap           `js:"variableMap"`
	ExtractVariables      func(...interface{}) *js.Object `js:"extractVariables"`
	ParseHclToJson        func(...interface{}) *js.Object `js:"parseHCL2JSON"`
}

func newHCL2JSONParser(fileName string, fileContent string, variableMap terraform.VariableMap) *js.Object {
	o := HCLJ2SONParser{Object: js.Global.Get("Object").New()}
	o.FileName =    fileName
	o.FileContent = fileContent
	o.VariableMap = variableMap

	o.ExtractVariables = jopher.Promisify(o.extractVariables)
	o.ParseHclToJson = jopher.Promisify(o.parseHCL2JSON)
	return o.Object
}

func (o *HCLJ2SONParser) extractVariables() (variableMap string) {
  variableMap,_ = terraform.ExtractVariables(o.FileName, o.FileContent)
//   fmt.Println("extracted variables: ", variableMap)
  return variableMap
}

func (o *HCLJ2SONParser) parseHCL2JSON() (parsedJSON string) {
    parsedJSON, _ = terraform.ParseHclToJson(o.FileName, o.FileContent, o.VariableMap);
//       fmt.Println("parsedJSON: ", parsedJSON)
    return parsedJSON
}
