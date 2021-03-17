import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass._setTitleBarBtns = function() {
    let opts = this._opts,
        btns = [],
        titleVal = opts.title,
        btnInfo = this._updateBtnInfo.bind(this);
    if (titleVal) {
        this._data.title = opts.isTitleHTMLEncoded ? titleVal : ZC.encodeHTML(titleVal);
    }
    if (opts.minimizable && opts.type !== 'modal') { // No I18N
        btns.push(btnInfo('minimize')); // No I18N
    }
    opts.maximizable && btns.push(btnInfo('maximize'));
    opts.closeButton && btns.push(btnInfo('close'));
    this._data.titleBarButtons = btns;
}

baseClass.disableButton = function(keyword) {
    this._toggleButton(keyword, true);
}

baseClass.enableButton = function(keyword) {
    this._toggleButton(keyword, false);
}

baseClass._toggleButton = function(keyword, attrValue) {
    let btn = this['_' + (keyword || 'close') + 'Button'];// No I18N
    if (btn) {
        this._disable(attrValue, btn);
    }
}

baseClass._updateBtnInfo = function(actionName, mainEle) {
    let _opts = this._opts,
        elem = $('#' + _opts.id + actionName),
        custProps = {
            id: _opts.id + actionName, // No I18N
            title: _opts[actionName + 'ButtonLabel'] || this._getI18NText(actionName), // No I18N
            className: 'zbutton--action zdialog__' + actionName, // No I18N
            SVGIconId: _opts[actionName + 'SVGIconId'], // No I18N
            SVGIconClassName: 'zbutton__svg', // No I18N
            iconClassName: _opts[actionName + 'IconClassName'] || _opts[actionName + 'IconClass'], // No I18N
            defaultSVGIconId: 'zc__svg--' + actionName + ' zbutton__svg', // No I18N
            templateRender: true,
            // isCE: _opts.isCE, If we render buttons as z-button, then while emptying the element via template rendering produces incorrect results since disconnected and connected callbacks will be invoked with loss in data.
            mainElement: mainEle || (elem.length ? elem[0] : null),
            customAttributes: {
                'data-zdaction': actionName, // No I18N
                tabindex: -1 // No I18N
            }
        };
    return ZC.ZButton.getBtnProps(custProps);
}
baseClass._handleTBarActions = function() {
    let name = '.' + this.name, // No I18N
        code;
    let btnContainer = this.element.find('.zdialog__actiongroup'),
        btns = btnContainer.find('.zbutton'),
        tBarBtns = this._data.titleBarButtons,
        len = tBarBtns.length,
        attrs;
    for (let i = 0; i < len; i++) {
        attrs = tBarBtns[i].attrs;
        if (attrs) {
            $(btns[i]).attr(attrs);
        }
    }
    // Revisit - use bindEleEvents
    btnContainer.off('click' + name + ' keydown' + name).on('click' + name + ' keydown' + name, (event) => { // No I18N
        /*
            Shortcuts for Minimize Button
            MAC OS: Cmd+M
            Windows & Ubuntu OS: No direct shortcuts
        */
        code = event.keyCode;
        if (event.type === 'click' || (code === ZC.keyCode.ENTER || code === ZC.keyCode.SPACE)) {
            let btn = $(event.target).closest('.zbutton--action:not(.is-disabled)'), // No I18N
                zdaction = btn.attr('data-zdaction'); // No I18N
            if ([ 'maximize', 'minimize', 'restore' ].indexOf(zdaction) > -1) {
                return this._minMaxClick(zdaction, event, btn);
            } else if (zdaction === 'close') {
                return this._closeClickHandler(event);
            }
        }
    }).off('mousedown' + name).on('mousedown' + name, () => { // No I18N
        // activeElement is stored to use while restoring from minimize state.
        this._activeElement = this._activeElement || $(document.activeElement);
    });
}
