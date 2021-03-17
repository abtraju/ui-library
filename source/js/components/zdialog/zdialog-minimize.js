import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass.minimize = function() {
    this._performMinMax('Minimize'); // No I18N
}

baseClass._toggleMinimize = function(event, button, triggerEvent) {
    this._toggleRestore(event, button, triggerEvent, 'minimize'); // No I18N
}
