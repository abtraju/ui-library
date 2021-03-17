/* eslint-disable no-unused-expressions */
import ZDialog from './zdialog-main';

let baseClass = ZDialog.prototype;

baseClass._createCommandBar = function() {
    this._data.cols = {};
    this._data.commands = [];
    let opts = this._opts,
        columnArray = [],
        layout = opts.commandBar,
        buttons = opts.buttons,
        cols = {},
        buttonObj, buttonNames,
        i = 0;
    layout.leftColumn && (columnArray.push('left'), cols.left = {}); // No I18N
    layout.centerColumn && (columnArray.push('center'), cols.center = {}); // No I18N
    layout.rightColumn && (columnArray.push('right'), cols.right = {}); // No I18N
    let columnName = '',
        columnConfig,
        convertedObj;
    cols.cname = 'zdialog'; // No I18N
    for (let k = 0; k < columnArray.length; k++) {
        columnName = columnArray[k];
        columnConfig = layout[`${columnName}Column`];
        buttonNames = columnConfig.commands;
        columnConfig.className && (cols[columnName].className = columnConfig.className);
        if (buttons) {
            cols[columnName].buttons = [];
            for (i = 0; i < buttonNames.length; i++) {
                // eslint-disable-next-line no-loop-func
                buttonObj = buttons.find((x) => {
                    if (x.name === buttonNames[i]) {
                        return x;
                    }
                });
                if (typeof buttonObj === 'object') { // No I18N
                    convertedObj = this._createButton(buttonObj);
                    this._data.commands.push(convertedObj);
                    cols[columnName].buttons.push(convertedObj);
                }
            }
        }
    }
    this._data.cols = cols;
}
