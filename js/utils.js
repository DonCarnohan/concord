define([
    "backbone",
    "underscore",
    "jquery",
    "text!views/templates/loading.html",
], function(
    Backbone,
    _,
    $,
    loadingTemplateText,
){
    var utils = {
        startLoading: function(container){
            var loadingElements = _.template(loadingTemplateText)();
            container.append(loadingElements)
        },
        endLoading: function(container){
            $(container).children(".loader").remove();
        },
    };

    return utils;
});
