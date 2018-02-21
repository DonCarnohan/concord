define([
    "views/ViewBase",
    "views/widgets/FilterGroup",
    "backbone",
    "underscore",
    "text!views/templates/list.html",
    "text!views/templates/list-item.html",
], function(
    ViewBase,
    FilterGroup,
    Backbone,
    _,
    listTemplateText,
){
    var List = ViewBase.extend({
        size: null,
        filters: null,
        _filterGroups: null,
        template: _.template(listTemplateText),
        listItemTemplate: _.template(listItemTemplateText),
        initialize: function(){
            ViewBase.prototype.initialize.apply(this, arguments);
            this._filterGroups = {};

        },
        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
            filterContainer = this.$el.find(".filter-container");
            _.each(this.filters, function(filter){
                if(!this._filterGroups[filter.field]){
                    this._filterGroups[filter.field] = new FilterGroup({
                        title: filter.title,
                        options: filter.options,
                    });
                }
            }, this);
            filterContainer.append()
        }
    });

    return List;
});
