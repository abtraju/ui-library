import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass._createOverlay = function() {
    ZC.zIndex += 1; // setting zindex for overlay to have the modal behavior
    let opts = this._opts,
        overlay = $(`<div class='zdialog--overlay ${opts.overlayClassName}' ></div>`).css('zIndex', ZC.zIndex); // No I18N
    this._addedByComponent = true;
    $(this._opts.appendTo || 'body').append(overlay.append(this.element)); // appending the dialog element to the overlay in order to correct the scroll behavior.
    this._addedByComponent = false;
    this._hideDocumentScroll(true);
    //  Here tabindex is set in order to make the div element receive keydown event.
    overlay.attr('tabindex', 1); // No I18N
    this._overlay = overlay;
    this._bindOverlayEvents();
}

baseClass._bindOverlayEvents = function() {
    this._addEvents({
        overlayKey: 'keydown', // No I18N
        overlayEveStop: 'click mousedown' // No I18N
    }, this._overlay);
}

baseClass._overlayKeyHandler = function(event) {
    if (event.keyCode === ZC.keyCode.ESCAPE && this._opts.closeOnEscKey) { // Closing the model dialog when escape key is pressed.
        this._closeDialog(event, {
            overlay: true
        });
    }
}

baseClass._overlayEveStopHandler = function(event) {
    // preventing the propagation of mousedown/click because document mousedown handlers might close the already opened menu/popover.
    if (!$(event.target).closest('.zdialog').length) { // No I18N
        event.stopPropagation();
        if (event.type === 'click' && this._opts.closeOnOverlayClick) { // No I18N
            this._closeDialog(event, {
                overlay: true
            });
        }
    }
}

baseClass._unbindOverlayEvents = function() {
    this._removeEvents('keydown click mousedown', this._overlay); // No I18N
}

baseClass._hideDocumentScroll = function(hide) {
    $('body')[hide ? 'addClass' : 'removeClass']('zh-overflowhidden'); // No I18N
}

baseClass._closeModalDlg = function(event, data, ignoreTrigger) {
    let over = this._overlay,
        isVisible = over ? over.is(':visible') : false; // No I18N
    // Appending the dialog element to body and removing the overlay related codes are removed.
    if (isVisible && (!data || data.animation === undefined || data.animation !== false)) { // No I18N
        let base = this;
        over.fadeOut(50, this._triggerCloseEvent.bind(base, event, data, ignoreTrigger));
    } else {
        isVisible && over.hide();
        this._triggerCloseEvent(event, data, ignoreTrigger);
    }
}

baseClass._triggerCloseEvent = function(event, data, ignoreTrigger) {
    if (!$('body').find('.zdialog--overlay:visible').length) {
        this._hideDocumentScroll(false);
    }
    if (!ignoreTrigger) {
        this._triggerEvent('close', event, data); // No I18N
    }
}

baseClass._preventModalDlgClick = function() {
    this._addEvents({
        overlayClk: 'click' // No I18N
    });
}

baseClass._overlayClkHandler = function(event) {
    // propagation of click event is prevented since overlay click will close the dialog.
    event.stopPropagation();
}
