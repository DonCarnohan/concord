define([
    "backbone",
    "underscore",
], function(
    Backbone,
    _,
){
    // Base class methods for a page view
    var ViewBase = Backbone.View.extend({
        constructor: function(args){
            _.extend(this, args);
            Backbone.View.apply(this, arguments);
        },
        initialize: function(){
            this.render();
        },
        render: function(){
            if(this.template){
                this.$el.html(this.template(this.getContext()));
            }
        },
        update: function(){
            this.$el.empty();
            this.render();
        },
        getContext: function(){
            return {};
        },
        _createComponent: function(name, newFunction){
            var self = this;
            var privateName = "_"+name;
            var functionName = "get"+name[0].toUpperCase() + name.substring(1);
            this[functionName] = function(){
                if(!self[privatename]){
                    self[privateName] = newFunction();
                }
                return self[privateName];
            }
        }

    });

    return ViewBase;
});
