ZC.alterBorderRadius = function(options, clear) { // alternative names: change, modify
    // options: element, forElement, direction, offset, hasSideAlignment ( set true if submenu )
    let cls = 'zh-radiusbottomleft zh-radiustopleft zh-radiusbottomright zh-radiustopright zh-radiustop zh-radiusbottom zh-radiusright zh-radiusleft', // No I18N
        ele = options.element,
        target = options.forElement;
    // Resetting the border radius which was set previously.
    ele.add(target).removeClass(cls); // No I18N
    if (clear) {
        return;
    }
    let sideAdjustments = [ 'right-top', 'right-bottom', 'left-top', 'left-bottom' ], // No I18N
        pairs = {
            right: 'left', // No I18N
            left: 'right', // No I18N
            top: 'bottom', // No I18N
            bottom: 'top' // No I18N
        },
        dir = options.direction,
        pos = options.offset;
    if (options.hasSideAlignment && sideAdjustments.indexOf(dir) < 0) { // denotes submenu like cases where the element will not open in top/bottom directions.
        ele.addClass(dir.replace(/([a-z]+)-([a-z]+)/g, (match, w1, w2) => 'zh-radius' + pairs[w2] + pairs[w1])); // No I18N
        pos.left += dir.indexOf('left') === 0 ? 1 : -1;
    } else { // setting the border radius based on the element opening direction.
        let pInt = parseInt,
            topLeft = 0,
            topRight = 0,
            bottomLeft = 0,
            bottomRight = 0;
        if (target.length) { // usage of css method should be avoided ##revisit later
            topLeft = pInt(target.css('border-top-left-radius')); // No I18N
            topRight = pInt(target.css('border-top-right-radius')); // No I18N
            bottomLeft = pInt(target.css('border-bottom-left-radius')); // No I18N
            bottomRight = pInt(target.css('border-bottom-right-radius')); // No I18N
        }
        if (topLeft <= 5 && topRight <= 5 && bottomLeft <= 5 && bottomRight <= 5) { // circular type targets should be excluded.
            let borderSuffix, targetSuffix;
            if (dir.indexOf('top') === 0 || dir.indexOf('bottom') === 0) { // No I18N
                dir.replace(/(\w+)-(\w+)/g, (match, w1, w2) => { // only top-right, top-left, bottom-right, bottom-left has to be considered
                    // outer width is taken into account since width lacks border values.
                    let twidth = target.outerWidth(),
                        ewidth = ele.outerWidth(),
                        isEqual = twidth === ewidth,
                        isGreater = twidth < ewidth; // for select box like elements both the width are equal.
                    if(isEqual){
                        borderSuffix = pairs[w1];
                        targetSuffix = w1;
                    }else{
                        borderSuffix = pairs[w1] + (isGreater ? w2 : '');
                        targetSuffix = w1 + (isGreater ? '' : w2);
                    }
                    // let isGreater = target.outerWidth() <= ele.outerWidth(); // for select box like elements both the width are equal.
                    // borderSuffix = pairs[w1] + (isGreater ? w2 : '');
                    // targetSuffix = w1 + (isGreater ? '' : w2);
                });
                pos.top += dir.indexOf('top') === 0 ? 1 : -1; // This change is needed after Flex and RTL related CSS changes.
            } else if ((/^right(-)?(\w)*$/).test(dir) || (/^left(-)?(\w)*$/).test(dir)) {
                dir.replace(/^right|left(-)?(\w)*$/g, (w1) => {
                    borderSuffix = pairs[w1.split('-')[0]];
                });
                targetSuffix = pairs[borderSuffix];
            }
            ele.addClass('zh-radius' + borderSuffix); // No I18N
            target.addClass('zh-radius' + targetSuffix); // No I18N
        } else { // adjust the top value of the element by 2 pixels.
            pos.top = pos.top + 2;
        }
    }
    return pos;
}
