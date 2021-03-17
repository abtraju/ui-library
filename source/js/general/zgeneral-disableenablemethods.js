import CoreComponent from './zgeneral-main';
let baseClass = CoreComponent.prototype;

baseClass.disable = function(disable = true) {
    this._opts.disabled = disable;
    this._disable(disable);
    this._renderAttrChange();
}

baseClass.enable = function() {
    this.disable(false);
}
