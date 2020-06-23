const { hasOwnProperty } = Object.prototype;

// -------------------------------
// SCHEMAS
// -------------------------------

class JsonSchemaBuilder {
    constructor(component, rootJSB) {
        this.component = component;
        this.conditions = [];
        this.required = false;
        this.dataType = {};
        // if (!rootJSB) {
        //     this.definitions = {};
        // }
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
    addDefinition(name, jsb) {
        this.definitions = this.definitions || {}; // Make sure definitions is an object
        this.definitions[name] = jsb;
        return this;
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
                if (propSchema instanceof MergeableObjectJSB && propSchema.component && propSchema.component.shrinkable()) {
                    // console.log('Shrink', propSchema.component.formioComponent.type);
                    propSchema.shrink();
                    delete this.properties[k]; // Remove shribkable schema from parent
                    this.merge(propSchema); // merge its properties and conditions with parent
                }
            }
        }
        return this;
    }
    // Subclasses overriding this method MUST call super.build()
    build() {
        // Start creating json schema from builder's dataType 
        const jsonSchema = Object.assign({}, this.dataType);

        // Compile builder's definitions (if any)
        if (this.definitions) {
            const defKeys = Object.keys(this.definitions);
            if (defKeys.length > 0) {
                jsonSchema.definitions = defKeys.reduce((defs, dk) => {
                    defs[dk] = this.definitions[dk].build();
                    return defs;
                }, {});
            }
        }
        return jsonSchema;
    }
    // Convert the specified string value to the type of this json schema
    fromString(val) {
        try {
            return JSON.parse(val);
        } catch (e) {
            return val;
        }
    }
}
class ObjectJSB extends JsonSchemaBuilder {
    constructor(component, rootJSB) {
        super(component, rootJSB);
        this.dataType.type = 'object';
        this.properties = {};
    }
    addProperty(name, jsb, required) {
        this.properties[name] = jsb;
        jsb.required = required;
        return this;
    }
    /*private*/ splitProperties() {
        const unconditionalProperties = {};
        const condPropMap = {};
        const conditionsMap = {};
        for (const pk in this.properties) {
            if (hasOwnProperty.call(this.properties, pk)) {
                const childJSB = this.properties[pk];
                if (childJSB.conditions.length === 0) {
                    // Unconditional property
                    unconditionalProperties[pk] = childJSB;
                    continue;
                }
                // Conditional property
                childJSB.prepareConditions();
                const ck = childJSB.conditions.key
                conditionsMap[ck] = childJSB.conditions;
                if (!(ck in condPropMap)) {
                    condPropMap[ck] = {};
                }
                condPropMap[ck][pk] = childJSB;
            }
        }
        return { unconditionalProperties, condPropMap, conditionsMap };
    }
    /*private*/ buildConditionalProperties(condPropMap, conditionsMap, unconditionalProperties) {
        // Generate allOf from conditional properties
        const allOf = [];
        for (const ck in condPropMap) {
            if (hasOwnProperty.call(condPropMap, ck)) {
                const conds = conditionsMap[ck];
                let condPropCounter = 0;
                const _if = {
                    properties: conds.reduce((acc, c) => {
                        const whenProp = this.properties[c.when];
                        if (whenProp) {
                            condPropCounter++;
                            const eq = whenProp.fromString(c.eq);
                            acc[c.when] = c.show ? { const: eq } : { not: { const: eq } };
                        }
                        return acc;
                    }, {})
                };
                if (condPropCounter === 0) {
                    // Move these conditional properties back to unconditional properties
                    Object.assign(unconditionalProperties, condPropMap[ck]);
                    delete condPropMap[ck];
                    continue;
                }
                const then = { required: [], properties: {} };
                for (const pk in condPropMap[ck]) {
                    if (hasOwnProperty.call(condPropMap[ck], pk)) {
                        const childJSB = condPropMap[ck][pk];
                        if (childJSB.required) {
                            then.required.push(pk);
                        }
                        then.properties[pk] = childJSB.build();
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
        return allOf;
    }
    /*private*/ buildUnconditionalProperties(unconditionalProperties) {
        const out = { required: [], properties: {} };
        for (const pk in unconditionalProperties) {
            if (hasOwnProperty.call(unconditionalProperties, pk)) {
                const childJSB = unconditionalProperties[pk];
                if (childJSB.required) {
                    out.required.push(pk);
                }
                out.properties[pk] = childJSB.build();
            }
        }
        return out;
    }
    build() {
        const jsonSchema = super.build();

        // Split conditional and unconditional properties
        const { condPropMap, conditionsMap, unconditionalProperties } = this.splitProperties();

        // Generate allOf from conditional properties.
        // Note that we have to process conditional properties first, because some
        // of them may still be moved back to unconditional properties for some reason.
        const allOf = this.buildConditionalProperties(condPropMap, conditionsMap, unconditionalProperties);

        // Build unconditional properties and add them to the json schema
        const builtUncondProps = this.buildUnconditionalProperties(unconditionalProperties);
        if (builtUncondProps.required.length > 0) {
            jsonSchema.required = builtUncondProps.required; // Add non-empty required to the json schema 
        }
        jsonSchema.properties = builtUncondProps.properties;

        // Add not empty allOf (with conditional properties) to the json schema 
        if (allOf.length > 0) {
            jsonSchema.allOf = allOf;
        }

        return jsonSchema;
    }
}
class MergeableObjectJSB extends ObjectJSB {
    constructor(component, rootJSB) {
        super(component, rootJSB);
    }
    merge(...sources) {
        const targetProps = this.properties;
        for (let i = 0, len = sources.length; i < len; i++) {
            const source = sources[i];
            if (source instanceof MergeableObjectJSB) {
                // merge properties
                const sourceProps = source.properties;
                for (const key in sourceProps) {
                    if (hasOwnProperty.call(sourceProps, key)) {
                        // Append source schema conditions to the conditions of its sub-schemas 
                        Array.prototype.push.apply(sourceProps[key].conditions, source.conditions);
                        // Merge properties recursively
                        if (targetProps[key] && sourceProps[key] instanceof MergeableObjectJSB) {
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
class ArrayJSB extends JsonSchemaBuilder {
    constructor(component, items, rootJSB) {
        super(component, rootJSB);
        this.dataType.type = 'array';
        this.dataType.items = items;
    }
    build() {
        const jsonSchema = super.build();
        jsonSchema.items = this.dataType.items.build();
        return jsonSchema;
    }
}
class PrimitiveJSB extends JsonSchemaBuilder {
    constructor(component, type, rootJSB) {
        super(component, rootJSB);
        this.dataType.type = type;
    }
}
class BooleanJSB extends PrimitiveJSB {
    constructor(component, rootJSB) {
        super(component, 'boolean', rootJSB);
    }
}
class NumberJSB extends PrimitiveJSB {
    constructor(component, rootJSB) {
        super(component, 'number', rootJSB);
        if (component && component.formioComponent && component.formioComponent.validate) {
            const validate = component.formioComponent.validate;
            if (validate.min || typeof validate.min === 'number') this.dataType.minimum = Number(validate.min);
            if (validate.max || typeof validate.max === 'number') this.dataType.maximum = Number(validate.max);
            if (validate.integer) this.dataType.type = 'integer';
        }
    }
}
class StringJSB extends PrimitiveJSB {
    constructor(component, rootJSB) {
        super(component, 'string', rootJSB);
        if (component && component.formioComponent && component.formioComponent.validate) {
            const validate = component.formioComponent.validate;
            if (validate.minLength) this.dataType.minLength = Number(validate.minLength);
            if (validate.maxLength) this.dataType.maxLength = Number(validate.maxLength);
            if (validate.pattern) this.dataType.pattern = validate.pattern;
        }
    }
    fromString(val) {
        return val;
    }
}

class EnumJSB extends JsonSchemaBuilder {
    constructor(component, values, rootJSB) {
        super(component, rootJSB);
        this.dataType.enum = values;
    }
    fromString(val) {
        if (!this.dataType.enum.includes(val)) {
            const v = super.fromString(val);
            if (v !== val && this.dataType.enum.includes(v)) {
                return v;
            }
        }
        return val; 
    }
}

// -------------------------------
// COMPONENT BASE CLASSES
// -------------------------------

class Component {
    constructor(formioComponent) {
        this.formioComponent = formioComponent;
    }
    jsonSchemaBuilder(rootJSB) {
        throw new Error('Subclasses of \'Component\' have to implement the method \'jsonSchemaBuilder\'!');
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
    jsonSchemaBuilder(rootJSB) {
        const jsb = this.baseJsonSchemaBuilder();
        if (this.formioComponent.multiple) {
            if (this.formioComponent.validate && !this.formioComponent.validate.required) {
                // With multiple values enabled the component can generate null items if required is false
                jsb.dataType = { anyOf: [jsb.dataType, { type: 'null' }] };
            }
            return new ArrayJSB(this, jsb, rootJSB);
        }
        return jsb;
    }
    baseJsonSchemaBuilder() {
        throw new Error('Subclasses of \'AtomicComponent\' have to implement the method \'baseJsonSchemaBuilder\'!');
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
    jsonSchemaBuilder(rootJSB) {
        const jsb = new MergeableObjectJSB(this, rootJSB);
        this.childrenJsonSchemaBuilder(jsb, rootJSB);
        return jsb.shrink();
    }
    /*prorected*/ children() {
        return this.formioComponent.components;
    }
    // Subclasses can override this method to provide a default class
    // for children that don't have a type
    /*prorected*/ defaultChildClass() {
        return undefined;
    }
    /*prorected*/ childrenJsonSchemaBuilder(parentJSB, rootJSB) {
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
                let jsb = new (type)(c).jsonSchemaBuilder(rootJSB);
                const required = c.validate && c.validate.required;
                // Dotted key means nested schema
                const keyParts = c.key.split('.');
                for (let j = keyParts.length - 1; j > 0; j--) {
                    jsb = new MergeableObjectJSB(undefined).addProperty(keyParts[j], jsb, required);
                }
                parentJSB.merge(new MergeableObjectJSB(undefined).addProperty(keyParts[0], jsb, required))
            }
            else {
                // console.log(this.formioComponent.type, ": skipping child with unknown type", c.type);
            }
        }
        return parentJSB;
    }
}

// -------------------------------
// ABSTRACT COMPONENT CLASSES
// -------------------------------

class StringComponent extends AtomicComponent {
    baseJsonSchemaBuilder() {
        return new StringJSB(this);
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
    baseJsonSchemaBuilder() {
        const values = this.values().map(v => this.cast(v.value, this.formioComponent.dataType));
        if (this.formioComponent && this.formioComponent.validate && !this.formioComponent.validate.required) {
            Array.prototype.push.apply(values, this.additionalValuesIfNotRequired);
        }
        return new EnumJSB(this, values);
    }
}

// -------------------------------
// BASIC COMPONENTS
// -------------------------------

class CheckboxComponent extends AtomicComponent {
    baseJsonSchemaBuilder() {
        return new BooleanJSB(this);
    }
}

class NumberComponent extends AtomicComponent {
    baseJsonSchemaBuilder() {
        return new NumberJSB(this);
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
    jsonSchemaBuilder() {
        const jsb = super.jsonSchemaBuilder();
        // If multiple values are enabled ensure uniqueness
        if (jsb instanceof ArrayJSB) {
            jsb.dataType.uniqueItems = true;
        }
        return jsb;
    }
    // This has changed with formio 4.10.x used by angular-formio 4.8.x
    // Now cast defaults to 'auto'
    // isDefaultCastToString() {
    //     return true; // cast defaults to 'string'
    // }
}

class SelectBoxesComponent extends AtomicComponent {
    baseJsonSchemaBuilder() {
        const jsb = new ObjectJSB(this);
        jsb.dataType.additionalProperties = false;
        const values = this.formioComponent.values
            .forEach(v => jsb.addProperty(v.value, new BooleanJSB(undefined), true));
        if (this.formioComponent.validate && !this.formioComponent.validate.required) {
            // This is needed for compatibility.
            // Formio adds a boolean property with name "" when the component is not required.
            // The property itself must not be required
            jsb.addProperty('', new BooleanJSB(undefined), false);
        }
        return jsb;
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
    jsonSchemaBuilder() {
        return this.formioComponent.storeas === 'array' ?
            new ArrayJSB(this, this.baseJsonSchemaBuilder())
            : this.baseJsonSchemaBuilder();
    }
    baseJsonSchemaBuilder() {
        return new StringJSB(this);
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

class ContainerComponent extends CompoundComponent {}

class DataGridComponent extends CompoundComponent {
    jsonSchemaBuilder(rootJSB) {
        return new ArrayJSB(this, super.jsonSchemaBuilder(rootJSB));
    }
}

class EditGridComponent extends CompoundComponent {
    jsonSchemaBuilder(rootJSB) {
        return new ArrayJSB(this, super.jsonSchemaBuilder(rootJSB));
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
    jsonSchemaBuilder(rootJSB) {
        return new TreeJSB(this, super.jsonSchemaBuilder(rootJSB), rootJSB);
    }
}
class RefJSB extends JsonSchemaBuilder {
    constructor(component, ref, rootJSB) {
        super(component, rootJSB);
        this.dataType.$ref = ref;
    }
}
class TreeJSB extends RefJSB {
    constructor(component, dataJSB, rootJSB) {
        super(component, 'tree_' + Math.floor(Math.random() * 1000000), rootJSB);
        const schemaId = this.dataType.$ref;
        this.dataType.$ref = "#/definitions/" + schemaId;

        const treeJSB = new ObjectJSB(component)
            .addProperty('data', dataJSB, true)
            .addProperty('children', new ArrayJSB(component, new RefJSB(undefined, this.dataType.$ref)), true);
        
        rootJSB.addDefinition(schemaId, treeJSB);
    }
}

// -------------------------------
// FORM COMPONENT
// -------------------------------
class FormComponent extends CompoundComponent {
    /*prorected*/ childrenJsonSchemaBuilder(parentJSB, rootJSB) {
        // For form's children parent  and root are the same
        return super.childrenJsonSchemaBuilder(parentJSB, parentJSB);
    }
}

const MAP = {
    checkbox: CheckboxComponent,
    columns: ColumnsComponent,
    container: ContainerComponent,
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
    return new FormComponent(form).jsonSchemaBuilder().build();
}