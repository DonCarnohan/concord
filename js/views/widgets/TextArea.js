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
        events: {
            "keyup": "setInstanceValue",
        },
        setInstanceValue: function(){
            if(this.instance){
                if(this._setterTimeout){
                    clearTimeout(this._setterTimeout);
                }
                this._setterTimeout = setTimeout(_.bind(function(){
                    this.instance.set(this.name, this.$el.val());
                    this._setterTimeout = null;
                },this), 300);
            }
        },
        setValue: function(value){
            this.value = value;
            this.$el.val(value);
        },
        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
            this.$el.attr("type", this.type);
            this.$el.val(this.instance.get(this.name));

        }
    });

    return TextArea;
});
