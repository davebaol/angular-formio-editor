// tslint:disable:object-literal-key-quotes quotemark semicolon
export default {
  "title": "Conditional",
  "description": "Determines when this component should be added to the form for both processing and input.",
  "type": "object",
  "properties": {
    "show": {
      "$ref": "show",
    },
    "when": {
      "title": "When",
      "description": "The field API key that it should compare its value against to determine if the condition is triggered.",
      "type": ["string", "null"]
    },
    "eq": {
      "title": "Eq",
      "description": "The value that should be checked against the comparison component.",
      "type": "string"
    },
    "json": {
      "title": "Json",
      "description": "The JSON Logic to determine if this component is conditionally available.",
      "type": "string"
    }
  }
}