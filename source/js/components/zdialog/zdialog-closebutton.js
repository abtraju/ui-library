import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass._closeClickHandler = function(event) {
    this._resetPosition(this.element, true);
    this._closeDialog(event, {
        closeButton: true
    });
    return event.type !== 'keydown'; // No I18N
}
