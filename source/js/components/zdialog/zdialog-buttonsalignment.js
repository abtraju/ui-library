import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass._ALIGNMENTS = {
    left: 'zdialogfooter--invert', // No I18N
    right: '', // No I18N
    center: 'zh-center' // No I18N

}
baseClass._getAlignCls = function(btnAlign) {
    return this._ALIGNMENTS[btnAlign];
}
