// tslint:disable:object-literal-key-quotes quotemark semicolon
export default {
  "title": "Component",
  "description": "Object containing a form.io component",
  "type": "object",
  "required": ["type", "key", "input"],
  "properties": {
    "type": {
      "title": "Component Type",
      "description": "The type of this component",
      "type": "string"
    },
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
    "placeholder": {
      "title": "Component Placeholder",
      "description": "The text to show in the input before they type",
      "type": "string"
    },
    "input": {
      "title": "User Input?",
      "description": "Determines if this is an input from the user",
      "type": "boolean"
    },
    "tableView": {
      "title": "Component TableView",
      "description": "Determines if this field will show in the data tables output",
      "type": "boolean"
    },
    "multiple": {
      "title": "Component Multiple",
      "description": "If this field should collect multiple values, creating an array of values",
      "type": "boolean"
    },
    "protected": {
      "title": "Component Protected",
      "description": "If the value of this field should be shown to the end user via API once it is saved",
      "type": "boolean"
    },
    "prefix": {
      "title": "Component Prefix",
      "description": "The prefix text to put in front of the input",
      "type": "string"
    },
    "suffix": {
      "title": "Component Suffix",
      "description": "The suffix text to put after the input",
      "type": "string"
    },
    "defaultValue": {
      "title": "Default Value",
      "description": "The default value to provide to this component. Its type depends on the specific component"
    },
    "clearOnHide": {
      "title": "Clear on Hide",
      "description": "If the value of this field should be cleared when it is conditionally hidden",
      "type": "boolean"
    },
    "unique": {
      "title": "Unique",
      "description": "Validates if this field should be unique amongst other submissions in the same form",
      "type": "boolean"
    },
    "persistent": {
      "title": "Persistent",
      "description": "Determines if the value of this field should be saved as persistent",
      "type": "boolean"
    },
    "hidden": {
      "title": "Hidden",
      "description": "Determines if this field should be hidden from view by default. This can be overridden with the conditionals.",
      "type": "boolean"
    },
    "validate": {
      "title": "Validate",
      "description": "Determines validation criteria for this component.",
      "type": "object",
      "properties": {
        "required": {
          "title": "Required",
          "description": "Specifies if the field is required.",
          "type": "boolean"
        },
        "minLength": {
          "title": "Min Lenngth",
          "description": "For text input, this checks the minimum length of text for valid input.",
          "type": ["number", "string"]
        },
        "maxLength": {
          "title": "Max Lenngth",
          "description": "For text input, this checks the maximum length of text for valid input.",
          "type": ["number", "string"]
        },
        "pattern": {
          "title": "Pattern",
          "description": "For text input, this checks the text agains a Regular expression pattern.",
          "type": "string"
        },
        "custom": {
          "title": "Custom",
          "description": "A custom javascript based validation or a JSON object for using JSON Logic.",
          "type": ["string", "object"]
        }
      }
    },
    "conditional": {
      "$ref": "conditional"
    },
    "errors": {
      "title": "Errors",
      "description": "Allows customizable errors to be displayed for each component when an error occurs.",
      "type": "object",
      "properties": {
        "required": {
          "title": "Required",
          "description": "Error message for error 'required'.",
          "type": "string"
        },
        "min": {
          "title": "Min",
          "description": "Error message for error 'min'.",
          "type": "string"
        },
        "max": {
          "title": "Min",
          "description": "Error message for error 'max'.",
          "type": "string"
        },
        "minLength": {
          "title": "Min Length",
          "description": "Error message for error 'minLength'.",
          "type": "string"
        },
        "maxLength": {
          "title": "Max Length",
          "description": "Error message for error 'maxLength'.",
          "type": "string"
        },
        "invalid_email": {
          "title": "Invalid Email",
          "description": "Error message for error 'invalid_email'.",
          "type": "string"
        },
        "invalid_date": {
          "title": "Invalid Date",
          "description": "Error message for error 'invalid_date'.",
          "type": "string"
        },
        "pattern": {
          "title": "Pattern",
          "description": "Error message for error 'pattern'.",
          "type": "string"
        },
        "custom": {
          "title": "Custom",
          "description": "Error message for error 'custom'.",
          "type": ["string", "object"]
        }
      }
    },
    "logic": {
      "title": "Logic",
      "description": "Allows changing the component definition in reaction to data entered in a form. For example, changing a field to required, disabled or hidden when a value is entered.",
      "type": "array",
      "items": {
        "$ref": "logic"
      }
    }
  },
  "allOf": [
    {
      "if": { "properties": { "type": { "const": "columns" } } },
      "then": { "$ref": "columns" }
    },
    {
      "if": { "properties": { "type": { "const": "table" } } },
      "then": { "$ref": "table" }
    },
    {
      "if": { "properties": { "type": { "const": "tabs" } } },
      "then": { "$ref": "tabs" },
      "else": {
        "properties": {
          "components": {
            "$ref": "components"
          }
        }
      }
    }
  ]
}
