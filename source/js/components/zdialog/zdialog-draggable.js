import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass._initDrag = function() {
    let base = this;
    ZC.draggable(this.element, {
        ignoreAsHandle: '.zdialog__actiongroup,.zresizable__handle', // No I18N
        handle: '.zdialog__header', // No I18N
        region: 'viewport', // No I18N
        cursor: 'default', // No I18N
        start: function(event, ui) {
            base._posModified = true;
            base._triggerEvent('dragstart', event, ui); // No I18N
        },
        end: function(event, ui) {
            base._triggerEvent('dragend', event, ui); // No I18N
        },
        drag: function(event, ui) {
            base._triggerEvent('drag', event, ui); // No I18N
        }
    });
}
