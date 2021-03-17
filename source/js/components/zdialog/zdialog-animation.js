import ZDialog from './zdialog-main';
let baseClass = ZDialog.prototype;

baseClass._animateAction = function(animation, action, callback, showElement) {
    if (animation[action]) {
        let effect, duration,
            animationClass = animation[action].className;
        if (typeof animation[action] === 'object') { // No I18N
            effect = animation[action].name;
            duration = animation[action].duration;
        }
        if (animationClass) { // animation properties are given in a class.
            showElement && this._display();
            this.element.addClass(animationClass).on(ZC._animationEnd, () => {
                this.element.removeClass(animationClass); // removing the animation class.
                callback && callback();
                callback = undefined;
            });
        } else if (typeof effect === 'object') { // No I18N
            // custom animation properties
            showElement && this._display();
            this.element.animate(effect, duration, callback);
        } else { // predefined effects like slide and fade.
            this.element[effect](duration, callback);
        }
    }
}
