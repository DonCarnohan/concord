define([
    "collections/CollectionBase",
    "models/EventCategory",
    "backbone",
], function(
    CollectionBase,
    EventCategory,
    Backbone,
){
    var Collection = CollectionBase.extend({
        model: EventCategory,
        url: '/api/event-categories/'
    });
    //Group.collection = GroupCollection;

    return Collection;
});
