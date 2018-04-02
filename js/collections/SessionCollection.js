define([
    "collections/CollectionBase",
    "models/Session",
    "backbone",
], function(
    CollectionBase,
    Session,
    Backbone,
){
    var Collection = CollectionBase.extend({
        model: Session,
        url: '/api/sessions/'
    });
    //Group.collection = GroupCollection;

    return Collection;
});
