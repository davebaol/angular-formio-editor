import schema from './_';
import components from './components';
import componentStrict from './component_strict';
import componentLoose from './component_loose';
import logic from './component-logic';
import trigger from './component-logic-trigger';
import action from './component-logic-action';
import conditional from './component-conditional';
import showStrict from './component-conditional-show_strict';
import showLoose from './component-conditional-show_loose';

export const strict = {
    schema,
    schemaRefs: {
        components,
        component: componentStrict,
        logic,
        trigger,
        action,
        conditional,
        show: showStrict
    }
};

export const loose = {
    schema,
    schemaRefs: Object.assign({}, strict.schemaRefs, {
        component: componentLoose,
        show: showLoose
    })
};
