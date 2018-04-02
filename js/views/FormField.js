define([
    "views/ViewBase",
    "views/widgets/Textbox",
    "views/widgets/TextArea",
    "views/widgets/DateTimePicker",
    "backbone",
    "underscore",
    "text!views/templates/form-field.html",
], function(
    ViewBase,
    Textbox,
    TextArea,
    DateTimePicker,
    Backbone,
    _,
    formFieldTemplateText,
){
    var FormField = ViewBase.extend({
        type: null,
        tagName: 'div',
        className: 'form-group',
        template: _.template(formFieldTemplateText),
        typeMap: {
            "Text": Textbox,
            "TextArea": TextArea,
            "DateTime": DateTimePicker,
        },

        getEditor: function(force){
            if(!this._editor || force){
                var type = this.type;
                if(typeof(this.type) == "string"){
                    type = this.typeMap[this.type];
                }
                this._editor = new type(_.extend({
                    id: this.name,
                    name: this.name,
                    instance: this.instance,
                }, this.editorOptions));
            }
            return this._editor;
        },

        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
            var label = this.$el.find(".editor-label");
            label.html(_.escape(this.label) || this.labelHTML);
            label.attr("for", this.name);
            var editorContainer = this.$el.find(".editor-container");
            var editor = this.getEditor();
            editor.setValue(this.value);
            editorContainer.append(editor.$el);
            var validateField = function(){
                //validate
                var error = this.instance.isFieldValid(this.name);
                if(error){
                    this.setError(error[this.name]);
                } else {
                    this.setError(null);
                }
            };
            editor.$el.on("blur", _.bind(validateField, this));
            this.instance.on("change:"+this.name, validateField, this);
            this.instance.on("invalid", function(model, error){
                if(error[this.name]){
                    this.setError(error[this.name]);
                }
            }, this);
        },

        setError: function(error){
            var editorError = this.$el.find(".editor-error");
            if(error){
                this.$el.addClass("has-error");
                editorError.removeClass("hidden");
                editorError.html(error);
            } else {
                this.$el.removeClass("has-error");
                editorError.html("");
                editorError.addClass("hidden");
            }
        },
    });

    return FormField;
});
