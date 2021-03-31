/* Core Variable */
let needToInit = true,
    userAgent = navigator.userAgent.toLowerCase(),
    sourceDiv = document.createElement('div'),
    sourceText = document.createTextNode(' '),
    objectProperties = [ '_CLASSES', '_EVENTS', '_SELECTORS', '_attrs', '_props' ]; // No I18N
sourceDiv.appendChild(sourceText);
let useWebComponentsSelector = window.ZComponentsConfig && window.ZComponentsConfig.useWebComponentsSelector;
let ZComponents = {
    pluginPrefix: 'zs', // No I18N
    changeSet: '{{versionChangeSet}}', // No I18N
    isRTL: false,
    selector: 'data-ctype', // No I18N
    version: '{{currentVersion}}', // No I18N
    environment: 'production', // No I18N
    userAgent: userAgent,
    webComponents: [],
    webComponentsToInit: [],
    SVG: {},
    Templates: {},
    webComponentsSupport: false,
    useWebComponentsSelector: useWebComponentsSelector === undefined ? false : useWebComponentsSelector,
    _animationEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend transitionend', // No I18N
    _transitionEnd: 'webkitTransitionEnd, otransitionend, oTransitionEnd, msTransitionEnd, transitionend', // No I18N
    locale: 'en-US', // No I18N
    zIndex: 1000, // ZIndex can be used for components like dialog.
    $window: $(window),
    $document: $(document),
    $body: $('body'), // No I18N
    DOMUtil: $,
    DOMUtilInstance: window.$ZCDOMUtil || $,
    keys: {},
    minimizeArray: [],
    keyCode: {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38,
        ALT: 18
    },
    isEmpty(obj) {
        return !(obj && Object.keys(obj).length);
    },
    iterateData(data, callback) {
        return Array(data).join(0).split(0).map(callback);
    },
    getKebabCaseKey(string) {
        return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    },
    getID(cName, element, prefix, suffix) {
        cName = cName || ''; // No I18N
        if (element instanceof this.DOMUtilInstance) {
            element = element[0];
        }
        return (element && element.id || cName + '-' + (prefix ? prefix + '-' : '') + Math.round(Math.random() * 100000000) + (suffix ? '-' + suffix : '')); // No I18N
    },
    _getIconInfo(iconClass, svgIconId, defaultSVGId, defaultIconClassName, options) {
        let svgIconClass, hasIcon;
        options = options || {};
        svgIconId = !iconClass && !svgIconId ? defaultSVGId : svgIconId;
        if (svgIconId) {
            let iconInfo = svgIconId.split(' '); // No I18N
            svgIconId = iconInfo[0];
            svgIconClass = iconInfo[1] ? iconInfo.slice(1).join(' ') : undefined; // No I18N
            iconClass = undefined;
            hasIcon = true;
        }
        options.icon = hasIcon || defaultIconClassName || iconClass;
        options.iconClassName = ((defaultIconClassName || '') + ' ' + (iconClass || '')).trim(); // No I18N
        options.SVGIconClassName = svgIconClass || options.SVGIconClassName || ''; // No I18N
        if (svgIconId) {
            options.SVGIconId = ((svgIconId.indexOf('#') < 0 ? '#' : '') + svgIconId); // No I18N
        }
        return options;
    },
    createElement(opt, compWOPrefix, doNotInitialize) {
        opt = opt || {};
        let compWithZPrefix = 'z' + compWOPrefix; // No I18N
        let options = Object.create(opt),
            tagNames = ZC.tagNames[compWithZPrefix],
            tagNameInOpt = opt.tagName,
            normalTag = tagNameInOpt || tagNames[0],
            customTag = tagNameInOpt || tagNames[1],
            appendTo = options.appendTo,
            tempElement = options.mainElement || document.getElementById(options.id); // Object.create is used to avoid same memory reference problem.
        if (tempElement) {
            let componentData = $(tempElement).data(compWithZPrefix),
                container, element;
            if (componentData) {
                if (componentData.container) {
                    container = componentData.container[0];
                }
                element = componentData.element[0];
                return (options.isCE ? element : (container ? [ element, container ] : [ element ]));
            }
        }
        let tagName = (options.isCE ? customTag : normalTag) || 'div', // No I18N
            domEle = options.id && document.getElementById(options.id),
            element = domEle || document.createElement(tagName),
            $element = $(element),
            attributes = options.customAttributes,
            isCustomTag = tagName.indexOf('-') > -1; // No I18N
        if (options.id) {
            attributes = attributes || {};
            attributes.id = options.id
        }
        if (attributes) {
            $element.attr(attributes);
        }
        // This part of code is moved above, since for datepicker like components, setProperties has to be called before the children components are initialized
        // (faced an issue for beforedatecellrender event)
        if (isCustomTag && options) {
            // window.setTimeout(function() { // ##revisit temporarily added since setProperties is undefined error thrown.
            element._zinitdata = options;
            // element.setProperties(options);
            // }, 20)
            // element.textContent = options.text; to be removed
        }
        if (!options.templateRender) {
            appendTo = $(appendTo || 'body')[0];
            if (options.insertBefore) {
                appendTo.parentNode.insertBefore(element, appendTo);
            } else {
                appendTo.appendChild(element)
            }
        }

        if (!isCustomTag && !doNotInitialize) {
            let instance = ZC[compWOPrefix]($element, options); // Initialize the component if its not a custom tag.
            if (opt.templateRender) {
                // If this.container & this.element are different, both this.element and this.container should be moved to the appropriate position in the template.
                if (instance.container && instance.container[0] !== instance.element[0]) {
                    return [ instance.element[0], instance.container[0] ];
                }
                return [ instance.element[0] ];
            }
            return instance.element;
        }
        // storing in data is needed if not initialized.. For ex: Buttongroup like components where inner buttons won't be initialized.
        !isCustomTag && $.data(element, 'ZCOpts', options); // No I18N
        return element;
    },
    OS: {
        isLinux() { // appVersion holds the version details alone in some browsers. Also spec specifies to return platform as empty string by some browsers. Hence, added three conditions.
            return navigator.appVersion.indexOf('Linux') > -1 || userAgent.indexOf('Linux') > -1 || navigator.platform.indexOf('Linux') > -1; // No I18N
        },
        isMac() {
            return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
        },
        isWindows() {
            return navigator.platform.indexOf('Win') > -1; // No I18N
        }
    },
    _getEvents(current = [], parent = []) {
        return parent.concat(current).filter((elem, pos, arr) => arr.indexOf(elem) === pos);
    },
    registerComponent(componentName, parentComponent, protoObj) {
        let subComponent;
        if (protoObj) {
            subComponent = true;
        } else {
            protoObj = parentComponent;
            parentComponent = this.CoreComponent;
        }
        let len = objectProperties.length,
            prop;
        let compWOPrefix = componentName.toLowerCase().replace(/^z/, '');// No I18N
        let compWithZPrefix = 'z' + compWOPrefix; // No I18N

        let parentProto = parentComponent.prototype;

        // typeof protoObj will be a function for Javascript ES6 Class.
        if (subComponent && typeof protoObj === 'object') { // No I18N
            protoObj = this._objectTypeFallback(protoObj, compWithZPrefix, parentComponent, parentProto);
        }
        let tagNames = ZC.tagNames[compWithZPrefix];
        let isWebComponent = (tagNames && tagNames[1] && this.webComponentsSupport);
        let useWebComponentsSelector = this.useWebComponentsSelector;
        if (isWebComponent && useWebComponentsSelector) {
            protoObj.prototype.isCE = true;
        }

        let proto = protoObj.prototype,
            tempProp;
        for (let i = 0; i < len; i++) {
            prop = objectProperties[i];
            tempProp = prop.replace('_', ''); // No I18N
            if (prop === '_EVENTS') {
                proto[prop] = this._getEvents(proto[tempProp], parentProto[tempProp]);
                proto[prop] = this._getEvents(proto[prop], parentProto[prop]);
                proto[prop].push('beforedestroy'); // No I18N
            } else {
                proto[prop] = $.extend(true, prop === '_attrs' ? {
                    rtl: false,
                    templateData: null,
                    templateFunc: null,
                    zclassName: null,
                    templateRender: null
                } : {}, parentProto[tempProp] || {}, parentProto[prop] || {}, proto[tempProp] || {});
            }
        }
        proto._DEFAULTS = $.extend(true, {}, proto._attrs, proto._props);
        /* Adding propType for webComponent and for js component that have null or undefined as default value for its options. Example for js comp: dropdownlist, listbox */
        if (this.webComponentsSupport || parentProto.propType || proto.propType) {
            proto._propType = $.extend(true, this._getDataInfo(proto._DEFAULTS), parentProto.propType || {}, parentProto._propType || {}, proto.propType || {});
        }
        // Since we have used 'z' prefix in all the templates & tagNames
        if (isWebComponent) {
            if (useWebComponentsSelector) {
                protoObj.prototype.isCE = false;
            } else {
                this.register(tagNames[1], protoObj, parentComponent);
            }
        }
        this[componentName] = protoObj;

        if (!this[compWithZPrefix]) {
            let DEFAULTS = {},
                Templates = {};
            if (subComponent) {
                let parentObject = this[parentProto.name];
                if (parentObject) {
                    $.extend(Templates, parentObject.Templates);
                }
            }
            this[compWithZPrefix] = {
                DEFAULTS,
                Templates
            }
            let methodName = 'create' + componentName.substr(1); // No I18N
            if (!ZC[methodName]) {
                ZC[methodName] = (options) => ZC.createElement(options, compWOPrefix);
            }
        }
        this[compWOPrefix] = function(element, options) { // To Support ZC.<componentName>() Invocation.
            element = $(element);
            if (element.length > 1) { // To help initializing multiple elements.
                let resultArray = [];
                for (let k = 0; k < element.length; k++) {
                    resultArray[k] = ZComponents._createComponent(element[k], options, componentName, protoObj);
                }
                return resultArray;
            }
            return ZComponents._createComponent(element, options, componentName, protoObj);

        };
        let compPluginName = this.pluginPrefix + compWOPrefix;
        $.prototype[compPluginName] = function(options) { // Assigning the childComponent to global scope... [ Alternative to JQuery's Method ]
            let returnValue = this,
                length = this.length;
            if (!options || typeof options === 'object') { // component is initialized
                options = options || {};
                for (let i = 0; i < length; i++) {
                    ZComponents._createComponent(this[i], options, componentName, protoObj, true);
                }
            } else if (typeof options === 'string' && options.indexOf('_') < 0) { // No I18N
                // Public Method Invocation
                let params = Array.prototype.slice.call(arguments, 1);
                for (let i = 0; i < length; i++) {
                    let componentInstance = $(this[i]).data(compWithZPrefix);
                    if (componentInstance) {
                        returnValue = componentInstance[options].apply(componentInstance, params);
                    }
                }
            } else {
                return false;
            }
            return returnValue;
        };
    },
    _getDataInfo(defaults) {
        let optionsType = {};
        for (let key in defaults) {
            let value = defaults[key];
            if (value !== undefined && value !== null) { // for checking boolean value, if(value) is avoided
                optionsType[key] = Array.isArray(value) ? 'array' : typeof value;
            }
        }
        return optionsType;
    },
    _defineGetProp(proto, attrName, value) {
        Object.defineProperty(proto, attrName, {
            get: function() {
                return value;
            }
        });
    },
    _extend(target, base) {
        // target.prototype = $.extend({},base.prototype,target.prototype);
        $.each(target.prototype, function(prop, value) {
            if (typeof value === 'function') { // No I18N
                target.prototype[prop] = (function() {
                    let _super = function() {
                        return base.prototype[prop].apply(this, arguments);
                    };
                    return function() {
                        this._super = _super;
                        return value.apply(this, arguments);
                    };
                }());
            }
        });
    },
    _createComponent(element, options, cName, prototype, returnElement) {
        element = $(element);
        let cnamelower = cName.toLowerCase();
        if (element[0] && (element[0] === window || element[0].nodeType)) {
            if (element.data(cnamelower)) {
                return returnElement ? element : element.data(cnamelower);
            }
            let data = this._getInitOpts(element, cnamelower, options, prototype),
                instance = new ZComponents[cName](element, data, options);
            if (ZC.environment === 'development' && ZC.handleExceptions) { // No I18N
                // Exception handling will be performed for development environment only.
                instance = ZC.handleExceptions(instance);
            }
            if (!document.body.contains(element[0])) { // existing element was removed during component initialization.
                element = instance.element;
            }
            element.data({
                [cnamelower]: instance,
                componentName: cnamelower
            });
            return instance;

        }
    },
    _getInitOpts(element, componentName, options, mainProto) {
        let eleOptions = ZC._getOpts(element, mainProto);
        if (eleOptions.override) { // handling the case where two or more components share the same set of attributes.
            let newArray = {};
            for (let obj in eleOptions) {
                if (obj.indexOf(componentName) === 0) {
                    let result = obj.replace(componentName, ''), // No I18N
                        keyName = result[0].toLowerCase() + result.substring(1);
                    newArray[keyName] = eleOptions[obj];
                }
            }
            eleOptions = newArray;
        }
        return $.extend(true, {}, ZC[componentName] ? ZC[componentName].DEFAULTS : {}, eleOptions, options);
    },
    _getOpts(element, mainProto) {
        element = element instanceof ZC.DOMUtilInstance ? element[0] : element;
        if (element) {
            let tagName = element.tagName || '',
                object;
            // NeedCodeRevisit
            if (this.webComponentsSupport && window.customElements ? customElements.get(tagName.toLowerCase()) : undefined) {
                if (!element.$c) {
                    this._triggerConnectedCallback(element);
                }
                object = element.$c[element.$c.parentElement ? '_subOpts' : '_opts']; // No I18N
            } else {
                object = $.data(element, 'ZCOpts'); // No I18N
                if (!object && element.attributes) {
                    let dataAttr = element.getAttribute('data'); // No I18N
                    if (dataAttr) {
                        // Retrieving options present in data attribute as a json.
                        object = ZComponents._getObject(dataAttr, element, mainProto);
                    }
                    // element.dataset produces incorrect results in IE 11 browser.
                    object = this[element.dataset && !ZC.Browser.isIE ? '_getDataSet' : '_getDataAttributes'](element, object || {}, mainProto); // No I18N
                    $.data(element, 'ZCOpts', object); // No I18N
                }
            }
            return object || {};
        }
    },
    getOpts() {
        return ZC._getOpts(...arguments);
    },
    _getObject(data, element, mainProto, aName) {
        if (typeof data === 'object') { // No I18N
            return data;
        }
        data = data || element.getAttribute('data'); // No I18N
        data = data.indexOf('{') < 0 ? `{ ${data} }` : data; // No I18N
        try {
            data = JSON.parse(data.replace(/'/g, '"')); // No I18N
        } catch (error) { // props check added since data might contain braces in them intentionally.
            data = (!aName || (mainProto && Object.keys(mainProto.prototype._props).indexOf(aName) > -1)) ? {} : data;
        }
        return data;
    },
    _getDataSet(element, object, mainProto) {
        let data = element.dataset,
            value;
        for (let i in data) {
            // Removed hasOwnProperty check since i will be obviously present in data
            /* replace svg and Html as Caps */
            value = data[i];
            i = this._getCorrectedKey(i);
            object[i] = this._normalizeValue(i, value, mainProto && mainProto.prototype, mainProto);
        }
        return object;
    },
    _getCorrectedKey(key) {
        return key
            .replace(/(Html|Svg|svg|Hsv|Hsl|Rgb)/g, (x) => x.toUpperCase())
            .replace(/^(OKButton)/i, 'OKButton'); // No I18N
    },
    _normalizeValue(optionName, value, instance, mainProto) {
        if (value) {
            let propType = instance && instance._propType;
            if (propType && propType[optionName]) {
                let dataType = propType[optionName];
                try {
                    switch (dataType) {
                        case 'boolean': // No I18N
                            value = value === 'true' || value === optionName; // No I18N
                            break;
                        case 'array': // No I18N
                            value = JSON.parse(value);
                            break;
                        case 'object': // No I18N
                            value = ZComponents._getObject(value, undefined, mainProto, optionName);
                            break;
                        case 'number': // No I18N
                            value = parseFloat(value);
                            break;
                    }
                } catch (e) {
                    return value;
                }
            } else {
                value = (value === 'true' || value === 'false') ? value === 'true' : value.indexOf('{') < 0 ? value : ZComponents._getObject(value, undefined, mainProto, optionName);
            }
        }
        return value;
    },
    _getDataAttributes(element, object, mainProto) {
        let data = element.attributes,
            len = data.length;
        for (let i = 0; i < len; i++) {
            let name = data[i].nodeName,
                value = data[i].nodeValue === '' ? 'true' : data[i].nodeValue; // No I18N
            if (name !== 'data' && name.match(/^data-/)) { // No I18N
                // data-* attributes and other attributes
                name = ZC._getCamelCaseStr(name.replace(/^data-/, '')); // No I18N
                /*  replacing the hyphenated names to camelCase
                    modified the optionName since providing data-inner-html attribute in html element will be converted to innerHtml only.
                    replace svg and Html as Caps */
                object[name] = this._normalizeValue(i, value, mainProto && mainProto.prototype, mainProto);
            }
        }
        return object;
    },
    _getCamelCaseStr(str) {
        return str.replace(/(-html|-svg|svg|-hsv|-hsl|-rgb)|(-\w)/gi, (x) => x.replace('-', '').toUpperCase());
        // changing the Ui by using the above regex replaces the menuId key also. So, we need below stmt in addition.
        // Since, it is a costly operation, Currently that component needs to handle it. If we need this for more no of components, we will enable them.
        // str = str.replace(/(ui|Ui)[A-Z]+/g, function(match){ return match.toUpperCase()});
    },
    _init() {
        if (ZComponents.webComponentsSupport) {
            let componentInstances = ZComponents.webComponentsToInit;
            /* Web component initialization has been moved from connectedCallback to here. Since textNode and other children will not be available on connectedCallback. */
            if (componentInstances && componentInstances.length) {
                componentInstances.forEach((instancesArr) => {
                    if (typeof instancesArr !== 'string') {
                        instancesArr.forEach((instance) => {
                            $(instance.element).data(instance.name, instance);
                            instance._initComp();
                            instance._appendTemplateContent();
                        });
                    }
                });
                ZComponents.webComponentsToInit = [];
            }
        }
        ZComponents.setProperties();
    },
    setProperties() {
        let doc = document.documentElement || {},
            body = document.body || {};
        ZComponents.documentObject = {
            height: Math.max(doc.clientHeight, doc.scrollHeight, doc.offsetHeight, body.offsetHeight, body.scrollHeight),
            width: Math.max(doc.clientWidth, doc.scrollHeight, doc.offsetHeight, body.offsetWidth, body.scrollWidth)
        };
        ZComponents.windowObject = {
            height: window.innerHeight,
            width: window.innerWidth
        };
    },
    _render(data, componentName, templateName, element, appendTo, otherParams) { // No I18N
        let isCE = otherParams.isCE;
        let skipParent = otherParams.skipParent;
        let container = otherParams.container;
        let refElement = otherParams.refElement;
        let isContainer = false,
            templates = ZC[componentName].Templates;
        data.zElement = false;
        templateName = templateName || 'children'; // No I18N
        templateName = isCE ? 'WC' + (templateName[0].toUpperCase() + templateName.substr(1)) : templateName;
        if (!skipParent && !container) {
            let templateFunc = templates[isCE ? 'WCContainer' : 'container']; // No I18N
            if (templateFunc) {
                element = ZT.DOM(templateFunc(data)); // No I18N
                if (appendTo) {
                    $(element).appendTo(appendTo);
                } else if (refElement) {
                    $(element).insertAfter(refElement);
                }
                isContainer = true;
            }
        } else {
            element = element || (skipParent ? container || refElement : refElement);
        }
        let templateFunc = templates[templateName];
        if (templateFunc) {
            ZT.renderView(templateFunc(data), element);
        }
        if (isContainer) {
            data.zElement = true;
            /* !data.isCE && This is removed since whether it is a webcomponent/jscomponent, when container is present, the actual element should be hidden.  */
            !data.differentAppend && $(refElement).hide();
        }
        return element; // element has to be returned always since methods using ZC._render has stored the element for further processing.
    },
    // stored in ZC scope in order to use in Alert Dialog like components.
    _handleFocus(element, componentName) {
        element = $(element);
        let keyCodes = ZC.keyCode,
            keyCode,
            focusClass = 'has-focus', // No I18N
            mfocusCls = 'has-mfocus', // No I18N
            kfocusCls = 'has-kfocus', // No I18N
            nameSpace = '.fs.' + componentName, // No I18N
            eventType = '', // No I18N
            isUI = false,
            blurEventName = 'blur' + nameSpace, // No I18N
            focusEventName = 'focus' + nameSpace, // No I18N
            eventNames = 'mousedown' + nameSpace + ' keydown' + nameSpace + ' keyup' + nameSpace; // No I18N
        /* Since event order is mousedown, focus, mouseup followed by click. Binding mousedown here. */
        element.off(eventNames + ' ' + blurEventName + ' ' + focusEventName).on(eventNames, (event) => { // No I18N
            if (element.hasClass('is-disabled')) { // No I18N
                return;
            }
            if (event.originalEvent && event.type !== 'keyup') { // No I18N
                // If the element is already active element, then the focus event is not triggered after mousedown. So, activeElement check included.
                isUI = document.activeElement !== element[0]; // since originalEvent is present for triggered focus events too. Maintaining a variable to distinguish triggered focus and UI focus.
            }
            keyCode = event.keyCode;
            eventType = event.type === 'mousedown' ? mfocusCls : kfocusCls; // No I18N
            if ((event.type === 'keydown' && keyCode !== keyCodes.ENTER && keyCode !== keyCodes.SPACE) || (event.type === 'keyup' && keyCode !== keyCodes.TAB)) { // No I18N
                return;
            }
            element.addClass(focusClass + ' ' + eventType); // No I18N
        }).on(blurEventName, () => element.removeClass(focusClass + ' ' + mfocusCls + ' ' + kfocusCls)) // No I18N
            .on(focusEventName, () => {
                if (element.hasClass('is-disabled')) { // No I18N
                    return;
                }
                // originalEvent check is added since trigger(focus) should focus the element.
                if (!isUI) {
                    element.addClass(focusClass + ' ' + kfocusCls);
                }
                isUI = false;
            });
    },
    encodeHTML(str) {
        sourceText.nodeValue = str;
        return sourceDiv.innerHTML;
    },
    // Component Users can set I18N for all Components at once or individual components separately.
    setI18NKeys(moduleName, values, replace) {
        if (typeof moduleName === 'object') { // No I18N
            // {"zdialog" : {"close":"Close the Dialog"},"ztooltip":{"close": "Close Text"} }
            for (let i in moduleName) {
                this.keys[i] = $.extend({}, this.keys[i], moduleName[i]);
            }
        } else {
            // module name is a string. Format: "zdialog",{ "close" : "Close the Dialog"}, true or false
            this.keys[moduleName] = replace ? values : $.extend({}, this.keys[moduleName], values);
        }
    },
    _triggerFunction(functionName, context, params) {
        // Invoking functions which are passed as strings in HTML Elements.
        let executionContext = ZC._getContext(functionName);
        return executionContext && executionContext.apply(context, params);
    },
    _getContext(functionName) {
        if (typeof functionName === 'string') {
            let executionContext = window,
                namespaces = functionName.split('.'); // No I18N
            for (let i = 0; i < namespaces.length && executionContext; i++) {
                executionContext = executionContext[namespaces[i]];
            }
            return executionContext;
        }
        return functionName;
    },
    getI18NText(moduleName, key, stringArray) {
        let defaultKeys;
        if (arguments.length === 4) {
            defaultKeys = stringArray;
            stringArray = arguments[3];
        }
        let keyObject = ZComponents.keys[moduleName] || {},
            ii8nText = keyObject[key] || '';
        if (ii8nText === '' && defaultKeys) { // No I18N
            ii8nText = defaultKeys[key];
        }
        if (stringArray) {
            for (let i = 0; i < stringArray.length; i++) {
                ii8nText = ii8nText.replace('{' + i + '}', stringArray[i]); // No I18N
            }
        }
        return ii8nText;
    },
    create(initObject) {
        let componentName = initObject.ctype.replace(initObject.ctype.charAt(0), ''); // No I18N
        return this['create' + componentName.charAt(0).toUpperCase() + componentName.substring(1)](initObject); // No I18N
    },
    getRTLBasedDir(direction, rtl) {
        if (rtl) {
            return direction.replace(/(left|right)/, ($0) => $0 === 'left' ? 'right' : 'left'); // No I18N
        }
        return direction;
    },
    display(hide, element) {
        if (!ZC._display) {
            let flexElement = sourceDiv.cloneNode(),
                flexString = [ '-webkit-box', '-moz-box', '-ms-flexbox', '-webkit-flex', 'flex' ].map((val) => 'display:' + val).join(';'); // No I18N
            document.body.appendChild(flexElement).setAttribute('style', flexString);
            ZC._display = window.getComputedStyle(flexElement).display;
            flexElement.parentElement.removeChild(flexElement);
        }
        // more than one elements might be passed from the components. For Ex: Refer Date Picker Drilldown Animation. So, reverting the code to jQuery syntax.
        $(element).css('display', hide ? 'none' : ZC._display); // No I18N
        return element;
    },
    Browser: {
        isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
        isIE: userAgent.indexOf('msie') > -1 || userAgent.indexOf('.net') > -1, // No I18N
        isEdge: userAgent.indexOf('edge') > -1, // No I18N
        isSafari: userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') < 0, // No I18N
        isChrome: userAgent.indexOf('chrome') > -1 && navigator.vendor.indexOf('Google Inc') > -1 && userAgent.indexOf('opr') === -1, /* Since window.chrome returns an object in edge, condition has been revisited */ // No I18N
        isFirefox: userAgent.indexOf('firefox') > -1,
        getIEVersion() {
            let rv = -1; // Return value assumes failure.
            if (ZC.Browser.isIE) {
                let match = userAgent.match(/MSIE (\d*)/i);
                if (!match) {
                    match = userAgent.match(/Trident.*rv:(\d*)/i)
                }
                if (match) {
                    rv = parseInt(match[1]);
                }
            }
            return rv;
        },
        getFirefoxVersion() {
            let res = -1;
            if (ZC.Browser.isFirefox) {
                res = parseInt(userAgent.match(/Firefox\/(\d*)/i)[1]);
            }
            return res;
        }
    },
    _objectTypeFallback(protoObj, cnamelower, parentComponent, parentProto) {
        let propsToBeMergedWithParent = [ 'name', 'attrs', 'props', 'CLASSES', 'EVENTS', 'SELECTORS' ]; // No I18N
        protoObj.name = cnamelower;
        // class is created by extending parent component
        let childClass = class extends parentComponent {};
        let childPrototype = childClass.prototype;
        for (let property in protoObj) {
            if (protoObj.hasOwnProperty(property)) {
                let value = protoObj[property];
                let parentValue = childPrototype[property];
                let propertyDescriptor;
                let isFunc = typeof value === 'function'; // No I18N
                let doesParentHasProperty;
                if (!isFunc) {
                    let currentProto = parentProto;
                    // Looping is done becos property descriptor is not returned if it is the property of the __proto__ object.
                    while (currentProto && !(doesParentHasProperty = currentProto.hasOwnProperty(property))) {
                        currentProto = Object.getPrototypeOf(currentProto);
                    }
                    if (doesParentHasProperty) {
                        propertyDescriptor = Object.getOwnPropertyDescriptor(currentProto, property);
                    }
                }
                // If function, property descriptor need not be checked.
                // If the property is writable, it could be assigned directly. Else it is deleted and reassigned using getter in the else part.
                if (isFunc || !doesParentHasProperty || propertyDescriptor.writable) {
                    childPrototype[property] = value;
                } else {
                    if (doesParentHasProperty) {
                        if (typeof value === 'object') { // No I18N
                            // The property need not be deleted because it is not present in the childPrototype but in its prototype chain.
                            // delete childPrototype[property];
                            // Only certain properties are merged, others are overridden.
                            if (propsToBeMergedWithParent.indexOf(property) !== -1) {
                                if (Array.isArray(value)) {
                                    value = parentValue.concat(value);
                                } else {
                                    value = $.extend(true, {}, parentValue, value);
                                }
                            }
                        } else if (value === parentValue) {
                            continue;
                            // delete childPrototype[property];
                        }
                    }
                    this._defineGetProp(childPrototype, property, value);
                }
            }
        }
        this._extend(childClass, parentComponent);
        protoObj = childClass;
        return protoObj;
    }
}
window.ZComponents = ZComponents;
let ZC = ZComponents;
ZC.Templates.Utilities = {};
document.addEventListener('DOMContentLoaded', ZC._init); // No I18N
window.addEventListener('resize', ZC.setProperties); // No I18N
export default class CoreComponent {
    constructor(element, options = {}) {
        // this.name = this.constructor.name || this.constructor.name.toLowerCase(); // construtor.name will be present for components which is extended by simply providing an object.
        this.element = element;
        // ZC[this.name] ? ZC[this.name].DEFAULTS : {}, ZC._getOpts(element) were removed form assigning to this._opts
        // which was already handled by getOpts()
        this._opts = $.extend(true, {}, this._DEFAULTS, options);
        this._create(element, this._opts);
        /* Common Getter and Setter Methods for all properties present in a Component. */
        // NeedCodeRevisit - This function call is need?
        if (element) {
            this._defineGetterSetter();
        }
    }

    _getID(element, prefix, suffix) {
        return ZC.getID(this.name, element, prefix, suffix);
    }

    _alterBorderRadius(opts, clear) {
        return ZC.alterBorderRadius && ZC.alterBorderRadius({
            ...opts,
            element: opts.element || this.getElement(),
            forElement: opts.forElement || this._opts.forElement
        }, clear);
    }

    _isValid(key, value) {
        return this._ALLOWEDVALUES[key].indexOf(value) > -1;
    }

    /** Should be removed after discussing with Raju - Revisit
    _bindHandlers(events) {
        for (let handler in events) {
            let eventInfo = events[handler],
                eventNames, key = handler + 'Handler', // No I18N
                isDynamicEvent = false;
            if (typeof eventInfo === 'string') {
                eventNames = eventInfo.split(' ')
            } else if (typeof eventInfo === 'object') {
                isDynamicEvent = true;
                eventNames = eventInfo.event.split(' ');
            }
            this._data[key] = {
                namespace: this.name,
                handler: this['_' + handler + 'Handler'].bind(this)
            }
            if (eventNames.length > 1 || isDynamicEvent) {
                this._data[key].eventNames = eventNames;
            }
        }
    } */

    _addEvents(eventHandlers, element = this.getElement()) {
        for (let handler in eventHandlers) {
            let event = this._suffixCName(eventHandlers[handler]);
            event && element.off(event).on(event, this['_' + handler + 'Handler'].bind(this)); // No I18N
        }
    }

    _suffixCName(events) {
        return events ? events.split(' ').reduce((acc, event) => acc + event + '.' + this.name + ' ', '') : ('.' + this.name); // No I18N
    }

    _removeEvents(events, element = this.getElement()) {
        element.off(this._suffixCName(events));
    }

    _setParentClass(value) {
        let data = this._data,
            oldValue = data.parentClass;
        if (oldValue !== value) {
            let element = this._useParent || !this.container ? this.element : this.container;
            if (element) {
                oldValue && element.removeClass(oldValue);
                element.addClass(value);
            }
            this._data.parentClass = value;
        }
    }

    _commonPropSetters() {
        this._data = {};
        let opts = this._opts,
            element = this.element[0],
            dir = element.dir || document.body.dir; // No I18N
        opts.rtl = dir === 'rtl' || opts.rtl; // No I18N
        if (opts.templateData && typeof opts.templateData === 'object') { // No I18N
            $.extend(true, this._data, opts.templateData);
        }
        this._data.isCE = opts.isCE;
        // Removed window.getComputedStyle since it is recalculating the style and takes a lot of time to execute.
    }

    _create(element, options) {
        this._commonPropSetters();
        this.isCE = this.isCE || options.isCE;
        this._useParent = this.isCE;
        this._init(...arguments);
        if (this._useParent) {
            this.container = element;
        }
        let opts = this._opts;
        // Attributes & class names will be added to the parent containers only when the container is not created from template.
        let base = this;
        this._data.parentClass = (opts.zclassName || opts.className || '') + (opts.rtl ? ' zh-rtl' : '');

        Object.defineProperty(this._data, 'className', { // No I18N
            set: function(value) {
                base._setParentClass(value || base._data.parentClass);
            },
            get: function() {
                return base._data.parentClass;
            }
        });
        this._initialRender();
        this._construct(...arguments);
        this._data.rendered = true;
        this._bindEvents();
    }

    _initialRender() {
        this._render();
    }

    _appendEle(appendTo) {
        if (appendTo) {
            appendTo = $(appendTo)[0];
            if (appendTo) {
                let container = this.getElement()[0];
                if (appendTo.lastElementChild !== container) {
                    appendTo.appendChild(container);
                }
            }
        }
    }

    _init() {}

    _buildData() {}

    _postRender() {}

    _postEachRender() {}

    _preRender(data) {
        return data;
    }

    _construct() {}

    _bindEvents() {}

    _handleFocus(element, eludeFocusBinding) {
        ZC._handleFocus(element || this.container, this.name, eludeFocusBinding);
    }

    _defineGetterSetter() {
        let attrName,
            compAttrs = Object.keys(this._DEFAULTS),
            len = compAttrs.length,
            i;
        for (i = 0; i < len; i++) {
            attrName = compAttrs[i];
            // Checking whether a method is already available in the same name as property.
            // For Ex: In tokenfield component, the name search will be used to denote a property as well as a method.
            if (!this[attrName]) {
                // Not able to checkin by having functions inside loops.. So using another _defineProperty method.
                this._defineProperty(attrName);
            }
        }
    }

    _defineProperty(attrName) {
        Object.defineProperty(this, attrName, {
            set: function(value) {
                this.setAttribute(attrName, value);
            },
            get: function() {
                return this.getAttribute(attrName);
            }
        });
    }

    _display(hide, element = this.element) {
        return ZC.display(hide, element);
    }

    _dispatchEvent(eventName, event, data, element, isFromUI) {
        let eventType = eventName,
            componentName = this.eventPrefix || this.name,
            value;
        if (this.isCE) {
            eventType = 'z' + eventType; // No I18N
        }
        let type = eventType || eventName;
        element = element || this.element;
        let prop, orig,
            callback = this._opts[type];
        data = data || {};
        data.fromUI = data.fromUI || isFromUI;
        data.element = element;
        data.container = this.getElement();
        data.options = this._opts;
        event = $.Event(event);
        event.type = (componentName && !this.isCE ? componentName + type : type).toLowerCase();
        // the original event may come from any element
        // so we need to reset the target on the new event
        event.originalTarget = event.target; // saving the original target.
        event.target = element;
        orig = event.originalEvent;
        if (orig) {
            for (prop in orig) {
                if (!(prop in event)) {
                    event[prop] = orig[prop];
                }
            }
        }
        if (this.isCE) {
            event = this._dispatchCEEvent(eventType, data, element, event.originalEvent);
        } else {
            event.detail = data;
            // Executing the callbacks assigned as property to the instance. Example: instance.onclick = function(){}
            element.trigger(event, data);
        }

        // Temporarily commented. Need to discuss. - Revisit
        // type = type[0].toUpperCase()+type.substr(1);
        if (this['on' + type]) {
            this['on' + type](event, data);
        }
        if (element[0]['onlyte' + type]) { // No I18N
            element[0]['onlyte' + type](event, data); // No I18N
        }
        data = [ event ].concat(data);
        if (!this.isCE) {
            if (callback && typeof callback === 'string') { // No I18N
                value = ZC._triggerFunction(callback, element[0], data);
            } else {
                value = typeof callback === 'function' ? callback.apply(element, data) : undefined; // No I18N
            }
        }
        return typeof value === 'boolean' ? value : !event.isDefaultPrevented(); // No I18N
    }

    _getRTLBasedDir(dir) {
        return ZC.getRTLBasedDir(dir, this._opts.rtl);
    }

    _getI18NText(key, stringArray, optionKey) {
        let defaultKeys = this._opts.labels || this._opts.messages,
            i18nText = optionKey ? this._opts[optionKey][key] : undefined;
        if (i18nText) {
            return i18nText;
        }
        let keyObject = ZC.keys[this.name] || {},
            ii8nText = keyObject[key] || ''; // No I18N
        if (ii8nText === '' && defaultKeys) { // No I18N
            ii8nText = defaultKeys[key];
        }
        if (stringArray) {
            for (let i = 0; i < stringArray.length; i++) {
                ii8nText = ii8nText.replace(`{${i}}`, stringArray[i]);
            }
        }
        return ii8nText;
    }

    listen(eventName, callback) {
        this['on' + (eventName[0].toUpperCase() + eventName.substr(1)).replace(this.name, '')] = callback; // No I18N
    }

    getElement() {
        return this.container || this.element;
    }

    getAttribute(optionName) {
        return this._opts[optionName];
    }

    getAttributes() {
        return $.extend(true, {}, this._opts); // extending in order to avoid object overriding.
    }

    setAttributes(options, element = this.element) {

        for (let i in options) {
            this.setAttribute(i, options[i], true);
        }
        this._renderAttrChange();
    }

    // This method is used to convert a JSON object to a valid style string that can be used for the template.
    _getStyle(obj) {
        if (obj && typeof obj === 'object') { // No I18N
            let styleStr = ''; // No I18N
            for (let key in obj) {
                if (obj[key]) {
                    styleStr += `${key}:${obj[key]};`
                }
            }
            return styleStr;
        }
        return obj;
        // the following method replaces comma in values as well and forloop is faster than stringify so it is replaced.
        // return JSON.stringify(obj).replace(/{|}|"/g, '').replace(/,/g, ';'); // No I18N
    }

    _setAttribute() {}

    _getOptVal(value, oldValue) {
        if (value && typeof value === 'object' && typeof oldValue === 'object') { // No I18N
            if (!(value instanceof Array) && !(oldValue instanceof Array) && !(value instanceof Date) && !(value instanceof RegExp) && !(value instanceof $) && !(value instanceof Element) && value !== window && !value.nodeName) {
                return $.extend(true, {}, oldValue, value);
            }
            return value;
        }
        return value;
    }

    _isNotNull(value) {
        return !this._isNull(value);
    }

    _isNull(value) {
        return value === undefined || value === null;
    }

    _render(data, templateName = this._opts.templateFunc, element, skipParent = this._skipParent) {
        data = data || Object.assign({}, this._opts, this._data);
        data = this._preRender(data);
        let componentName = this._opts.templateName || this.name;
        let hasContainer = !!ZC[componentName].Templates[data.isCE ? 'WCContainer' : 'container']; // No I18N
        // Snippet to use existing container instead of creating new one.
        // if (!data.rendered && hasContainer) {
        //     let containerId = data.attrs && data.attrs.id;
        //     if (containerId) {
        //         let outerContainer = $('#' + containerId); // No I18N
        //         if (outerContainer.length) {
        //             hasContainer = false;
        //             this.container = outerContainer;
        //         }
        //     }
        // }
        skipParent = typeof skipParent === 'boolean' ? skipParent : hasContainer ? data.rendered : true; // No I18N
        let renderParam = {
            isCE: this._data.isCE,
            skipParent,
            container: this.container ? this.container[0] : undefined,
            refElement: this.element && !data.differentAppend ? this.element[0] : undefined
        }
        // this._opts.templateName is used to prevent default template name from running.
        let container = ZC._render(data, componentName, templateName, element, data.differentAppend, renderParam);
        if (container && data.zElement) { // ZC._render always returns values. Since specific template can be rendered by setting skipParent as true, assigning this.container in that case will be erroneous. So, added skipParent check too.
            this.container = $(container);
        }
        let parentEle = this.getElement();
        if (data.attrs) {
            element = data.alwaysSetAttrs ? parentEle : (element ? $(element) : (this._useParent || !this.container ? this.element : undefined));
            if (element) {
                element.attr(data.attrs);
            }
        }
        if (!this._data.rendered) {
            this._postRender(parentEle, this._opts);
        }
        this._postEachRender(parentEle, data);
        return container;
    }

    setAttribute(optionName, value, isInternal) {
        let opts = this._opts,
            oldValue = opts[optionName],
            isSpecialAttr,
            container = this.getElement();
        if (value === undefined) {
            value = this._DEFAULTS[optionName];
        }
        // Added null check since null is an object
        if ((typeof oldValue !== 'object' || oldValue === null) && oldValue === value) { // No I18N
            // checking whether the value is actually modified or not.
            return;
        }
        value = this._getOptVal(value, oldValue);
        if (this.isCE && this.element[0]._initialized || !this.isCE || ZC.useWebComponentsSelector) {
            this._setAttribute(optionName, value);
        }
        // Added container check since some components do not have container itself. Eg: List
        isSpecialAttr = container && !this._stopAttrUpdate;
        if (isSpecialAttr) {
            if (optionName === 'rtl') { // No I18N
                container[value ? 'addClass' : 'removeClass']('zh-rtl'); // No I18N
                this._updateClass('zh-rtl', value ? null : true); // No I18N
            } else if (optionName === 'className' || optionName === 'zclassName') { // No I18N
                this._updateClass(value, oldValue);
            } else if (optionName === 'disabled') { // No I18N
                this._disable(value);
            } else if (optionName === 'appendTo') { // No I18N
                this._appendEle(value || 'body'); // No I18N
            } else if (optionName === 'templateFunc') { // No I18N
                this._domChanged = true;
            } else if (optionName === 'templateData') { // No I18N
                if (value) {
                    $.extend(true, this._data, value);
                    this._domChanged = true;
                } else if (oldValue) {
                    Object.keys(oldValue).forEach((key) => this._data[key] = null);
                    this._domChanged = true;
                }
            } else {
                isSpecialAttr = false;
            }
        }
        this._stopAttrUpdate = false;
        if (isSpecialAttr) {
            opts[optionName] = value;
        }
        if (!isInternal) {
            this._renderAttrChange();
        }
    }

    _renderAttrChange() {
        if (this._reInit) {
            this._domChanged = true;
            this._buildData();
        }
        if (this._domChanged) {
            this._render();
        }
        this._domChanged = this._reInit = false;
    }

    _setBtnValue(attrs, btnObj) {
        let mainElement = btnObj && btnObj.mainElement;
        if (mainElement) {
            ZC.button(mainElement).setAttributes(attrs);
        } else {
            this._domChanged = true;
        }
    }

    _setUndefined(arr, addTxt) {
        for (let i = 0, len = arr.length; i < len; i++) {
            this['_' + arr[i] + addTxt] = undefined;
        }
    }

    _disable(disable, element, preventClsManip) {
        let useData = !element,
            dCls = 'is-disabled'; // No I18N
        element = element || this.getElement();
        if (!preventClsManip) {
            if (useData) {
                this._updateClass(disable ? dCls : '', !disable && dCls);
            } else {
                element[disable ? 'addClass' : 'removeClass'](dCls); // No I18N
            }
        }
        this._addedByComponent = true;
        if (disable) {
            element.attr({
                'aria-disabled': true, // No I18N
                disabled: true // No I18N
            });
        } else {
            element.removeAttr('aria-disabled disabled'); // No I18N
        }
        this._addedByComponent = false;
    }

    _emptyElement(container, start) {
        while (start) {
            let tempNode = start.nextSibling;
            container.removeChild(start);
            start = tempNode;
        }
    }

    // To update this._data.className
    _updateClass(className, removeOrReplace, container) {
        if (container) {
            container[removeOrReplace ? 'removeClass' : 'addClass'](className); // No I18N
        } else if (this._data) {
            let data = this._data,
                oldClass = data.className;
            if (removeOrReplace) {
                if (typeof removeOrReplace === 'boolean') { // No I18N
                    removeOrReplace = className;
                    className = ''; // No I18N
                }
                oldClass = oldClass.replace(new RegExp('(?:^|( +)?)' + removeOrReplace + '(?:$|( +)?)', 'g'), ' ' + className + ' '); // No I18N
            } else {
                oldClass += ' ' + className;
            }
            data.className = oldClass;
        }
    }

    _destroy() {}

    destroy() {
        if (this.container || this.element) { // This check is added to avoid calling destroy method more than once
            this._dispatchEvent('beforedestroy'); // No I18N
            let $element = this.element,
                container = this.container,
                actualElement = container || $element;
            actualElement.off('.' + this.name);
            this._destroy();
            (!container && !this._useParent) && $element.empty();
            ZT.removeCacheData(actualElement[0]);
            $element && $element.removeData(this.name).removeData('ZCOpts'); // No I18N
            this._data && this._setParentClass(' '); // No I18N
            // undefined is replaced by space since className property setter has undefined check
            if (!this._useParent && container) {
                container.remove();
                $element[0].style.display = ''; // No I18N
            }
            if (this.isCE && !this._eleRemoval) {
                this._destroyCE(true);
            }
            this.container = this.element = undefined;
        }
    }
}
