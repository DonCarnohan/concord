define([
    "views/ViewBase",
    "backbone",
    "underscore",
], function(
    ViewBase,
    Backbone,
    _,
){
    var Textbox = ViewBase.extend({
        tagName: "input",
        className: "form-control",
        style: "primary",
        type: "text",
        name: null,
        setValue: function(value){
            this.value = value;
            this.$el.val(value);
        },
        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
            this.$el.attr("type", this.type);
            this.$el.attr("name", this.name);
            this.$el.addClass(this.sizeClass);
            this.$el.val(this.value);
        }
    });

    return Textbox;
});
