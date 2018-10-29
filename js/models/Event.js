define([
    "models/EventCategory",
    "collections/EventCategoryCollection",
    "models/Group",
    "models/ModelBase",
    "models/validators",
    "backbone",
], function(
    EventCategory,
    EventCategoryCollection,
    Group,
    ModelBase,
    validators,
    Backbone,
){
    var Event = ModelBase.extend({
        urlRoot: '/api/events/',
        title: 'Event',
        defaults: {
            id: null,
            group: {},
            title: "",
            description: "",
            event_category: {},
            tags: "",
            extra_information: {},
            permissions: {},
        },
        models: {
            event_category: EventCategory,
            group: Group,
        },

        schema: [
            {name:'title', type: 'Text', label: "Title", editorOptions: {
                autocomplete: "off"
            }, validators:[validators.NotBlankValidator]},
            {name:'event_category_id', type: 'ModelChoice', label: "Category", editorOptions: {
                descriptionProperty: 'description',
                collectionType: EventCategoryCollection,
            }, validators:[validators.NotBlankValidator]},
            {name:'description', type: 'TextArea', label: "Description"},
            {name:'tags', type: 'Text', label: "Tags (space separated)"},
        ],

        initialize: function(){
            ModelBase.prototype.initialize.apply(this, arguments);

        },

    });

    return Event;
});
