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
        autocomplete: null,
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
            this.$el.attr("name", this.name);
            this.$el.attr("autocomplete", this.autocomplete);
            this.$el.addClass(this.sizeClass);
            this.$el.val(this.instance.get(this.name));
        }
    });

    return Textbox;
});
