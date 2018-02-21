define([
    "views/ViewBase",
    "backbone",
    "underscore",
], function(
    ViewBase,
    Backbone,
    _,
){
    var TextArea = ViewBase.extend({
        tagName: "textarea",
        className: "form-control",
        style: "primary",
        name: null,
        setValue: function(value){
            this.value = value;
            this.$el.val(value);
        },
        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
            this.$el.attr("type", this.type);
            this.$el.val(this.value);
        }
    });

    return TextArea;
});
