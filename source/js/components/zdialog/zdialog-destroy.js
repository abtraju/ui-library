import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass._destroy = function() {
    let ele = this.element,
        opts = this._opts,
        content = this._content;
    this._closeModalDlg(null, undefined, true);
    opts.handleFocusNavigation && ZC.FocusHandler.destroy(ele);
    !this.isCE && $(opts.appendTo || 'body').append(ele.removeClass('zdialog zdialog--minimized zdialog--maximized')); // No I18N
    let over = this._overlay;
    if (over && over.length) {
        over.remove();
        this._overlay = undefined;
    }
    if (opts.title) {
        ele.attr('title', opts.title); // No I18N
    }
    let eSuf = '.' + this.name; // No I18N
    ele.off(eSuf).css({
        width: 'auto', // No I18N
        right: '' // No I18N
    });
    opts.resizable && ZC.resizable(ele).destroy();
    opts.draggable && ZC.draggable(ele).destroy();
    if (this.isCE) {
        ele.off(eSuf);
        ele.find('.zdialog__title').removeClass('zdialog__title');  // No I18N
        ele.find('.zdialog__content, .zdialog__commandbar, .zdialog__footer, .zdialog__footnote').removeClass('zdialog__content zdialog__commandbar zdialog__footer zdialog__footnote'); // No I18N
        ele.find('.zdialog__actiongroup, .zresizable__handle').remove(); // No I18N
        ele.find('.zbutton').off(eSuf + ' .zbutton').removeClass('zbutton zbutton--primary is-disabled'); // No I18N
    } else {
        ele.removeAttr('role aria-modal aria-expanded'); // No I18N
        ele[0].innerHTML = content[0].innerHTML;
    }
    this.element = this._footer = this._titleBar = this._content = undefined;
    this._useParent = true;
}
