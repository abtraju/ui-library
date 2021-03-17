import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass._setFootnote = function(footer) {
    let _opts = this._opts;
    footer = footer || _opts.footer;
    if (this.isCE) {
        let ele = this.element.find('z-dialogfootnote').addClass('zdialog__footnote');
        ele.length && (this._data.footerEle = ele);
    } else if (footer && footer.trim() !== '') {
        this._data.footer = _opts.isFooterHTMLEncoded ? footer : ZC.encodeHTML(footer);
    }
}
