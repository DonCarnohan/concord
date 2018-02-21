define([
    "views/pages/PageBase",
    "views/widgets/Button",
    "views/FormField",
    "backbone",
    "underscore",
    "text!views/templates/form.html",
], function(
    PageBase,
    Button,
    FormField,
    Backbone,
    _,
    formTemplateText,
){
    var Form = PageBase.extend({
        model: null,
        instance_data: null,
        _instance: null,
        _fields: null,
        template: _.template(formTemplateText),

        getInstance: function(){
            if(!this._instance){
                this._instance = new this.model(JSON.parse(this.instance_data || "{}"));
            }
            return this._instance;
        },

        getSaveButton: function(){
            var self = this;
            if(!this._saveButton){
                this._saveButton = new Button({
                    text: "Save",
                    size: "lg",
                    style: "success",
                });
                this._saveButton.on("click", function(){
                    var errors = self.getForm().commit({validate: true});
                    if(!errors){
                        var deferred = self.getInstance.save();
                        deferred.then(function(){
                            //Success
                        }, function(){
                            //Error

                        });
                    }
                });
            }
            return this._saveButton;
        },

        initialize: function(){
            this._fields = {};
            this.render();
        },

        getContext: function(){
            return {
                model: this.model,
                instance: this.getInstance(),

            };
        },

        render: function(){
            PageBase.prototype.render.apply(this, arguments);
            var form = this.$el.find("form");
            var instance = this.getInstance();
            _.each(this.model.prototype.schema, function(options){
                var fieldName = options.name;
                if(!this._fields[fieldName]){
                    this._fields[fieldName] = new FormField(_.extend({
                    },options));
                    this._fields[fieldName].on("change", function(evt){
                        instance.set(fieldName, evt.newValue);
                    }, this);
                }
                form.append(this._fields[fieldName].$el);
            }, this);
            form.addClass("col-md-4");
            this.$el.find("#button-container").append(this.getSaveButton().$el);
        },
    });

    return Form;
});
