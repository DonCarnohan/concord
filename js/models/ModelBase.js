define([
    "backbone"
], function(
    Backbone
){
    var ModelBase = Backbone.Model.extend({

        initialize: function(){
            if(this.defaults.permissions_json){
                this.set("permissions", JSON.parse(this.get("permissions_json")));
            }   
        }

    });

    return ModelBase;
});