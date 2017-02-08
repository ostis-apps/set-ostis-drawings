SetComponent = {
    ext_lang: 'set_code',
    formats: ['format_set_json'],
    struct_support: true,

    factory: function(sandbox) {
        return new setViewerWindow(sandbox);
    }
};

var setViewerWindow = function(sandbox) {

    var self = this;
    this.sandbox = sandbox;
    this.sandbox.container = sandbox.container;

    $('#' + sandbox.container).load('static/components/html/set-main-page.html');
};

SCWeb.core.ComponentManager.appendComponentInitialize(SetComponent);
