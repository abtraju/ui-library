ZC.environment = 'development'; // No I18N
ZC.handleExceptions = function(instance) {
    instance = new Proxy(instance, { // Browser Support: Chrome(49), Firefox(18), Safari(10) and Opera(36)
        get: function(target, propertyName, propertyValue) {
            if (typeof propertyName !== 'symbol') { // No I18N
                // constructor methods invocation has property name type as symbol.
                if (target[propertyName]) {
                    return target[propertyName];
                } else if (!propertyName.startsWith('on')) { // No I18N
                    // property names starting with on is excluded because we use on prefix for event callbacks.
                    // return function(){
                    // 	window["con"+"sole"].error("Method \"" + propertyName + "\" is not present in this Component. Kindly go through the API in", "ht"+"tp://zohocomponents/"); // No I18N
                    // 	return undefined;
                    // };
                    return undefined;
                }
            }
        },
        set: function(target, propertyName, propertyValue) {
            // if(target[propertyName] !== undefined || propertyName.startsWith("on")){ // No I18N
            // check is removed since using some properties for component's internal usage will have the value of undefined.
            target[propertyName] = propertyValue;
            // }
            return true;
        }
    });
    return instance;
}
