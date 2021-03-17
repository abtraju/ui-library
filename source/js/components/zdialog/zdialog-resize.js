import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass.resizableDefaults = {
    minHeight: 300, // No I18N
    minWidth: 300, // No I18N
    maxHeight: false, // No I18N
    maxWidth: false, // No I18N
    boundary: 'viewport', // No I18N
    directions: 's,e,se' // No I18N
}

baseClass._initResize = function() {
    let base = this,
        resizeOptions = this.resizableDefaults;
    resizeOptions.boundary = this._opts.type === 'modal' ? 'parent' : resizeOptions.boundary; // No I18N
    ZC.resizable(this.element, $.extend(true, {}, resizeOptions, {
        relatedElements: this._content, // No I18N
        rtl: this._opts.rtl, // No I18N
        cues: [ 'ne', 'nw', 'se', 'sw' ], // No I18N
        cueIcons: {
            southEastSVGIconId: 'zc__svg--lines zresizable__svg', // No I18N
            northEastSVGIconId: 'zc__svg--lines zresizable__svg', // No I18N
            southWestSVGIconId: 'zc__svg--lines zresizable__svg', // No I18N
            northWestSVGIconId: 'zc__svg--lines zresizable__svg' // No I18N
        },
        start: function(event, ui) {
            if (event.detail.resizedDirection.indexOf('n') !== -1) { // No I18N
                base._posModified = true;
            }
            base._dimModified = true; // dimension modified.
            base._triggerEvent('resizestart', event, ui); // No I18N
        },
        end: function(event, ui) {
            base.actualWidth = base.element.width();
            base._triggerEvent('resizeend', event, ui); // No I18N
            // width is setting as auto inorder to make the content area responsive during window resize.
            base._content.css('width', 'auto'); // No I18N
        },
        resize: function(event, ui) {
            base.element.css('height', 'auto'); // No I18N
            base._triggerEvent('resize', event, ui); // No I18N
        }
    }, this._opts.resizable));
}
