package main

import (
"github.com/gopherjs/gopherjs/js"
"encoding/json"
"fmt"
)
func main() {
  js.Module.Get("exports").Set("parseHCL2JSON", parseHCL2JSON);
  js.Module.Get("exports").Set("extractVariables", extractVariables);
}

//TODO: need to update with the snyk-iac-parsers branch
// put right input output based on the file

func extractVariables(file string, fileContent string) (variableMap map[string]interface{}) {
variableMap = map[string]interface{}{}
jsonstr:=`{"variable":{"name":"value","name2":{"type":"int", "default": 123}}}`
err1 := json.Unmarshal([]byte(jsonstr), &variableMap)
if err1 != nil {
        fmt.Printf("error : %s", err1)
}
// err1 := json.Unmarshal([]byte(fileContent), &variableMap)
return variableMap
}

func parseHCL2JSON(file string, fileContent string, variableMap map[string]interface{}) string {
//     variableMap, _ = extractVariables("vpc.tf", "resource something");
return "parsed JSON is back"
}
