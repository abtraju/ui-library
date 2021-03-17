import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass.restore = function(triggerEvent) {
    this._performMinMax('Minimize', true, triggerEvent); // No I18N
    this._performMinMax('Maximize', true, triggerEvent); // No I18N
}

baseClass._performMinMax = function(action, restore, triggerEvent) {
    let isActive = this['is' + action + 'd'](), // No I18N
        alower = action.toLowerCase(),
        optName = alower.replace('e', 'able'), // No I18N
        btnName = '_' + alower + 'Button', // No I18N
        val = -1;
    if (!isActive && !restore && this._opts[optName]) {
        val = false;
    } else if (isActive && restore) {
        val = triggerEvent;
    }
    if (val !== -1) {
        this['_toggle' + action]({}, this[btnName], val); // No I18N
    }
}

baseClass._toggleReverse = function(type, value, className, triggerEvent, callback, event) {
    let restore = value + 'Restore', // No I18N
        content = this._content, // No I18N
        base = this;
    let completeFunction = function() {
        if (value === 'minimize') { // No I18N
            if (!type) {
                base.actualWidth = parseFloat(base.element.css('width')); // No I18N
                base.actualHeight = base.element.height();
            }
            base._footer[type ? 'removeClass' : 'addClass']('zh-dnone'); // No I18N
            content[type ? 'removeClass' : 'addClass']('zh-dnone'); // No I18N
        }
        base._updateClass(className, type);
        if (ZC.draggable && base._opts.draggable) {
            ZC.draggable(base.element).setAttribute('disabled', !type);
        }
        let titleText = base._opts[type ? value + 'ButtonLabel' : value + 'RestoreButtonLabel'] || base._getI18NText(type ? value : restore, base._opts.labels); // No I18N
        base._changeIcon(titleText, type ? value : restore);
        if (type) {
            base.element.css(base._hasBottom ? base.bottomRightPosition : base.actualPosition).css({
                width: base.actualWidth
            });
            if (value === 'maximize') { // No I18N
                content.height(base.actualHeight);
                content.css('width', ''); // No I18N
            } else if (value === 'minimize') { // No I18N
                base.enableButton('maximize'); // No I18N
            }
        } else if (value === 'maximize') { // No I18N
            base._adjustContentSize();
        } else if (value === 'minimize') { // No I18N
            base.element.css({
                width: ''
            });
            base.disableButton('maximize'); // No I18N
        }
        if (value === 'minimize') { // No I18N
            if (base._overlay) {
                base._overlay[type ? 'addClass' : 'removeClass']('zh-dnone'); // No I18N
            }
            let appendedElement = base._overlay ? base._overlay : $(base._opts.appendTo || 'body'); // No I18N
            if (base._overlay && type) {
                // resetting the z-index because on restoring the modal dialog from its minimized state, some other modeless dialogs can be opened.
                ZC.zIndex += 1;
                appendedElement.css('zIndex', ZC.zIndex); // No I18N
                base.element.appendTo(appendedElement); // Revisit - appendTo
            }
            base.element[type ? 'removeClass' : 'addClass']('zdialog--minimized'); // No I18N
            type || base._resetPosition(base.element);
            base._overlay && base._hideDocumentScroll(!!type);
            if (type) { // while restoring from the minimize state, active element stored while minimizing will be set focus.
                base._triggerActiveElement();
            }
        }
        if (triggerEvent) {
            // triggering the maximize, minimize or restore event.
            base._triggerEvent(type ? 'restore' : value, event, { // No I18N
                from: value
            });
        }
        // ZC.FocusHandler.init(base.element);
        if (value === 'maximize') { // No I18N
            base._triggerActiveElement();
        }
        callback && callback();
    };
    if (!type) {
        this._findPosition();
        this._findHeightWidth();
    }
    let props = {
        top: '',
        left: '',
        right: ''
    };
    if (value === 'maximize') { // No I18N
        props.width = ''
        props.height = '';
    }
    this.element.css(props);
    this._buttonAnimateHandler(type, value, completeFunction);
}

baseClass._adjustContentSize = function() {
    let content = this._content,
        element = this.element,
        header = element.find('.zdialog__header'), // No I18N
        footer = element.find('.zdialog__footer'), // No I18N
        headerHeight = header.length ? header.outerHeight(true) : 0,
        footerHeight = footer.length ? footer.outerHeight(true) : 0,
        footnoteHeight = this._footer.length ? this._footer.outerHeight(true) : 0, // No I18N
        computed = Math.abs(ZC.windowObject.height - (headerHeight + footerHeight + footnoteHeight + parseInt(content.css('padding-top')) + parseInt(content.css('padding-bottom')) + parseInt(element.css('border-top-width')) + parseInt(element.css('border-bottom-width')))), // No I18N
        computedWidth = ZC.windowObject.width - parseInt(content.css('padding-left')) - parseInt(content.css('padding-right')) - parseInt(content.css('margin-right')) - parseInt(content.css('margin-left')) - parseInt(element.css('border-left-width')) - parseInt(element.css('border-right-width')); // No I18N
    // padding top and padding bottom of dialog is added & padding left and right of the dialog is subtracted to have the dialog in view port
    content.width(computedWidth); // width and height is set individually in order to consider different box-sizing values for zdialog__content.
    content.height(computed);
}
baseClass._triggerActiveElement = function() {
    let _activeElement = this._activeElement || '';
    if (!_activeElement.length) {
        _activeElement = this.element.find('.zdialog__header'); // No I18N
    }
    _activeElement.trigger('focus'); // No I18N
    this._activeElement = undefined;
}

baseClass._toggleRestore = function(event, button, triggerEvent, value) {
    let isMaximized = this.isMaximized(),
        isMinimized = this.isMinimized();
    if (isMaximized || value === 'maximize') { // No I18N
        this._toggleReverse(isMaximized, 'maximize', 'zdialog--maximized', triggerEvent, undefined, event); // No I18N
    } else if (isMinimized || value === 'minimize') { // No I18N
        this._toggleReverse(isMinimized, 'minimize', 'zdialog--minimized', triggerEvent, undefined, event); // No I18N
    }
    if (button && button.length && button[0].id === this._opts.id + 'minimize' && isMaximized) { // No I18N
        this._toggleReverse(isMinimized, 'minimize', 'zdialog--minimized', triggerEvent, undefined, event); // No I18N
    }
}

baseClass._changeIcon = function(title, iconName) {
    let btns = this._data.titleBarButtons,
        relement = 'restore', // No I18N
        nele = (iconName === 'minimize' || iconName === 'maximize') ? iconName : 'restore', // No I18N
        baseObj = this;
    if (iconName === 'minimizeRestore') { // No I18N
        relement = 'minimize'; // No I18N
    } else if (iconName === 'maximizeRestore') { // No I18N
        relement = 'maximize'; // No I18N
    }
    relement = this._opts.id + relement;
    let i = 0,
        info, mainEle;
    btns.forEach((element) => {
        btns[i].mainElement = baseObj._actionGroup.find('#' + element.id);// No I18N
        if (element.id === relement) {
            mainEle = baseObj._actionGroup.find('#' + relement);// No I18N
            btns[i] = baseObj._updateBtnInfo(nele, mainEle.length && mainEle);
            btns[i].mainElement = undefined;
            info = btns[i];
            info.title = title;
            info.actionName = nele;
            info.zdaction = nele === 'restore' ? 'maximize' : nele; // No I18N
        }
        i++;
    });
    this._render(); // render is needed in order to reflect the min-max state icon changes
    // this._setBtnValue(info, info);
    if (info.mainElement) {
        $(info.mainElement).attr('data-zdaction', info.actionName); // No I18N
    }
}

baseClass._buttonAnimateHandler = function(type, value, callback) {
    let animInfo = this._opts.animation;
    if (animInfo[value]) {
        this._animateAction(animInfo, (type ? value + 'Restore' : value), callback); // No I18N
    } else {
        callback();
    }
}

baseClass._minMaxClick = function(zdaction, event, btn) {
    this['_toggle' + zdaction[0].toUpperCase() + zdaction.substring(1)](event, btn, true); // No I18N
    if (zdaction === 'restore') {
        this._resetPosition(this.element, true);
    }
    if (event.type === 'keydown') { // No I18N
        // preventing the event propagation since keydown event triggers click event further.
        return false;
    }
}

baseClass._resetPosition = function(element, remove) {
    ZC._minArr = ZC._minArr || [];
    let index = ZC._minArr.indexOf(element);
    if (remove) {
        if (index > -1) {
            ZC._minArr.splice(index, 1);
        }
    } else {
        ZC._minArr.push(element);
    }
    // have to adjust all dialogs position
    let len = ZC._minArr.length,
        right, curr, prev,
        propName = this._opts.rtl ? 'left' : 'right'; // No I18N
    for (let i = len - 1; i > 0; i--) {
        curr = $(ZC._minArr[i]);
        prev = $(ZC._minArr[i - 1]);
        right = parseFloat(prev.css(propName)) + prev.outerWidth();
        curr.css(propName, right);
    }
    $(ZC._minArr[0]).css(propName, 0);
}

baseClass._titleBarClickHandler = function(event) { // dblclick
    // Perform Minimize, Maximize or Restore Operation while double clicking the titleBar
    if (!$(event.target).closest('.zdialog__actiongroup').length) {
        let action = (this.isMaximized() || this.isMinimized()) ? 'restore' : (this._opts.maximizable ? 'maximize' : (this._opts.minimizable ? 'minimize' : undefined)); // No I18N
        action && this._toggleRestore(event, undefined, true, action); // No I18N
        if (action === 'restore') { // No I18N
            this._resetPosition(this.element, true);
        }
    }
}

