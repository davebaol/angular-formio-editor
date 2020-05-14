// tslint:disable:object-literal-key-quotes quotemark semicolon
export default {
  "title": "Form",
  "description": "Object containing a form.io form",
  "type": "object",
  "required": ["components"],
  "properties": {
    "display": {
      "title": "Display mode",
      "description": "The given name.",
      "enum": ["form", "wizard"]
    },
    "components": {
      "$ref": "components"
    }
  }
}
