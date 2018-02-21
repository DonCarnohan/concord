define([
    "views/pages/PageBase",
    "backbone",
    "underscore",
    "text!views/templates/home.html",
], function(
    PageBase,
    Backbone,
    _,
    templateText,
){
    var Home = PageBase.extend({
        template: _.template(templateText),
    });

    return Home;
});
