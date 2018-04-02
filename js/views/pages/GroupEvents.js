define([
    "views/pages/PageBase",
    "views/widgets/List",
    "models/Event",
    "collections/EventCollection",
    "backbone",
    "underscore",
    "text!views/templates/schedule.html",
    "text!views/templates/event-list-item.html",
], function(
    PageBase,
    List,
    Event,
    EventCollection,
    Backbone,
    _,
    templateText,
    eventListItemTemplateText,
){
    var Schedule = PageBase.extend({
        title: "Schedule",
        template: _.template(templateText),
        initialize: function(){
            var self = this;
            this._createComponent("eventCollection", _.bind(function(){
                var collection = new EventCollection();
                collection.fetch();
                return collection;
            }, this));
            this._createComponent("eventList", _.bind(function(){
                return new List({
                    collection: this.getEventCollection(),
                    listItemTemplate: _.template(eventListItemTemplateText),
                    groupBy: function(item){

                    },
                    listItemContextMap: {
                        title: "name",
                        description: "description",
                        abbreviation: "url_name",
                        isMember: "is_member",
                    },
                    filters: [
                        // {
                        //     field: "attending",
                        //     title: "Show",
                        //     options: [
                        //         {id:false, description:"All Sessions"},
                        //         {id:true, description:"Attending", default:true},
                        //     ],
                        // },
                        // {
                        //     field: "sort",
                        //     title: "Sort By",
                        //     options: [
                        //         {id:"name", description:"Name", default:true},
                        //         {id:"session", description:"Upcoming Events"},
                        //         {id:"attended_session", description:"Recently Attended Events"},
                        //         {id:"joined_date", description:"Date Joined"},
                        //     ],
                        // },
                    ],
                });
            }, this));
            PageBase.prototype.initialize.apply(this, arguments);
        },
        getContext: function(){
            return {
                title: this.title,
            }
        },
        render: function(){
            PageBase.prototype.render.apply(this, arguments);
            this.$el.append(this.getEventList().$el);
        },
    });

    return Schedule;
});
