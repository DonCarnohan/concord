define([
    "views/ViewBase",
    "backbone",
    "underscore",
    "jquery",
    "text!views/templates/nav.html",
], function(
    ViewBase,
    Backbone,
    _,
    $,
    templateText,
){
    var Nav = ViewBase.extend({
        tagName: "nav",
        className: "navbar navbar-default",
        template: _.template(templateText),
        brand: null,
        initialize: function(){
            if(!this.pages){
                this.pages = [];
            }
            this.$el.addClass(this.className);
            ViewBase.prototype.initialize.apply(this, arguments);
        },
        getPages: function(){
            return [];
        },
        getContext: function(){
            return {
                pages: this.pages || [],
                brand: this.brand,
            };
        },
        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
        }
    });

    return Nav;
});
