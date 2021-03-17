import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass._fetchAjaxCon = function(content) {
    $.ajax(content).success((ajaxRes) => {
        this._data.content = ajaxRes;
        this._render();
    });
}
