define([
    "collections/CollectionBase",
    "models/Event",
    "backbone",
], function(
    CollectionBase,
    Event,
    Backbone,
){
    var Collection = CollectionBase.extend({
        model: Event,
        url: '/api/events/'
    });
    //Group.collection = GroupCollection;

    return Collection;
});
