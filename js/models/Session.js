define([
    "backbone"
], function(
    Backbone
){
    var Session = Backbone.Model.extend({
        defaults: {
            id: null,
            permissions: "{}"
        },

        initialize: function(){
            this.set("permissions", JSON.parse(this.get("permissions")));
        }

    });

    return Session;
});
v