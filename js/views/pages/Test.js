define([
    "backbone",
], function(
    Backbone,
){
    var Test = Backbone.View.extend({
        el: '#content',

        initialize: function(){
            this.$el.html("HELLO")
        },

    });

    return Test;
});
