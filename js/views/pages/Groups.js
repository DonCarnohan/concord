define([
    "views/pages/PageBase",
    "views/widgets/List",
    "models/Group",
    "collections/GroupCollection",
    "backbone",
    "underscore",
    "text!views/templates/groups.html",
    "text!views/templates/group-list-item.html",
], function(
    PageBase,
    List,
    Group,
    GroupCollection,
    Backbone,
    _,
    templateText,
    groupListItemTemplateText,
){
    var Groups = PageBase.extend({
        template: _.template(templateText),
        initialize: function(){
            var self = this;
            this._createComponent("groupCollection", function(){
                var collection = new GroupCollection();
                collection.fetch();
                return collection;
            });
            this._createComponent("groupList", function(){
                return new List({
                    collection: self.getGroupCollection(),
                    listItemTemplate: _.template(groupListItemTemplateText),
                    listItemContextMap: {
                        title: "name",
                        description: "description",
                        abbreviation: "url_name",
                        isMember: "is_member",
                    },
                    filters: [
                        {
                            field: "personal",
                            title: "Show",
                            options: [
                                {id:false, description:"All Groups", default:true},
                                {id:true, description:"My Groups"},
                            ],
                        },
                        {
                            field: "sort",
                            title: "Sort By",
                            options: [
                                {id:"name", description:"Name", default:true},
                                {id:"session", description:"Upcoming Events"},
                                {id:"attended_session", description:"Recently Attended Events"},
                                {id:"joined_date", description:"Date Joined"},
                            ],
                        },
                    ],
                });
            });
            PageBase.prototype.initialize.apply(this, arguments);
        },
        render: function(){
            PageBase.prototype.render.apply(this, arguments);
            this.$el.append(this.getGroupList().$el);
        },
    });

    return Groups;
});
