// tslint:disable:object-literal-key-quotes quotemark semicolon
export default {
  "title": "Logic",
  "description": "...",
  "type": "object",
  "required": ["trigger", "actions"],
  "properties": {
    "trigger": {
      "$ref": "trigger"
    },
    "actions": {
      "title": "Actions",
      "description": "The actions to perform when the logic is triggered",
      "type": "array",
      "items": {
        "$ref": "action"
      }
    }
  }
}
