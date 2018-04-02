define([
    "views/pages/PageBase",
    "views/widgets/Button",
    "views/widgets/TextArea",
    "views/widgets/GroupNav",
    "models/Group",
    "backbone",
    "underscore",
    "showdown",
    "text!views/templates/schedule.html",
], function(
    PageBase,
    Button,
    TextArea,
    GroupNav,
    Group,
    Backbone,
    _,
    showdown,
    templateText,
){
    var GroupSchedule = PageBase.extend({
        template: _.template(templateText),
        getGroup: function(options){
            if(this.instance){
                this._instance = this.instance;
                delete this.instance;
            }
            if(!this._instance){
                this._instance = new Group({id: this.group_id});
                if(this.group_id){
                    this._instance.fetch(options);
                }
            }
            return this._instance;
        },
        initialize: function(){
            var self = this;
            // this._createComponent("textArea", _.bind(function(){
            //     var textArea = new TextArea({
            //         className: "",
            //         name: "home_page_markdown",
            //         instance: this.getGroup(),
            //     });
            //     return textArea;
            // }, this));
            var group = this.getGroup();
            $.when(group.dataDeferred).then(_.bind(function(){
                this.render();
            }, this));
        },
        getContext: function(){
            return {
                title: this.getGroup().get("name")+" Schedule",
                group: this.getGroup(),
                homeHTML: this.getHomeHTML(),
            }
        },
        render: function(){
            var group = this.getGroup();
            document.title = "Concord - "+group.get("name");
            PageBase.prototype.render.apply(this, arguments);
        },
    });

    return GroupSchedule;
});
