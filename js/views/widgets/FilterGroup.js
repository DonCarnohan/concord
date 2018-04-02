define([
    "views/ViewBase",
    "backbone",
    "underscore",
    "jquery",
    "text!views/templates/filter-group.html",
], function(
    ViewBase,
    Backbone,
    _,
    $,
    templateText,
){
    var FilterGroup = ViewBase.extend({
        size: null,
        template: _.template(templateText),
        getContext: function(){
            return {
                title: this.title,
                options: this.options,
            };
        },
        render: function(){
            var self = this;
            ViewBase.prototype.render.apply(this, arguments);
            this.$el.on("click", function(evt){
                self.$el.find("a").removeClass("strong");
                var target = null;
                if(evt.target.tagName == "LI"){
                    target = $(evt.target).find("a")[0];
                } else if(evt.target.tagName == "A"){
                    target = evt.target;
                }
                $(target).addClass("strong");

                var value = $(target).attr("data-value");
                self.trigger("change", {value: value});
            });
        }
    });

    return FilterGroup;
});
