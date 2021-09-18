Namespace('DreamUI');

/**
 *
 * @module ElementController
 * @class
 * @name ElementController
 *
 * Inherit this class and use as controller in tandem with a DreamUI.DreamElement, which
 * should be assigned to _this.view as done in initView()
 *
 * @param withState {boolean} whether to add AppState state object
 */
DreamUI.Class(function ElementController({
    withState = false,
    controllerStyles
} = {}) {
    Inherit(this, Element);
    const _this = this;

    console.log("TEST");
    /**
     * @property state {AppState}
     *
     */
    _this.state = null;

    if (withState) _this.state = AppState.createLocal();
    if (controllerStyles) {
        _this.element.goob({
            ...controllerStyles
        });
    }

    /**
     * @method initView
     * @example
     * await _this.initView({
            component: DreamUI.YourComponent,
            config: {
                id,
                styles,
                label,
                preset,
                required
            }
        }).ready(); // waits for view to be ready
     *
     * @param {*} param
     * @returns
     */
    _this.initView = function({ component, config }) {
        _this.view = _this.initClass(component, config);
        return _this.view;
    };

    _this.ready = _ => _this.wait('isReady');

    _this.setReady = (val = true) => _this.flag('isReady', val);

    _this.setStyles = async (...args) => {
        await _this.wait('view');
        await _this.view.ready();
        return _this.view.setStyles(...args);
    };

    _this.get('isFormControl', _ => _this.view.isFormControl);
});
