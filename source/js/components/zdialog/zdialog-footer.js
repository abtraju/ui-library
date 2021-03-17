import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass._createButtonPanel = function() {
    if (ZC.isEmpty(this._opts.commandBar)) {
        let buttons = this._opts.buttons || [],
            commands = [],
            buttonObj,
            len = buttons.length;
        for (let i = 0; i < len; i++) {
            buttonObj = buttons[i];
            typeof buttonObj === 'object' && commands.push(this._createButton(buttonObj)); // No I18N
        }
        this._data.commands = commands;
    } else {
        this._createCommandBar();
    }
    let btnAlign = this._opts.buttonsAlignment;
    this._data.alignClassName = btnAlign === 'right' ? '' : this._getAlignCls(btnAlign); // No I18N
}

baseClass._createButton = function(buttonObj) {
    let btnid = buttonObj.id = buttonObj.id || this._getID(buttonObj, 'dlgbutton'), // No I18N
        elem = btnid && $('#' + btnid);
    if(!elem.length){
        elem = undefined;
    }
    buttonObj.templateRender = true;
    let action = buttonObj.action,
        isActFunc = typeof action === 'function'; // No I18N
    buttonObj.click = isActFunc ? action : this._clickHandler.bind(this);
    buttonObj.mainElement = elem ? elem[0] : null;
    buttonObj = ZC.ZButton.getBtnProps(buttonObj, elem);
    if (!isActFunc) {
        let custAttrs = buttonObj.attrs || {};
        custAttrs['data-action'] = action; // No I18N
        buttonObj.attrs = custAttrs;
    }
    return buttonObj;
}

baseClass._clickHandler = function(event) {
    let buttonEle = $(event.target).closest('.zbutton'); // No I18N
    if (!buttonEle.hasClass('is-disabled') || buttonEle.find('.zbutton__loader').length) {
        // If there is no action, don't close the dialog.
        let action = buttonEle.attr('data-action'); // No I18N
        if (action) { // string type actions will only be present here
            if (action === 'CANCEL' || action === 'CLOSE') { // No I18N
                this._closeDialog(event, {
                    button: buttonEle
                });
            } else {
                ZC._triggerFunction(action, buttonEle, [ event, {
                    button: buttonEle,
                    options: ZC._getOpts(buttonEle)
                } ]);
            }
        }
        this._triggerEvent('actionbuttonclick', event, { // No I18N
            button: buttonEle
        });
    }
}

baseClass._setBtnProps = function() {
    let btnData = this._data.commands,
        fPanel = this.element.find('.zdialog__footer'), // No I18N
        btns = fPanel.find('.zbutton'), // No I18N
        len = btns.length,
        ele, data, $ele;
    for (let i = 0; i < len; i++) {
        ele = btns[i];
        data = btnData[i];
        ele.zbtndata = data;
        $ele = $(ele);
        if (data.attrs) {
            delete data.attrs.class;
            $ele.attr(data.attrs);
        }
        this._handleFocus($ele);
    }
    fPanel.off('click').on('click', '.zbutton', function(event) { // No I18N
        let ele = $(event.target).closest('.zbutton'), // No I18N
            data = ele[0].zbtndata;
        data && data.click(event);
    });
}
