export default {
    schema: require('./_.json'),
    schemaRefs: {
        components: require('./components.json'),
        component: require('./component/_.json'),
        logic: require('./component/logic/_.json'),
        trigger: require('./component/logic/trigger.json'),
        action: require('./component/logic/action.json')
    }
};
