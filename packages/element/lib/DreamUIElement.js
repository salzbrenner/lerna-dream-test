Namespace('DreamUI');

/**
 * <pre>
 * CoreUI element for the dream platform
 * </pre>
 *
 * @module DreamElement
 * @class
 * @name DreamElement
 *
 * @example
 * // TODO
 *
 * @param type {string} element type
 */
DreamUI.Class(function DreamElement(type) {
    Inherit(this, Element, type);

    const _this = this;
    const $this = _this.element;

    //*** Constructor
    (async function () {
        _this.constructorName = Utils.getConstructorName(_this);
        _this.styleguide = DreamStyleguide.instance();
        _this.colors = DreamColors.instance();
        _this.binds = [];
    })();

    function flatten(list) {
        var value, jlen, j;
        var result = [];
        var idx = 0;
        var ilen = list.length;

        const flatt = (list) => {
            while (idx < ilen) {
                if (_isArrayLike(list[idx])) {
                    value = flatt(list[idx]);
                    j = 0;
                    jlen = value.length;
                    while (j < jlen) {
                        result[result.length] = value[j];
                        j += 1;
                    }
                } else {
                    result[result.length] = list[idx];
                }
                idx += 1;
            }
            return result;
        };

        return flatt(list);
    }

    function _isArrayLike(possibleArray) {
        if (_isArray(possibleArray)) {
            return true;
        }
        if (!possibleArray) {
            return false;
        }
        if (typeof possibleArray !== "object") {
            return false;
        }
        if (possibleArray.length === 0) {
            return true;
        }
        if (possibleArray.length > 0) {
            return possibleArray.hasOwnProperty(0) && x.hasOwnProperty(possibleArray.length - 1);
        }

        return false;
    }

    function _isArray(val) {
        return (
            val != null &&
            val.length >= 0 &&
            Object.prototype.toString.call(val) === "[object Array]"
        );
    }

    function _mergeAll(target) {
        if (target == null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        var output = Object();
        var idx = 0;
        var length = target.length;
        while (idx < length) {
            var source = target[idx];
            if (source != null) {
                for (var nextKey in source) {
                    output[nextKey] = source[nextKey];
                }
            }
            idx += 1;
        }
        return output;
    }

    this.combineStyles = function (objArray) {
        let list;
        list = flatten(objArray);
        let combinedStyles = _mergeAll(list);

        return combinedStyles;
    };


    //*** Public method
    this.parseConfig = function (config) {
        for (let key in config) {
            _this[key] = config[key];
        }
    };

    this.getPrefix = function (className) {
        return `${Utils.getConstructorName(this)}__${className}`;
    };

    this.hideLoader = () => {
        DreamUI.Modal.instance().close();
    };

    this.showLoader = (view, config) => {
        DreamUI.Modal.instance().open(view, {
            closeOnClickOutside: false,
            options: config
        });
    };

    this.setStyles = async (styleOverwrite, pairLookupArr = []) => {
        await _this.wait('isReady');
        if (!styleOverwrite) return;

        _this.styles = styleOverwrite;
        const keyPairs = [
            ...Object.keys(styleOverwrite).map(v => ({ domKey: v, styleKey: v })),
            ...pairLookupArr
        ];
        keyPairs.forEach(k => {
            let domObj = k.domKey.split('.').reduce((a, c) => a?.[c], _this);
            let newStyle = k.styleKey.split('.').reduce((a, c) => a?.[c], styleOverwrite);
            if (domObj?.css && newStyle) domObj.css(newStyle);
        });
    };

    _this.ready = _ => _this.wait('isReady');

    _this.setReady = (val = true) => _this.flag('isReady', val);

    this.onDestroy = () => {
        _this.binds.forEach(bind => {
            bind.destroy();
        });
    };
});
