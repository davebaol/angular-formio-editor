const { hasOwnProperty } = Object.prototype;

// -------------------------------
// SCHEMAS
// -------------------------------

class Schema {
    constructor(component, rootSchema) {
        this.component = component;
        this.conditions = [];
        this.required = false;
        this.dataType = {};
        if (!rootSchema) {
            this.definitions = {};
        }
        if (component && component.formioComponent) {
            if (component.formioComponent.conditional) {
                // Add non-empty condition from the component
                const cnd = component.formioComponent.conditional;
                if (typeof cnd.show === 'boolean' && cnd.when) {
                    // console.log(component.formioComponent.type, "Pushing condition")
                    const c = { show: cnd.show, when: cnd.when, eq: cnd.eq };
                    c.key = this.generateSingleConditionKey(c);
                    this.conditions.push(c);
                }
            }
            if (component.formioComponent.validate) {
                this.required = component.formioComponent.validate.required;
            }
        }
    }
    /*private*/ generateSingleConditionKey(condition) {
        return JSON.stringify(condition);
    }
    /*private*/ generateConditionsKey() {
        return JSON.stringify(this.conditions, (k, v) => k === 'key' ? undefined : v);
    }
    prepareConditions() {
        // Ensure the array has unique conditions
        this.conditions = this.conditions.sort((c1, c2) => c1.key.compare(c2.key))
            .filter((x, i, a) => i === 0 || x.key !== a[i - 1].key);
        this.conditions.key = this.generateConditionsKey();
    }
    shrink() {
        for (const k in this.properties) {
            if (hasOwnProperty.call(this.properties, k)) {
                const propSchema = this.properties[k];
                if (propSchema instanceof MergeableObjectSchema && propSchema.component && propSchema.component.shrinkable()) {
                    // console.log('Shrink', propSchema.component.formioComponent.type);
                    propSchema.shrink();
                    delete this.properties[k]; // Remove shribkable schema from parent
                    this.merge(propSchema); // merge its properties and conditions with parent
                }
            }
        }
        return this;
    }
    // Subclasses overriding this method MUST call super.toJsonSchema()
    toJsonSchema() {
        const jsonSchema = Object.assign({}, this.dataType);
        // Compile definitions
        if (this.definitions) {
            const defKeys = Object.keys(this.definitions);
            if (defKeys.length > 0) {
                jsonSchema.definitions = defKeys.reduce((defs, dk) => {
                    defs[dk] = this.definitions[dk].toJsonSchema();
                    return defs;
                }, {});
            }
        }
        return jsonSchema;
    }
}
class ObjectSchema extends Schema {
    constructor(component, rootSchema) {
        super(component, rootSchema);
        this.dataType.type = 'object';
        this.properties = {};
    }
    addProperty(name, schema, required) {
        this.properties[name] = schema;
        schema.required = required;
        return this;
    }
    toJsonSchema() {
        const jsonSchema = super.toJsonSchema();
        jsonSchema.properties = {};
        const required = [];
        const condPropMap = {};
        const conditionsMap = {};
        for (const pk in this.properties) {
            if (hasOwnProperty.call(this.properties, pk)) {
                const childSchema = this.properties[pk];
                if (childSchema.conditions.length === 0) {
                    if (childSchema.required) {
                        required.push(pk);
                    }
                    jsonSchema.properties[pk] = childSchema.toJsonSchema();
                    continue;
                }
                childSchema.prepareConditions();
                const ck = childSchema.conditions.key
                conditionsMap[ck] = childSchema.conditions;
                if (!(ck in condPropMap)) {
                    condPropMap[ck] = {};
                }
                condPropMap[ck][pk] = childSchema;
            }
        }
        // Add required to jsonSchema if not empty
        if (required.length > 0) {
            jsonSchema.required = required;
        }
        // Generate allOf from conditional properties
        const allOf = [];
        for (const ck in condPropMap) {
            if (hasOwnProperty.call(condPropMap, ck)) {
                const conds = conditionsMap[ck];
                const _if = {
                    properties: conds.reduce((acc, c) => {
                        acc[c.when] = c.show ? { const: c.eq } : { not: { const: c.eq } };
                        return acc;
                    }, {})
                };
                const then = { required: [], properties: {} };
                for (const pk in condPropMap[ck]) {
                    if (hasOwnProperty.call(condPropMap[ck], pk)) {
                        const childSchema = condPropMap[ck][pk];
                        if (childSchema.required) {
                            then.required.push(pk);
                        }
                        then.properties[pk] = childSchema.toJsonSchema();
                    }
                }
                // Remove empty required
                if (then.required.length === 0) {
                    delete then.required;
                }
                // Add if/then to allOf
                allOf.push({ if: _if, then: then });
            }
        }
        // Add allOf to jsonSchema if not empty
        if (allOf.length > 0) {
            jsonSchema.allOf = allOf;
        }
        return jsonSchema;
    }
}
class MergeableObjectSchema extends ObjectSchema {
    constructor(component, rootSchema) {
        super(component, rootSchema);
    }
    merge(...sources) {
        const targetProps = this.properties;
        for (let i = 0, len = sources.length; i < len; i++) {
            const source = sources[i];
            if (source instanceof MergeableObjectSchema) {
                // merge properties
                const sourceProps = source.properties;
                for (const key in sourceProps) {
                    if (hasOwnProperty.call(sourceProps, key)) {
                        // Append source schema conditions to the conditions of its sub-schemas 
                        Array.prototype.push.apply(sourceProps[key].conditions, source.conditions);
                        // Merge properties recursively
                        if (targetProps[key] && sourceProps[key] instanceof MergeableObjectSchema) {
                            targetProps[key].merge(sourceProps[key]);
                        } else {
                            targetProps[key] = sourceProps[key];
                        }
                    }
                }
            }
        }
        return this;
    }
}
class ArraySchema extends Schema {
    constructor(component, items, rootSchema) {
        super(component, rootSchema);
        this.dataType.type = 'array';
        this.dataType.items = items;
    }
    toJsonSchema() {
        const jsonSchema = super.toJsonSchema();
        jsonSchema.items = this.dataType.items.toJsonSchema();
        return jsonSchema;
    }
}
class PrimitiveSchema extends Schema {
    constructor(component, type, rootSchema) {
        super(component, rootSchema);
        this.dataType.type = type;
    }
}
class BooleanSchema extends PrimitiveSchema {
    constructor(component, rootSchema) {
        super(component, 'boolean', rootSchema);
    }
}
class NumberSchema extends PrimitiveSchema {
    constructor(component, rootSchema) {
        super(component, 'number', rootSchema);
        if (component && component.formioComponent && component.formioComponent.validate) {
            const validate = component.formioComponent.validate;
            if (validate.min || typeof validate.min === 'number') this.dataType.minimum = Number(validate.min);
            if (validate.max || typeof validate.max === 'number') this.dataType.maximum = Number(validate.max);
            if (validate.integer) this.dataType.type = 'integer';
        }
    }
}
class StringSchema extends PrimitiveSchema {
    constructor(component, rootSchema) {
        super(component, 'string', rootSchema);
        if (component && component.formioComponent && component.formioComponent.validate) {
            const validate = component.formioComponent.validate;
            if (validate.minLength) this.dataType.minLength = Number(validate.minLength);
            if (validate.maxLength) this.dataType.maxLength = Number(validate.maxLength);
            if (validate.pattern) this.dataType.pattern = validate.pattern;
        }
    }
}

class EnumSchema extends Schema {
    constructor(component, values, rootSchema) {
        super(component, rootSchema);
        this.dataType.enum = values;
    }
}

// -------------------------------
// COMPONENT BASE CLASSES
// -------------------------------

class Component {
    constructor(formioComponent) {
        this.formioComponent = formioComponent;
    }
    schema(rootSchema) {
        throw new Error('Subclasses of \'Component\' have to implement the method \'schema\'!');
    }
    // Layout components are view-only components. From resource perspective, they are to be
    // shrinked, because they don't have any value neither implicit nor expressed by user.
    // So they don't contribute to the underlying resource because their 'API key' does not
    // match any field inside the resource itself.
    // Howewer, shrink process propagates component's condition (show/when/eq) to child components.
    shrinkable() {
        return !(this.formioComponent && this.formioComponent.input);
    }
}

class AtomicComponent extends Component {
    schema(rootSchema) {
        const schema = this.baseSchema();
        if (this.formioComponent.multiple) {
            if (this.formioComponent.validate && !this.formioComponent.validate.required) {
            // With multiple values enabled the component can generate null items if required is false
            schema.dataType = { anyOf: [schema.dataType, { type: 'null' }] };
            }
            return new ArraySchema(this, schema, rootSchema);
        }
        return schema;
    }
    baseSchema() {
        throw new Error('Subclasses of \'AtomicComponent\' have to implement the method \'baseSchema\'!');
    }
    isDefaultCastToString() {
        return false; // cast defaults to 'auto'
    }
    cast(val, to) {
        switch (to) {
            case 'boolean':
                return val.toLowerCase() === 'true';
            case 'number':
                return Number(val);
            case 'object':
                return JSON.parse(val);
            case 'string':
                return val;
            case 'auto':
            default: // Either autotype or string
                if (to !== 'auto' && this.isDefaultCastToString()) return val;
                if (val === "true") return true;
                if (val === "false") return false;
                if (val === "") return val;
                const v = Number(val);
                return isNaN(v) ? val : v;
        }
    }
}

class CompoundComponent extends Component {
    schema(rootSchema) {
        const schema = new MergeableObjectSchema(this, rootSchema);
        this.childrenSchema(schema, rootSchema);
        return schema.shrink();
    }
    /*prorected*/ children() {
        return this.formioComponent.components;
    }
    // Subclasses can override this method to provide a default class
    // for children that don't have a type
    /*prorected*/ defaultChildClass() {
        return undefined;
    }
    /*prorected*/ childrenSchema(parentSchema, rootSchema) {
        const children = this.children();
        for (let i = 0, len = children.length; i < len; i++) {
            const c = children[i];
            // console.log(this.formioComponent.type, 'child', c)
            if (c.persistent === 'client-only') {
                // console.log(c.type, ': skipped because persistent ===', c.persistent);
                continue;
            }
            const type = MAP[c.type] || this.defaultChildClass();
            if (type) {
                let schema = new (type)(c).schema(rootSchema);
                const required = c.validate && c.validate.required;
                // Dotted key means nested schema
                const keyParts = c.key.split('.');
                for (let j = keyParts.length - 1; j > 0; j--) {
                    schema = new MergeableObjectSchema(undefined).addProperty(keyParts[j], schema, required);
                }
                parentSchema.merge(new MergeableObjectSchema(undefined).addProperty(keyParts[0], schema, required))
            }
            else {
                // console.log(this.formioComponent.type, ": skipping child with unknown type", c.type);
            }
        }
        return parentSchema;
    }
}

// -------------------------------
// ABSTRACT COMPONENT CLASSES
// -------------------------------

class StringComponent extends AtomicComponent {
    baseSchema() {
        return new StringSchema(this);
    }
}
class EnumComponent extends AtomicComponent {
    constructor(formioComponent, ...additionalValuesIfNotRequired) {
        super(formioComponent);
        this.additionalValuesIfNotRequired = additionalValuesIfNotRequired;
    }
    // This is needed because different components take values from different path
    values() {
        throw new Error('Subclasses of \'EnumComponent\' have to implement the method \'values\'!');
    }
    baseSchema() {
        const values = this.values().map(v => this.cast(v.value, this.formioComponent.dataType));
        if (this.formioComponent && this.formioComponent.validate && !this.formioComponent.validate.required) {
            Array.prototype.push.apply(values, this.additionalValuesIfNotRequired);
        }
        return new EnumSchema(this, values);
    }
}

// -------------------------------
// BASIC COMPONENTS
// -------------------------------

class CheckboxComponent extends AtomicComponent {
    baseSchema() {
        return new BooleanSchema(this);
    }
}

class NumberComponent extends AtomicComponent {
    baseSchema() {
        return new NumberSchema(this);
    }
}

class PasswordComponent extends StringComponent {}

class RadioComponent extends EnumComponent {
    constructor(formioComponent) {
        // Empty string and null are valid values if the component is not required
        super(formioComponent, '', null);
    }
    values() {
        return this.formioComponent.values;
    }
}

class SelectComponent extends EnumComponent {
    constructor(formioComponent) {
        // Empty string and null are valid values if the component is not required
        super(formioComponent, '', null);
    }
    values() {
        return this.formioComponent.data.values;
    }
    schema() {
        const schema = super.schema();
        // If multiple values are enabled ensure uniqueness
        if (schema instanceof ArraySchema) {
            schema.dataType.uniqueItems = true;
        }
        return schema;
    }
    // This has changed with formio 4.10.x used by angular-formio 4.8.x
    // Now cast defaults to 'auto'
    // isDefaultCastToString() {
    //     return true; // cast defaults to 'string'
    // }
}

class SelectBoxesComponent extends AtomicComponent {
    baseSchema() {
        const schema = new ObjectSchema(this);
        schema.dataType.additionalProperties = false;
        const values = this.formioComponent.values
            .forEach(v => schema.addProperty(v.value, new BooleanSchema(undefined), true));
        if (this.formioComponent.validate && !this.formioComponent.validate.required) {
            // This is needed for compatibility.
            // Formio adds a boolean property with name "" when the component is not required.
            // The property itself must not be required
            schema.addProperty('', new BooleanSchema(undefined), false);
        }
        return schema;
    }
}

class TextAreaComponent extends StringComponent {}

class TextFieldComponent extends StringComponent {}

// -------------------------------
// ADVANCED COMPONENTS
// -------------------------------

class DateTimeComponent extends StringComponent {}
class EmailComponent extends StringComponent {}
class UrlComponent extends StringComponent {}

class TagsComponent extends AtomicComponent {
    schema() {
        return this.formioComponent.storeas === 'array' ?
            new ArraySchema(this, this.baseSchema())
            : this.baseSchema();
    }
    baseSchema() {
        return new StringSchema(this);
    }
}

// -------------------------------
// LAYOUT COMPONENTS
// -------------------------------

class ColumnsComponent extends CompoundComponent {
    // Determines children from columns.
    // Children are calculated lazily and cached into this instance.
    children() {
        if (!this.components) {
            this.components = [];
            this.formioComponent.columns.forEach(col => Array.prototype.push.apply(this.components, col.components));
        }
        return this.components;
    }
}

class ContentComponent extends CompoundComponent {
    children() {
        return []; // This component never has children
    }
}
class FieldSetComponent extends CompoundComponent {}
class PanelComponent extends CompoundComponent {}

class TableComponent extends CompoundComponent {
    // Determines children from table's rows and columns.
    // Children are calculated lazily and cached into this instance.
    children() {
        if (!this.components) {
            this.components = [];
            this.formioComponent.rows.forEach(row => {
                row.forEach(col => Array.prototype.push.apply(this.components, col.components));
            });
        }
        return this.components;
    }
}
class TabsComponent extends CompoundComponent {
    /*prorected*/ defaultChildClass() {
        return CompoundComponent; // Needed because children don't have a type :(

    }
}

class WellComponent extends CompoundComponent {}

// -------------------------------
// DATA COMPONENTS
// -------------------------------

class DataGridComponent extends CompoundComponent {
    schema(rootSchema) {
        return new ArraySchema(this, super.schema(rootSchema));
    }
}

class EditGridComponent extends CompoundComponent {
    schema(rootSchema) {
        return new ArraySchema(this, super.schema(rootSchema));
    }
}

/*
definitions: {
  tree_1234567890: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          item: {type: 'string'},
          price: {type: 'number'},
        }
      },
      children: {
          type: 'array',
          items: { $ref: "#/definitions/tree_1234567890"} 
      } 
    }
  }
},
$ref: "#/definitions/tree_1234567890""
*/
class TreeComponent extends CompoundComponent {
    schema(rootSchema) {
        return new TreeSchema(this, super.schema(rootSchema), rootSchema);
    }
}
class RefSchema extends Schema {
    constructor(component, schemaRef, rootSchema) {
        super(component, rootSchema);
        this.dataType.$ref = schemaRef;
    }
}
class TreeSchema extends RefSchema {
    constructor(component, dataSchema, rootSchema) {
        super(component, 'tree_' + Math.floor(Math.random() * 1000000), rootSchema);
        const schemaId = this.dataType.$ref;
        this.dataType.$ref = "#/definitions/" + schemaId;

        const treeSchema = new ObjectSchema(component)
            .addProperty('data', dataSchema, true)
            .addProperty('children', new ArraySchema(component, new RefSchema(undefined, this.dataType.$ref)), true);
        
        rootSchema.definitions[schemaId] = treeSchema;
        }
}

// -------------------------------
// FORM COMPONENT
// -------------------------------
class FormComponent extends CompoundComponent {
    /*prorected*/ childrenSchema(parentSchema, rootSchema) {
        // For form's children parentSchema and rootSchema are the same
        return super.childrenSchema(parentSchema, parentSchema);
    }
}

const MAP = {
    checkbox: CheckboxComponent,
    columns: ColumnsComponent,
    content: ContentComponent,
    datagrid: DataGridComponent,
    datetime: DateTimeComponent,
    editgrid: EditGridComponent,
    email: EmailComponent,
    fieldset: FieldSetComponent,
    number: NumberComponent,
    password: PasswordComponent,
    panel: PanelComponent,
    radio: RadioComponent,
    select: SelectComponent,
    selectboxes: SelectBoxesComponent,
    table: TableComponent,
    tabs: TabsComponent,
    tags: TagsComponent,
    textarea: TextAreaComponent,
    textfield: TextFieldComponent,
    tree: TreeComponent,
    url: UrlComponent,
    well: WellComponent
};

export function generateFormJsonSchema(form) {
    return new FormComponent(form).schema().toJsonSchema();
}