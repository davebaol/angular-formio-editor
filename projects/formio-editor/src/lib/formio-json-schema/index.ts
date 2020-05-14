import schema from './_';
import components from './components';
import component from './component/_';
import logic from './component/logic/_';
import trigger from './component/logic/trigger';
import action from './component/logic/action';

export default {
    schema,
    schemaRefs: {
        components,
        component,
        logic,
        trigger,
        action
    }
};
