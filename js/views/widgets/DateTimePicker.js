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
        tagName: "div",
        className: "input-group",
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
        isFieldValid: function(){
            return true;
        },
        setValue: function(value){
            this.value = value;
            this.$el.find('input').val(value);
        },
        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
            this.inputEl = $('<input type="text" class="form-control">');
            this.$el.append(this.inputEl);
            this.inputEl.attr("name", this.name);
            this.inputEl.addClass(this.sizeClass);
            if(this.instance){
                this.inputEl.val(this.instance.get(this.name));
            }
            this.inputEl.datetimepicker(this.options);
            this.inputEl.on("dp.change", _.bind(this.setInstanceValue, this));
        }
    });

    return DateTimePicker;
});
