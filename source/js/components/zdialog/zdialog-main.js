/* eslint-disable no-unused-expressions */
export default class ZDialog {
    get attrs() {
        return {
            buttonsAlignment: 'right', // No I18N
            closeButton: true, // No I18N
            closeOnEscKey: true, // No I18N
            closeSVGIconId: null, // No I18N
            closeButtonLabel: null, // No I18N
            closeOnOverlayClick: false, // No I18N
            content: null, // No I18N
            draggable: true, // No I18N
            height: null, // No I18N
            isContentHTMLEncoded: false, // No I18N
            isFooterHTMLEncoded: false, // No I18N
            isTitleHTMLEncoded: false, // No I18N
            overlayClassName: '', // No I18N
            maximizable: false, // No I18N
            maximizeIconClass: null, // No I18N
            maximizeButtonLabel: null, // No I18N
            maximizeRestoreIconClass: null, // No I18N
            maximizeRestoreButtonLabel: null, // No I18N
            maximizeRestoreSVGIconId: null, // No I18N
            maximizeSVGIconId: null, // No I18N
            minimizable: false, // No I18N
            minimizeIconClass: null, // No I18N
            minimizeButtonLabel: null, // No I18N
            minimizeRestoreIconClass: null, // No I18N
            minimizeRestoreButtonLabel: null, // No I18N
            minimizeRestoreSVGIconId: null, // No I18N
            minimizeSVGIconId: null, // No I18N
            position: 'center', // No I18N
            restoreIconClass: null, // No I18N
            restoreSVGIconId: null, // No I18N
            title: null, // No I18N
            type: 'modal', // No I18N
            autoOpen: false, // No I18N
            width: null, // No I18N
            defaultActionButton: '.zbutton--primary', // No I18N
            excludeFocus: null, // No I18N
            handleFocusNavigation: true, // No I18N
            submitOnEnter: false // No I18N
        }
    }

    get props() {
        return {
            closeIconClassName: null, // No I18N
            maximizeIconClassName: null, // No I18N
            minimizeIconClassName: null, // No I18N
            minimizeRestoreIconClassName: null, // No I18N
            maximizeRestoreIconClassName: null, // No I18N
            restoreIconClassName: null, // No I18N
            animation: false, // No I18N
            buttons: null, // No I18N
            footer: '', // No I18N
            resizable: {}, // No I18N
            labels: { // No I18N
                minimize: 'Minimize', // No I18N
                maximize: 'Maximize', // No I18N
                minimizeRestore: 'Restore', // No I18N
                maximizeRestore: 'Restore', // No I18N
                close: 'Close' // No I18N
            },
            commandBar: {}
        }
    }

    get _ALIGNMENTS() {
        return {
            right: '', // No I18N
            left: 'zdialogfooter--invert', // No I18N
            center: 'zh-center' // No I18N
        }
    }

    get EVENTS() {
        return ['drag', 'dragstart', 'dragend', 'resize', 'resizestart', 'resizeend', 'minimize', 'maximize', 'close', 'open', 'beforeclose', 'beforeopen', 'restore', 'actionbuttonclick']; // No I18N
    }

    _init(element) {
        let data = this._data,
            opts = this._opts,
            content = opts.content || '', // No I18N
            isCE = this.isCE;
        this._isComponentInited = false;
        let excludeSel = data.excludeFocus;
        data.excludeFocus = (excludeSel ? excludeSel + ',' : '') + ' .zbutton--action'; // No I18N
        if (isCE) {
            let title = element.find('z-dialogtitle').addClass('zdialog__title zdialog__text'); // No I18N
            if (title.length) {
                data.titleEle = title[0];
            }
            data.contentEle = element.find('z-dialogcontent').addClass('zdialog__content')[0]; // No I18N
            data.actionBar = element.find('z-dialogactionbar').addClass('zdialog__commandbar zdialog__footer')[0]; // No I18N
        } else if (content && typeof content === 'object') { // No I18N
            this._fetchAjaxCon(content);
        } else {
            this._setContent();
        }
        opts.id = this._getID(element); // to use in minimize/maximize creation
        this._setTitleBarBtns && this._setTitleBarBtns(); // titlebar module func
        opts.buttons && this._createButtonPanel();
        opts.footer && this._setFootnote();
        this._skipParent = true;
    }

    _setContent() {
        let data = this._data,
            opts = this._opts,
            content = opts.content;
        if (content) {
            data.content = opts.isContentHTMLEncoded ? content : ZC.encodeHTML(content);
        } else {
            content = [...this.element[0].childNodes];
            if (content.length) {
                data.content = content;
            }
        }
    }

    _postRender() {
        this._data.className += ' zdialog'; // No I18N
        this.element.attr({
            'aria-modal': this._opts.type === 'modal', // No I18N
            tabIndex: -1,
            role: 'dialog' // No I18N
        });
        let bodyEle = $(this._opts.appendTo || 'body'), // No I18N
            parentEle = this.element[0].parentNode;
        if (parentEle !== bodyEle[0]) {
            bodyEle.append(this.element); // No I18N
        }
    }

    _postEachRender(ele, data) {
        let elem = this.element,
            opts = this._opts,
            rendered = this._data.rendered;
        this._content = elem.find('.zdialog__content');
        this._titleBar = elem.find('.zdialog__titlebar'); // No I18N
        this._footer = elem.find('.zdialog__footnote'); // No I18N
        this._actionGroup = elem.find('.zdialog__actiongroup'); // No I18N
        let resizable = opts.resizable;
        this._minimizeButton = $('#' + opts.id + 'minimize'); // No I18N
        this._maximizeButton = $('#' + opts.id + 'maximize'); // No I18N
        if (resizable && ZC.resizable) {
            opts.resizable = typeof resizable === 'object' ? resizable : {}; // No I18N
            this._initResize();
        }
        if (rendered && (data.modifiedAttr === 'minimizable' || data.modifiedAttr === 'maximizable' || data.modifiedAttr === 'closeButton') && this._data.titleBarButtons.length) { // No I18N
            this._handleTBarActions();
        }
        if (opts.draggable && ZC.draggable) {
            this._initDrag();
        }
        if (opts.buttons && (!rendered || data.modifiedAttr === 'buttons')) { // No I18N
            this._setBtnProps();
        }
        (opts.minimizable || opts.maximizable) && this._titleBar.off('dblclick.zdialog').on('dblclick.zdialog', this._titleBarClickHandler.bind(this)); // No I18N
        !rendered && opts.autoOpen && this.open();
        data.modifiedAttr = undefined;
    }

    _findPosition() {
        let elem = this.element;
        this.actualPosition = elem.position(); // store the position only when the dialog is in its actual state.
        this.bottomRightPosition = {
            bottom: elem[0].style.bottom, // No I18N
            right: elem[0].style.right // No I18N
        };
    }

    _findHeightWidth() {
        this.actualWidth = parseFloat(this.element.css('width')); // No I18N
        this.actualHeight = this._content.height();
    }

    open(options) {
        this._open(options);
    }

    close(data) {
        this._closeDialog({}, data, undefined);
    }

    isMinimized() {
        return this.element.is('.zdialog--minimized'); // No I18N
    }

    isMaximized() {
        return this.element.is('.zdialog--maximized'); // No I18N
    }

    refreshContent(setFocus) {
        /* Method to enable TAB Key Handling for the contents which is dynamically added. */
        if (this._opts.handleFocusNavigation) {
            return ZC.FocusHandler.refresh(this.element, this._opts.excludeFocus, setFocus);
        }
    }

    _triggerEvent(ename, event, data = {}) {
        data.dialog = this.element;
        return this._dispatchEvent(ename, event, data);
    }

    _open(options) {
        /* If dialog container element has width property set on it, same width will be used.(considering the case that width might be set by performing resize operation) */
        if (this.isMinimized() || this.isMaximized()) {
            this._toggleRestore();
        }
        let ele = this.element,
            styleInfo = ele.attr('style'); // No I18N
        if (!styleInfo || (styleInfo && styleInfo.indexOf('width') === -1)) { // No I18N
            ele.css({
                width: this._opts.width || 'auto' // No I18N
            });
        }
        let returnValue = this._triggerEvent('beforeopen'); // No I18N
        if (returnValue) {
            let dOpacity = ele.css('opacity'); // No I18N
            ele.css('opacity', 0); // No I18N
            this._display(false);
            if (!this._isComponentInited && ZC.init) {
                this._isComponentInited = true;
                ZC.init(ele);
            }
            ele.css('opacity', dOpacity); // No I18N
            this._display(true);
            if (this._opts.type === 'modal') { // No I18N
                if (this._overlay) {
                    this._overlay.show();
                } else {
                    this._createOverlay();
                    this._positionDialog(options);
                }
            } else {
                this._positionDialog(options);
            }
            options = options || {};
            let animation = this._opts.animation || options.animation,
                base = this;
            if (animation) {
                this._animateAction(animation, 'open', function () { // No I18N
                    base._handleDialogOpen();
                }, true);
            } else {
                this._handleDialogOpen();
            }
        }
    }

    _handleDialogOpen() {
        this._display();
        let zIndex = this._opts.zIndex,
            element = this.element,
            componentName = this.name;
        ZC.zIndex = zIndex ? ZC.zIndex : ZC.zIndex + 1; // setting the zIndex for the dialog
        element.css({
            zIndex: zIndex ? parseInt(zIndex) : ZC.zIndex
        });
        this._opts.handleFocusNavigation && ZC.FocusHandler.init(element, this._opts.excludeFocus);
        this._findPosition();
        this._findHeightWidth();
        element.attr('aria-expanded', true); // No I18N
        this._triggerEvent('open', {}, { // No I18N
            position: this.actualPosition
        });
        ZC.activeDialog = element;
        let doIEHandle = !!(ZC.Browser.isIE && ZC.Browser.getIEVersion() <= 10);
        ZC.$window.off('resize.' + componentName).on('resize.' + componentName, (event) => { // No I18N
            if (!this._posModified) {
                // compute the top and left for the dialog whenever window resize occurs.
                if (this._opts.position === 'center' && event.originalEvent.type === 'resize' && !this.isMinimized() && !this.isMaximized()) { // No I18N
                    this._positionDialog();
                }
                if (this.isMaximized() && doIEHandle) {
                    // If dialog is in maximized state and browser is internet explorer, then we have to adjust width and height for content elements since flex-grow is not working there.
                    this._adjustContentSize();
                }
            }
        });
    }

    _closeDialog(event = {}, data, triggerEvent) {
        // removing the restoring functionality because closing the dialog has fadeOut effect.
        event = event || {};
        // Don't close the dialog if beforeClose event returns false
        let retVal = triggerEvent ? true : this._triggerEvent('beforeclose', event, data); // No I18N
        if (retVal) {
            if (this._opts.animation && (!data || data.animation === undefined || data.animation !== false)) {
                let base = this;
                this._animateAction(this._opts.animation, 'close', function () {
                    base._handleDlgClose(event, data, triggerEvent); // hiding the dialog on animation complete function
                });
            } else {
                this._handleDlgClose(event, data, triggerEvent);
            }
        }
    }

    _handleDlgClose(event, data, triggerEve) {
        this._display(true); // hiding the dialog
        let ele = this.element;
        ele.attr('aria-expanded', false); // No I18N
        // removing the focus related classes here since dialog close might take up time if dialog close has animation effects.
        ele.find('.zdialog__commandbar .has-focus').removeClass('has-focus'); // No I18N
        this.restore(false); // restore event is called here inorder to restore the dialog from minimize/maximize state since on next open, it should open correctly.
        if (this._opts.type === 'modal' && this._overlay) { // No I18N
            this._closeModalDlg(event, data, triggerEve);
        } else if (!triggerEve) {
            this._triggerEvent('close', event, data); // No I18N
        }
        ZC.zIndex = ZC.zIndex > 1000 ? ZC.zIndex - 1 : 1000;
        if (ZC.activeDialog && ele && ZC.activeDialog[0] === ele[0]) {
            ZC.activeDialog = undefined;
        }
        ZC.$window.off(`resize.${this.name}`);
    }

    _bindEvents() {
        this._addEvents({
            keydown: 'keydown', // No I18N
            focus: 'focus' // No I18N
        });
        if (this._opts.type === 'modal') { // No I18N
            this._preventModalDlgClick();
        }
        if (this._data.titleBarButtons.length) {
            this._handleTBarActions();
        }
    }

    _keydownHandler(event) {
        let activeDlg = ZC.activeDialog,
            ele = this.element;
        if (activeDlg && activeDlg[0] !== ele[0]) {
            ZC.activeDialog = ele;
        }
        if (event.keyCode === ZC.keyCode.ESCAPE && this._opts.closeOnEscKey) {
            let cancelBtn = ele.find('.zdialog__footer .zbutton'); // No I18N
            cancelBtn = cancelBtn.filter(function (index, item) { // retrieving the cancel button from the set of buttons.
                if ($(item).data('handleClose')) { // handleClose data will be stored in button construction utility.
                    return $(item);
                }
            });
            if (cancelBtn.length) {
                // Pressing Escape should trigger the click event on cancel button.
                cancelBtn.focus();
                cancelBtn.trigger('click'); // No I18N
            } else {
                this._closeDialog(event);
            }
            event.stopPropagation();
        } else if (event.keyCode === ZC.keyCode.ENTER && (this._opts.submitOnEnter && ele.find('form').length)) {
            // excludedList: "textarea, label, span, .ztokenfield, .zsuggestfield-element, .zselectbox, .zaccordion, .zcollapsiblepanel, .zbutton--menu"; // No I18N
            let includedList = '.zbutton:not(.zbutton--menu),input:not(.ztokenfield__textbox):not(.zsuggestfield-element)'; // No I18N
            // Dialog ENTER will trigger the primary action button click.
            let target = $(event.target);
            if (target.closest(includedList).length && !target.closest('.zdialog__commandbar').length) {
                let primaryBtn = ele.find('.zdialog__footer').find(this._opts.defaultActionButton)[0]; // No I18N
                if (primaryBtn && target.closest('button')[0] !== primaryBtn) {
                    $(primaryBtn).focus().trigger('click'); // No I18N
                    return false;
                }
            }
        }
    }

    _focusHandler() {
        let activeDlg = ZC.activeDialog;
        if (activeDlg && activeDlg[0] !== this.element[0]) {
            ZC.activeDialog = this.element;
        }
    }

    _positionDialog(options) {
        let top = 0,
            left = 0,
            ele = this.element,
            opts = this._opts,
            content = ele.find('.zdialog__content'), // No I18N
            isVisible = ele.is(':visible'); // No I18N
        if (!isVisible) {
            this._display();
        }
        /* fixing the dialog height */
        if (!this._dimModified && opts.height) {
            ele.height(opts.height);
            let dlgHeight = ele.outerHeight(true),
                contHeight = parseInt(content.height()),
                padTop = parseInt(content.css('padding-top').split('px')[0]), // No I18N
                padBottom = parseInt(content.css('padding-bottom').split('px')[0]), // No I18N
                titleBarHeight = this._titleBar === undefined ? 0 : parseInt(this._titleBar.outerHeight(true)),
                btnPanel = ele.find('.zdialog__footer'), // No I18N
                btnPanelHeight = btnPanel.length ? btnPanel.outerHeight(true) : 0,
                footNote = ele.find('.zdialog__footnote'), // No I18N
                footNoteHeight = footNote.length ? footNote.outerHeight(true) : 0; // No I18N
            contHeight = dlgHeight - (padTop + padBottom + titleBarHeight + btnPanelHeight + footNoteHeight + parseInt(ele.css('border-top-width')) + parseInt(ele.css('border-bottom-width')) + parseInt(content.css('margin-top')) + parseInt(content.css('margin-bottom'))); // No I18N
            content.height(contHeight);
            ele.css('height', 'auto'); // No I18N
        }
        options = options || {};
        let elemWidth = ele.outerWidth(true),
            elemHeight = ele.outerHeight(true),
            winWidth = ZC.windowObject.width,
            winHeight = ZC.windowObject.height,
            position = opts.position,
            hasBottom = false;

        opts.position = position = options.position || position;
        // center align the dialog
        top = (winHeight / 2 - elemHeight / 2) + (opts.type === 'modeless' ? window.pageYOffset : 0); // Adding the scrollY and scrollX values in modeless dialog otherwise it will be aligned to the top
        left = (winWidth / 2 - elemWidth / 2) + (opts.type === 'modeless' ? window.pageXOffset : 0);
        let tar = options.target;
        if (tar) { // display the dialog nearer to target if target is specified.
            let off = $(tar).offset();
            top = off.top + $(tar).outerHeight(true);
            left = off.left;
        } else if (position === 'golden-mean') { // No I18N
            let halfWin = winHeight / 2,
                smallerPart = halfWin - (halfWin / 1.618);
            top = smallerPart - parseFloat(elemHeight / 2) + window.pageYOffset; // scroll height is added.
            left = winWidth / 2 + window.pageXOffset - parseFloat(elemWidth / 2); // scroll width is added.
        } else if (typeof position === 'string' && position !== 'center') { // No I18N
            let values = position.split(','); // No I18N
            top = values[1] ? values[1] : top; // Position can also be given as "left,top"
            left = values[0] ? values[0] : left;
        }
        if (typeof position === 'object') { // No I18N
            // If custom position contains right and bottom values, top-left can be ignored and the given object can be placed as such.
            if (!position.right && !position.bottom) {
                top = position.top || top; // position as {left: offsetLeft, top : offsetTop}
                left = position.left || left;
            } else {
                hasBottom = true;
            }
        } else {
            let docObj = ZC.documentObject;
            // handling the cases where left and top values are out of document boundaries.
            if (top < 0) { // if top value is negative,then dialog portion is hidden and can't be viewed even by scrolling
                top = 0;
            } else if (top >= docObj.height) {
                top = docObj.height - elemHeight;
            }
            if (left < 0) {
                left = 0;
            } else if (left > docObj.width) {
                left = docObj.width - elemWidth;
            }
        }
        if (!isVisible) {
            this._display(true);
        }
        this._hasBottom = hasBottom;
        let pos = hasBottom ? position : {
            top: top,
            left: left
        };
        ele.css(pos);
    }
}
