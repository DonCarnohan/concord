define([
    "views/ViewBase",
    "backbone",
    "underscore",
    "text!views/templates/filter-group.html",
], function(
    ViewBase,
    Backbone,
    _,
    templateText,
){
    var FilterGroup = ViewBase.extend({
        size: null,
        template: _.template(templateText),
        getContext: function(){
            return {
                title: this.title,
                options: this.options,
            };
        },
        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
        }
    });

    return FilterGroup;
});
