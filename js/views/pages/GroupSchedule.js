define([
    "views/pages/GroupPageBase",
    "views/widgets/Button",
    "views/widgets/List",
    "views/widgets/GroupNav",
    "models/Group",
    "collections/SessionCollection",
    "collections/EventCategoryCollection",
    "backbone",
    "underscore",
    "showdown",
    "moment",
    "text!views/templates/group-schedule.html",
    "text!views/templates/schedule-list-item.html",
], function(
    GroupPageBase,
    Button,
    List,
    GroupNav,
    Group,
    SessionCollection,
    EventCategoryCollection,
    Backbone,
    _,
    showdown,
    moment,
    templateText,
    sessionListItmeTemplateText,
){
    var GroupSchedule = GroupPageBase.extend({
        template: _.template(templateText),
        initialize: function(){
            var self = this;
            var group = this.getGroup();
            this._createComponent("sessionCollection", _.bind(function(){
                var collection = new SessionCollection();
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
            this._createComponent("sessionList", _.bind(function(){
                return new List({
                    collection: this.getSessionCollection(),
                    listItemTemplate: _.template(sessionListItmeTemplateText),
                    groupBy: function(item){
                        return moment(item.get("start_timestamp")).format('dddd, MMM Do YYYY');
                    },
                    getListItemContext: function(item){
                        var context = {
                            session: item,
                            event: item.get("event"),
                            eventCategory: item.get("event").get("event_category"),
                        };
                        return context;
                    },
                    listItemContextMap: {
                        id: "id",
                        title: "event__title",
                        description: "event__description",
                        event_category_description: "event__event_category__description",
                        start_timestamp: "start_timestamp",
                        end_timestamp: "end_timestamp",
                    },
                    filters: [
                        {
                            field: "",
                            title: "Category",
                            options: this.getEventCategoryFilters(),
                        },
                    ],
                });
            }, this));
            GroupPageBase.prototype.initialize.apply(this, arguments);
        },
        getContext: function(){
            return {
                title: this.getGroup().get("name")+" Schedule",
                group: this.getGroup(),
            }
        },
        render: function(){
            var group = this.getGroup();
            document.title = "Concord - "+group.get("name");
            GroupPageBase.prototype.render.apply(this, arguments);
            this.$el.append(this.getSessionList().$el);
        },
    });

    return GroupSchedule;
});
