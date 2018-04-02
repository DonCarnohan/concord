define([
    "views/ViewBase",
    "backbone",
    "underscore",
    "datetimepicker",
], function(
    ViewBase,
    Backbone,
    _,
    datetimepicker,
){
    var DateTimePicker = ViewBase.extend({
        tagName: "input",
        className: "input-group",
        autocomplete: null,
        name: null,
        options: {
            format: "MM/DD/YYYY hh:mm A",
            useCurrent: false,
            stepping: 15,
            sideBySide: true,
        },
        // events: {
        //     "change": "setInstanceValue",
        // },
        setInstanceValue: function(){
            if(this.instance){
                this.instance.set(this.name, this.$el.find('input').val());
            }
        },
        setValue: function(value){
            this.value = value;
            this.$el.find('input').val(value);
        },
        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
            this.$el.find('input').on("change", _.bind(this.setInstanceValue, this));
            this.$el.find('input').attr("name", this.name);
            this.$el.attr("autocomplete", this.autocomplete);
            this.$el.addClass(this.sizeClass);
            if(this.instance){
                this.$el.find('input').val(this.instance.get(this.name));
            }
            datetimepicker(this.$el, this.options);
        }
    });

    return DateTimePicker;
});
