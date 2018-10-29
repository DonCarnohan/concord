define([
    "backbone"
], function(
    Backbone
){
    var ModelBase = Backbone.Model.extend({
        schema: {},
        defaults: {},
        models: {},
        collections: {},
        url: function() {
            var url = Backbone.Model.prototype.url.apply(this, arguments);
            return url + (url.charAt(url.length - 1) == '/' ? '' : '/');
        },
        fetch: function(){
            this.dataDeferred = Backbone.Model.prototype.fetch.apply(this, arguments);
            return this.dataDeferred;
        },
        parse: function(response){
            _.mapObject(this.models, function(model, field){
                response[field] = new model(response[field], {parse: true});
            });
            _.mapObject(this.collections, function(collection, field){
                response[field] = new collection(response[field], {parse: true});
            });
            return response;
        },
        validate: function(attrs, options){
            var errors = {};
            if(!options){
                options = {};
            }
            //default validation based on schema
            for(var i = 0; i < this.schema.length; i++){
                var field = this.schema[i];
                if(!options.only || options.only[field.name]){
                    if(field.validators){
                        for(var j = 0; j < field.validators.length && !errors[field.name]; j++){
                            var validator = field.validators[j];
                            var errorText = validator.error || "This field is not valid.";
                            if(validator.pattern){
                                if(!validator.pattern.test(this.get(field.name))){
                                    errors[field.name] = errorText;
                                }
                            }
                            if(validator.validate){
                                if(!validator.validate(this.get(field.name))){
                                    errors[field.name] = errorText;
                                }
                            }
                        }
                    }
                }
            }
            if(Object.keys(errors).length === 0){
                errors = undefined;
            }
            return errors;
        },
        isFieldValid: function(field){
            var only = {};
            only[field] = true;
            return this.validate(this.attributes, {only:only});
        },
        initialize: function(){
            if(this.defaults.permissions_json){
                this.set("permissions", JSON.parse(this.get("permissions_json")));
            }   
            if(this.defaults.extra_information_json){
                this.set("extra_information", JSON.parse(this.get("extra_information_json")));
            }   
        },

        get: function(field){
            var getFunctionName = 'get'+field.charAt(0).toUpperCase()+field.slice(1);
            if(this[getFunctionName]){
                return this[getFunctionName]();
            } else {
                return Backbone.Model.prototype.get.apply(this, arguments);
            }
        },

        hasPermission: function(permission){
            // All permissions are double-checked by backend where it *really* matters.
            var allowed = false;
            //if the user has all permissions just return true...
            if(_.contains(this.get("permissions"), "all")){
                return true;
            }
            if(this.defaults.permissions){
                if(Array.isArray(permission)){
                    for(var sub_permission in permission){
                        allowed = allowed || this.hasPermission(sub_permission);
                    }
                } else {
                    allowed = _.contains(this.get("permissions"), permission);
                }
            }
            return allowed;
        }

    });

    return ModelBase;
});
