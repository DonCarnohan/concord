define([
    "views/pages/PageBase",
    "views/widgets/List",
    "backbone",
    "underscore",
    "text!views/templates/groups.html",
], function(
    PageBase,
    List,
    Backbone,
    _,
    templateText,
){
    var Groups = PageBase.extend({
        template: _.template(templateText),
        getGroupList: function(){
            if(!this._groupList){

            }
        },
        initialize: function(){
            var self = this;
            PageBase.prototype.initialize.apply(this, arguments);
            this._createComponent("groupCollection", function(){
                return [];
            });
            this._createComponent("groupList", function(){
                return new List({
                    collection: self.getGroupCollection();
                    filters: [
                        {
                            field: "personal",
                            title: "Show",
                            options: [
                                {id:false, description:"All Groups"},
                                {id:true, description:"My Groups"},
                            ],
                        },
                    ],
                });
            });
        },
        render: function(){
            PageBase.prototype.render.apply(this, arguments);
        },
    });

    return Groups;
});
