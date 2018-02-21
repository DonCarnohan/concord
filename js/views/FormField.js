define([
    "views/ViewBase",
    "views/widgets/Textbox",
    "views/widgets/TextArea",
    "backbone",
    "underscore",
    "text!views/templates/form-field.html",
], function(
    ViewBase,
    Textbox,
    TextArea,
    Backbone,
    _,
    formFieldTemplateText,
){
    var FormField = ViewBase.extend({
        type: null,
        template: _.template(formFieldTemplateText),
        typeMap: {
            "Text": Textbox,
            "TextArea": TextArea,
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
        }
    });

    return FormField;
});
