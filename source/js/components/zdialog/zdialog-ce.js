import ZDialog from './zdialog-main'; // No I18N

let baseClass = ZDialog.prototype;

baseClass._insertTitle = function(ele) {
    if (this.isCE && this._titleBar && !this._titleBar.find('.z-dialogtitle').length) {
        this._titleBar.prepend(ele);
        ele.addClass('zdialog__title zdialog__text');
    }
}
baseClass.CEDefinitions = [ {
    tagName: 'z-dialogtitle', // No I18N
    methods: {
        insert: '_insertTitle' // No I18N
    }
}, {
    tagName: 'z-dialogcontent' // No I18N
}, {
    tagName: 'z-dialogactionbar' // No I18N
}, {
    tagName: 'z-dialogfootnote', // No I18N
    methods: {
        insert: '_setFootnote' // No I18N
    }
} ]
