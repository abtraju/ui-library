import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass.maximize = function() {
    this._performMinMax('Maximize'); // No I18N
}

baseClass._toggleMaximize = function(event, button, triggerEvent) {
    this._toggleRestore(event, button, triggerEvent, 'maximize'); // No I18N
}
