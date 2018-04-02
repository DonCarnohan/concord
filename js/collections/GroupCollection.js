define([
    "collections/CollectionBase",
    "models/Group",
    "backbone",
], function(
    CollectionBase,
    Group,
    Backbone,
){
    var GroupCollection = CollectionBase.extend({
        model: Group,
        url: '/api/groups/'
    });
    //Group.collection = GroupCollection;

    return GroupCollection;
});
