// tslint:disable:object-literal-key-quotes quotemark semicolon
export default {
  "required": [ "columns" ],
  "not": { "required": [ "components"] },
  "properties": {
    "columns": {
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
