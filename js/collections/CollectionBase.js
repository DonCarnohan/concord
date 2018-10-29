define([
    "backbone"
], function(
    Backbone
){
    var CollectionBase = Backbone.Collection.extend({

        fetch: function(){
            this.dataDeferred = Backbone.Collection.prototype.fetch.apply(this, arguments);
            return this.dataDeferred;
        },
    });

    return CollectionBase;
});
