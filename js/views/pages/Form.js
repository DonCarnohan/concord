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
        instance_id: null,
        group_id: null, //optional
        _instance: null,
        _fields: null,
        template: _.template(formTemplateText),

        getInstance: function(){
            if(!this._instance){
                this._instance = new this.model({id: this.instance_id});
                if(this.instance_id){
                    this._instance.fetch({async: false});
                } else if(this.group_id){
                    this._instance.set("group_id", this.group_id);
                }
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
                this._saveButton.$el.on("click", _.bind(function(){
                    var instance = self.getInstance();
                    if(instance.isValid()){
                        var deferred = instance.save();
                        deferred.then(_.bind(function(){
                            //Success
                            //Handle group creation special case (I'M SORRY! T-T ~Don)
                            if(instance.has("url_name")){
                                window.location.href = "/group/"+instance.get("url_name");
                            } else {
                                window.location.href = "/";
                            }
                        }, this), _.bind(function(jqXHR){
                            //Error
                            if(jqXHR.responseJSON){
                                this.handleErrors(jqXHR.responseJSON);
                            }
                        }, this));
                    }
                }, this));
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
                        instance: instance,
                    },options));
                }
                form.append(this._fields[fieldName].$el);
            }, this);
            form.addClass("col-md-8");
            this.$el.find("#button-container").append(this.getSaveButton().$el);
        },

        handleErrors: function(errors){
            for(var fieldName in this._fields){
                var field = this._fields[fieldName];
                if(errors[fieldName]){
                    field.setError(errors[fieldName]);
                } else {
                    field.setError(null);
                }
            }
        },
    });

    return Form;
});
