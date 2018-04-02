define([
    "views/pages/PageBase",
    "views/widgets/Button",
    "views/widgets/TextArea",
    "views/widgets/GroupNav",
    "models/Group",
    "backbone",
    "underscore",
    "showdown",
    "text!views/templates/group-home.html",
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
        getHomeHTML: function(){
            var converter = new showdown.Converter();
            var homeFragment = $(converter.makeHtml(this.getGroup().get("home_page_markdown")));
            homeFragment.find("a[href^='javascript']").remove();
            homeFragment.find("script").remove();
            homeFragment.find("style").remove();
            homeFragment.find("*").removeAttr("style");
            return homeFragment;
        },
        initialize: function(){
            var self = this;
            this._createComponent("textArea", _.bind(function(){
                var textArea = new TextArea({
                    className: "",
                    name: "home_page_markdown",
                    instance: this.getGroup(),
                });
                return textArea;
            }, this));
            this._createComponent("saveButton", _.bind(function(){
                var button = new Button({
                    text: "Save",
                    style: "success",
                    className: "btn save-button",
                });
                button.$el.on("click", _.bind(function(){
                    this.postForm();
                }, this));
                return button;
            }, this));
            var group = this.getGroup();
            $.when(group.dataDeferred).then(_.bind(function(){
                this.render();
            }, this));
            //PageBase.prototype.initialize.apply(this, arguments);
        },
        getContext: function(){
            return {
                group: this.getGroup(),
                homeHTML: this.getHomeHTML(),
            }
        },
        render: function(){
            var group = this.getGroup();
            document.title = "Concord - "+group.get("name");
            PageBase.prototype.render.apply(this, arguments);
            var groupNav = new GroupNav({
                group: group,
            });
            this.renderBody();
            var bodyContainer = this.$el.find(".body-container");
            var editorContainer = this.$el.find(".editor-container");
            var textArea = this.getTextArea();
            editorContainer.append(textArea.$el);
            editorContainer.append(this.getSaveButton().$el);
            var editButton = this.$el.find("#edit-button");
            editButton.on("click", _.bind(function(){
                if(bodyContainer.hasClass("hidden")){
                    //Ask for confirmation
                    if(confirm("Changes have not been saved, are you sure you want to discard changes?")){
                        bodyContainer.removeClass("hidden");
                        editorContainer.addClass("hidden");
                        editButton.html("Edit Body");
                    }
                } else {
                    bodyContainer.addClass("hidden");
                    editorContainer.removeClass("hidden");
                    textArea.setValue(group.get(textArea.name));
                    editButton.html("Cancel");
                }
            }, this));
        },
        renderBody: function(){
            this.$el.find(".body-container").html(this.getHomeHTML());
        },
        postForm: function(){
            var group = this.getGroup();
            if(group.isValid()){
                var deferred = group.save({home_page_markdown: group.get("home_page_markdown")}, {patch: true});
                deferred.then(_.bind(function(){
                    //Success
                    this.renderBody();
                    this.$el.find(".body-container").removeClass("hidden");
                    this.$el.find(".editor-container").addClass("hidden");
                    this.$el.find("#edit-button").html("Edit Body");
                }, this), _.bind(function(jqXHR){
                    //Error
                    
                }, this));
            }
        },
    });

    return GroupHome;
});
