define([
    "views/pages/GroupPageBase",
    "views/widgets/List",
    "views/widgets/GroupNav",
    "models/Event",
    "collections/EventCollection",
    "collections/EventCategoryCollection",
    "backbone",
    "underscore",
    "text!views/templates/group-events.html",
    "text!views/templates/event-list-item.html",
], function(
    GroupPageBase,
    List,
    GroupNav,
    Event,
    EventCollection,
    EventCategoryCollection,
    Backbone,
    _,
    templateText,
    eventListItemTemplateText,
){
    var Events = GroupPageBase.extend({
        title: "Events",
        template: _.template(templateText),
        initialize: function(){
            var self = this;
            this._createComponent("eventCollection", _.bind(function(){
                var collection = new EventCollection();
                collection.fetch();
                return collection;
            }, this));
            this._createComponent("eventCategoryCollection", _.bind(function(){
                var collection = new EventCategoryCollection();
                collection.fetch();
                return collection;
            }, this));
            this._createComponent("eventCategoryFilters", _.bind(function(){
                var collection = this.getEventCategoryCollection();
                var filters = [];
                collection.forEach(_.bind(function(category){
                    filters.push({
                        id: category.get("id"),
                        description: category.get("description"),
                    });
                }, this));
                return filters;
            }, this));
            this._createComponent("eventList", _.bind(function(){
                return new List({
                    collection: this.getEventCollection(),
                    listItemTemplate: _.template(eventListItemTemplateText),
                    groupBy: function(item){
                        return item.get("event_category").get("description");
                    },
                    listItemContextMap: {
                        id: "id",
                        title: "title",
                        description: "description",
                        event_category_description: "event_category__description",
                    },
                    filters: [
                        {
                            field: "event_category__id",
                            title: "Category",
                            options: this.getEventCategoryFilters(),
                        },
                    ],
                });
            }, this));

            $.when(this.getEventCategoryCollection().dataDeferred).then(_.bind(function(){
                GroupPageBase.prototype.initialize.apply(this, arguments);
            }, this));
        },
        getContext: function(){
            return {
                title: this.title,
            }
        },
        render: function(){
            GroupPageBase.prototype.render.apply(this, arguments);
            this.$el.append(this.getEventList().$el);
        },
    });

    return Events;
});
