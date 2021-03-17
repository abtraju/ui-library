/* eslint-disable no-unused-expressions */
import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass._setAttribute = function(optName, value) {
    let opts = this._opts,
        data = this._data,
        isCE = opts.isCE;
    if (optName === 'title') { // No I18N
        if (value) {
            data.title = data.isTitleHTMLEncoded ? value : ZC.encodeHTML(value);
            isCE && this._titleBar.find('.zdialog__title').text(data.title); // No I18N
        } else {
            data.title = data.titleEle = null;
        }
    } else if (optName === 'content') { // No I18N
        opts[optName] = value;
        if (value) {
            if (typeof value === 'object') { // No I18N
                $.ajax(value).success((data) => {
                    value = data;
                });
            }
            data.content = data.isContentHTMLEncoded ? value : ZC.encodeHTML(value); // No I18N
            isCE && this._content.html(data.content);
        } else {
            data.content = data.contentEle = null;
        }
    } else if (optName === 'closeOnEscKey') { // No I18N
        value ? this._bindEvents() : this.element.off(`.${this.name}`);
    } else if (optName === 'closeButton' || optName === 'closeSVGIconId' || optName === 'closeIconClassName' || optName === 'closeIconClass' || (opts.closeButton && (optName === 'minimizable' || optName === 'maximizable'))) { // No I18N
        opts[optName] = value;
        this._setTitleBarBtns();
    } else if (optName === 'className') { // No I18N
        this._updateClass(value, opts.className);
    } else if (optName === 'width') { // No I18N
        this.element.css({
            width: value
        });
        this.actualWidth = parseInt(value);
    } else if (optName === 'height') { // No I18N
        this._content.css('height', value); // No I18N
        this.actualHeight = parseInt(value);
    } else if (optName === 'type' && this.element.is(':visible')) { // No I18N
        // opts[optName] = value;
        if (value === 'modal') { // No I18N
            this._createOverlay(); // if dialog is a modal dialog, create the overlay
            this._preventModalDlgClick();
        } else {
            $(this._opts.appendTo || 'body').append(this.element);  // No I18N // Appending the dialog element to the body.
            this._overlay.remove();
            this._overlay = undefined;
            this.element.off('click.zdialog'); // No I18N
            this._setTitleBarBtns();
        }
        this.element.attr('aria-modal', value === 'modal'); // No I18N
    } else if (optName === 'overlayClassName' && this._overlay) { // No I18N
        this._overlay.removeClass(opts.overlayClassName).addClass(value);
    } else if (optName === 'resizable' && ZC.resizable) { // No I18N
        opts.resizable = value;
        if (this.element.data('zresizable') && value && typeof value === 'object') { // No I18N
            if (Object.keys(value).length) {
                ZC.resizable(this.element).setAttributes(value);
            }
        } else {
            value ? this._initResize() : ZC.resizable(this.element).destroy();
        }
    } else if (optName === 'draggable') { // No I18N
        value ? this._initDrag() : ZC.draggable(this.element).destroy();
    } else if (optName === 'buttons' || optName === 'commandBar') { // No I18N
        opts[optName] = value;
        this._createButtonPanel();
    } else if (optName === 'position') { // No I18N
        opts.position = value;
        this._positionDialog();
    } else if (optName === 'footer') { // No I18N
        this._setFootnote(value);
    } else if (optName === 'buttonsAlignment') { // No I18N
        this.element.find('.zdialog__footer').removeClass(this._ALIGNMENTS[opts.buttonsAlignment]).addClass(this._ALIGNMENTS[value]);
    } else if (optName === 'closeOnOverlayClick' && this._overlay && this._overlay.length) { // No I18N
        value ? this._bindOverlayClick() : this._overlay.off('click.zdialog'); // No I18N
    } else if (optName === 'rtl' && opts.resizable) { // No I18N
        this.element.zresizable('setAttribute', 'rtl', value); // No I18N
    }
    if (optName !== 'className') {
        opts[optName] = data[optName] = value;
    }
    data.modifiedAttr = optName;
    let noRenderItems = [ 'closeOnEscKey', 'className', 'closeOnOverlayClick', 'width', 'height', 'resizable', 'draggable', 'position', 'animation' ]; // No I18N
    if (noRenderItems.indexOf(optName) < 0) {
        this._domChanged = true;
    }
}
