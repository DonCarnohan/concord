define([
    "views/ViewBase",
    "backbone",
    "underscore",
], function(
    ViewBase,
    Backbone,
    _,
){
    // Base class methods for a page view
    var PageBase = ViewBase.extend({
        el: '#content',
    });

    return PageBase;
});
