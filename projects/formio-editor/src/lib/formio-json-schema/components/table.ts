// tslint:disable:object-literal-key-quotes quotemark semicolon
export default {
  "required": [ "rows", "numRows", "numCols"],
  "not": { "required": [ "components"] },
  "properties": {
    "numRows": { "type": "integer" },
    "numCols": { "type": "integer" },
    "rows": {
        "type": "array",
      "items": {
        "type": "array",
        "items": {
          "required": [ "components" ],
          "type": "object",
          "properties": {
            "components": {
              "$ref": "components"
            }
          }
        }
      }
    }
  }
}

