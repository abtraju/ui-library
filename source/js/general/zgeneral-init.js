ZC.init = function(container, callback, attr) {
    needToInit && this._init();
    container = container ? $(container) : $('body');
    let attr1 = attr || this.selector,
        attrSelector = '[' + attr1 + ']', // No I18N
        uiComponents = document.querySelectorAll ? container[0].querySelectorAll(attrSelector) : $(attrSelector, container);
    if (container[0].attributes[attr1] || container[0].dataset && container[0].dataset[attr1]) {
        uiComponents = $(container).add(uiComponents);
    }
    if (uiComponents.length) {
        let base = this;
        this.eachAsync(uiComponents, {
            delay: 20,
            loop(i, ele) {
                base._initComponent(ele, undefined, attr);
            },
            end() {
                base._end(container, uiComponents, callback);
            }
        });
    } else {
        this._end(container, uiComponents, callback);
    }
}
ZC.destroy = function(container, callback, attr) {
    container = container ? $(container) : $('body');
    attr = attr || this.selector;
    let attrSelector = '[' + attr + ']', // No I18N
        uiComponents = $(attrSelector, container);
    if (container.is(attrSelector)) {
        uiComponents = $(container).add(uiComponents);
    }
    if (uiComponents.length) {
        let base = this;
        this.eachAsync(uiComponents, {
            delay: 20,
            loop(i, ele) {
                $(ele)[ele.getAttribute(attr)]('destroy');
            },
            end() {
                base._end(container, uiComponents, callback, true);
            }
        });
    } else {
        this._end(container, uiComponents, callback, true);
    }
}

ZC.eachAsync = function(array, opts) { // will be modified later
    let i = 0,
        l = array.length,
        loop = opts.loop || function() {};

    this.whileAsync($.extend(opts, {
        test() {
            return i < l;
        },
        loop() {
            let val = array[i];
            return val && loop.call(val, i++, val);
        }
    }));
}

ZC.whileAsync = function(opts) { // async utility from jquery
    let delay = Math.abs(opts.delay) || 10,
        bulk = isNaN(opts.bulk) ? 500 : Math.abs(opts.bulk),
        test = opts.test || function() {
            return true;
        },
        loop = opts.loop || function() {},
        end = opts.end || function() {};

    (function executeLoop() {
        let t = false,
            begin = new Date();
        while (t = test()) {
            loop();
            if (bulk === 0 || new Date() - begin > bulk) {
                break;
            }
        }
        if (t) {
            setTimeout(executeLoop, delay);
        } else {
            end();
        }
    }());
}

ZC._end = function(mainDiv, uiComponents, callback, isDestroy) {
    this.$document.trigger('zcomponent' + (isDestroy ? 'destroyed' : 'initialized'), mainDiv); // No I18N
    callback && callback(uiComponents);
}

ZC._initDeferredComponents = function(componentsMap, timeout, callback) {
    setTimeout(() => {
        $.each(componentsMap, (ctype, componentGroup) => {
            $(componentGroup).each(function(i, component) {
                this._initComponent($(component), ctype);
            });
        });
        callback && callback(componentsMap);
    }, timeout || 10000); // Default is 10 seconds
}

ZC._initComponent = function(element, ctype, attr) {
    element = $(element);
    ctype = ctype || element.attr(attr || this.selector);
    ctype = ctype.replace(/^z/, ''); // No I18N
    ZC[ctype](element);
}
