define([
    "views/pages/PageBase",
    "views/widgets/GroupNav",
    "models/Group",
    "backbone",
    "underscore",
    "text!views/templates/group-page-base.html",
], function(
    PageBase,
    GroupNav,
    Group,
    Backbone,
    _,
    templateText,
){
    var GroupHome = PageBase.extend({
        template: _.template(templateText),
        getGroup: function(options){
            if(this.group){
                this._group = this.group;
                delete this.group;
            }
            if(!this._group){
                this._group = new Group({id: this.group_id});
                if(this.group_id){
                    this._group.fetch(options);
                }
            }
            return this._group;
        },
        initialize: function(){
            var self = this;
            $.when(this.getGroup().dataDeferred).then(_.bind(function(){
                this.render();
            }, this));
            //PageBase.prototype.initialize.apply(this, arguments);
        },
        render: function(){
            var group = this.getGroup();
            document.title = "Concord - "+group.get("name");
            PageBase.prototype.render.apply(this, arguments);
            var groupNav = new GroupNav({
                group: group,
            });
        },
    });

    return GroupHome;
});
