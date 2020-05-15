// tslint:disable:object-literal-key-quotes quotemark semicolon
export default {
  "title": "Action",
  "description": "An action to perform when the logic is triggered",
  "required": ["type"],
  "type": "object",
  "properties": {
    "type": {
      "title": "Type",
      "description": "The type of the action.",
      "enum": ["property", "value"]
    }
  },
  "allOf": [
    {
      "if": {
        "properties": { "type": { "const": "property" } }
      },
      "then": {
        "properties": {
          "property": {
            "title": "Property",
            "description": "The property action.",
            "required": ["type", "value"],
            "type": "object",
            "properties": {
              "type": {
                "title": "Property",
                "description": "The type of the property action (either 'boolean' or 'string').",
                "enum": ["boolean", "string"]
              },
              "value": {
                "title": "Value",
                "description": "The path to the property on the component definition.",
                "type": "string"
              }
            }
          }
        },
        "allOf": [
          {
            "if": {
              "properties": { "type": { "const": "boolean" } }
            },
            "then": {
              "properties": {
                "state": {
                  "title": "Boolean State",
                  "description": "Used if the type of the property action is boolean.",
                  "type": "boolean"
                }
              }
            }
          },
          {
            "if": {
              "properties": { "type": { "const": "string" } }
            },
            "then": {
              "properties": {
                "text": {
                  "title": "String Text",
                  "description": "Used if the type of the property action is string.",
                  "type": "string"
                }
              }
            }
          }
        ]
      }
    },
    {
      "if": {
        "properties": { "type": { "const": "value" } }
      },
      "then": {
        "properties": {
          "value": {
            "title": "Value",
            "description": "The javascript that returns the new value. It Will be evaluated with available variables of row, data, component and result (returned from trigger).",
            "type": "string"
          }
        }
      }
    }
  ]
}
