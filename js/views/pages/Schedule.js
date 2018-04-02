define([
    "views/pages/PageBase",
    "views/widgets/List",
    "models/Session",
    "collections/SessionCollection",
    "backbone",
    "underscore",
    "text!views/templates/schedule.html",
    "text!views/templates/schedule-list-item.html",
], function(
    PageBase,
    List,
    Session,
    SessionCollection,
    Backbone,
    _,
    templateText,
    scheduleListItemTemplateText,
){
    var Schedule = PageBase.extend({
        title: "Schedule",
        template: _.template(templateText),
        initialize: function(){
            var self = this;
            this._createComponent("sessionCollection", _.bind(function(){
                var collection = new SessionCollection();
                collection.fetch();
                return collection;
            }, this));
            this._createComponent("scheduleList", _.bind(function(){
                return new List({
                    collection: this.getSessionCollection(),
                    listItemTemplate: _.template(scheduleListItemTemplateText),
                    groupBy: function(item){

                    },
                    listItemContextMap: {
                        title: "name",
                        description: "description",
                        abbreviation: "url_name",
                        isMember: "is_member",
                    },
                    filters: [
                        {
                            field: "attending",
                            title: "Show",
                            options: [
                                {id:false, description:"All Sessions"},
                                {id:true, description:"Attending", default:true},
                            ],
                        },
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
            this.$el.append(this.getScheduleList().$el);
        },
    });

    return Schedule;
});
