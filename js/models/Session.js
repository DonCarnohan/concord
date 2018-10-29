define([
    "models/Event",
    "collections/EventCollection",
    "models/Group",
    "models/ModelBase",
    "models/validators",
    "backbone",
    "moment",
], function(
    Event,
    EventCollection,
    Group,
    ModelBase,
    validators,
    Backbone,
    moment,
){
    var Session = ModelBase.extend({
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
            {name:'event_id', type: 'ModelChoice', label: "Event", editorOptions: {
                descriptionProperty: 'title',
                collectionType: EventCollection,
            }, validators:[validators.NotBlankValidator]},
            {name: 'start_timestamp', type:'DateTime', label: "Start Time"},
            {name: 'end_timestamp', type:'DateTime', label: "End Time"},
        ],

        initialize: function(){
            ModelBase.prototype.initialize.apply(this, arguments);

        },

        getTime_range: function(){
            var startTimestamp = moment(this.get('start_timestamp'));
            var endTimestamp = moment(this.get('end_timestamp'));
            var startFormatString = '';
            var endFormatString = '';
            if(startTimestamp.minutes() == "00"){
                startFormatString += 'h a';
            } else {
                startFormatString += 'LT';
            }
            if(endTimestamp.minutes() == "00"){
                endFormatString += 'h a';
            } else {
                endFormatString += 'LT';
            }
            if(startTimestamp.format('L') != endTimestamp.format('L')){
                endFormatString += ' dddd MMM Do';
            }

            return startTimestamp.format(startFormatString) + " - " + endTimestamp.format(endFormatString + " ZZ")
        },

    });

    return Session;
});
