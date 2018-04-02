define([
    "models/ModelBase",
    "models/validators",
    "backbone",
], function(
    ModelBase,
    validators,
    Backbone,
){
    var Event = ModelBase.extend({
        urlRoot: '/api/event-categories/',
        title: 'Event Category',
        defaults: {
            id: null,
            description: "",
            group_id: null,
            permissions: {},
        },

        schema: [
            {name:'description', type: 'Text', label: "Event Category", editorOptions: {
                autocomplete: "off"
            }, validators:[validators.NotBlankValidator]}
        ],

        initialize: function(){
            ModelBase.prototype.initialize.apply(this, arguments);

        },

    });

    return Event;
});
