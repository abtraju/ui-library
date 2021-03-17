import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass.setButtonAttributes = function(ids, attrName, attrValue) {
    let i = 0,
        isIDObj = typeof ids !== 'string', // No I18N
        isMulAttr = typeof attrName === 'object'; // No I18N
        /* attrName -> {"text":"Button Label","disabled":true } */
    if (isIDObj || isMulAttr) {
        let src = isMulAttr ? attrName : ids,
            value;
        for (let key in src) {
            value = src[key];
            this.setButtonAttributes(isMulAttr ? ids : value.id, isMulAttr ? key : value, value);
        }
    }
    ids = ids.split(','); // No I18N
    let len = ids.length,
        id;
    for (i = 0; i < len; i++) {
        id = ids[i];
        this._changeBtnValues(id, attrName, attrValue);
    }
    if (len) {
        this._data.modifiedAttr = 'buttons'; // No I18N
        this._render();
    }
    this.refreshContent();
}
baseClass._changeBtnValues = function(id, attrName, value) {
    let btn = this.element.find(id);
    if (!btn.length) {
        return;
    }
    let btnData = btn[0].zbtndata;
    btnData[attrName] = value;
    btnData.className = btnData.className.replace(/zbutton--primary|zbutton--normal|zbutton--small|zbutton--medium|zbutton--large|zbutton--mini|is-disabled|zbutton/g, '');
    btnData = ZC.ZButton.getBtnProps(btnData);
    btn[0].zbtndata = btnData;
    let commands = this._data.commands,
        len = commands.length;
    for (let i = 0; i < len; i++) {
        if (commands[i].id && commands[i].id === id.slice(1)) {
            this._data.commands[i] = btnData;
        }
    }
    if (attrName === 'customAttributes') { // No I18N
        btn.attr(value);
    }
}
