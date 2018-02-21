define([
    "views/ViewBase",
    "backbone",
    "underscore",
], function(
    ViewBase,
    Backbone,
    _,
){
    var Button = ViewBase.extend({
        tagName: "button",
        className: "btn",
        style: "primary",
        type: "button",
        size: null,
        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
            if(this.style){
                this.$el.addClass("btn-"+ this.style);
            }
            if(this.size){
                this.$el.addClass("btn-"+ this.size);
            }
            this.$el.attr("type", this.type);
            this.$el.html(this.text);
        }
    });

    return Button;
});
