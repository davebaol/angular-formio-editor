// tslint:disable:object-literal-key-quotes quotemark semicolon
export default {
  "required": [ "components" ],
  "properties": {
    "components": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["key", "components"],
        "not": { "required": ["type"] },
        "properties": {
          "key": {
            "title": "Component Key",
            "description": "The API key for this component",
            "type": "string"
          },
          "label": {
            "title": "Component Label",
            "description": "The HTML label to give this component",
            "type": "string"
          },
          "components": {
            "$ref": "components"
          }
        }
      }
    }
  }
}

