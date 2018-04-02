define([
    "models/Event",
    "models/Group",
    "models/ModelBase",
    "models/validators",
    "backbone",
], function(
    Event,
    Group,
    ModelBase,
    validators,
    Backbone,
){
    var Session = Backbone.Model.extend({
        urlRoot: '/api/sessions/',
        title: 'Session',
        defaults: {
            id: null,
            event: {},
            group: {},
            start_timestamp: null,
            end_timestamp: null,
            permissions: {},
        },
        models: {
            event: Event,
            group: Group,
        },

        schema: [
            {name:'event', type: 'Text', label: "Event", editorOptions: {
                autocomplete: "off"
            }, validators:[validators.NotBlankValidator]},
            {name: 'start_timestamp', type:'DateTimePicker', label: "Start Time"},
            {name: 'end_timestamp', type:'DateTimePicker', label: "End Time"},
        ],

        initialize: function(){
            ModelBase.prototype.initialize.apply(this, arguments);

        },

    });

    return Session;
});
