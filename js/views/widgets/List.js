define([
    "views/ViewBase",
    "views/widgets/FilterGroup",
    "backbone",
    "underscore",
    "jquery",
    "text!views/templates/list.html",
    "text!views/templates/list-item.html",
    "text!views/templates/group-heading.html",
], function(
    ViewBase,
    FilterGroup,
    Backbone,
    _,
    $,
    listTemplateText,
    listItemTemplateText,
    groupHeadingTemplateText,
){
    var List = ViewBase.extend({
        size: null,
        data: null,
        collection: null,
        model: null,
        addButton: false,
        filters: null,
        _filterGroups: null,
        listItemContextMap: {},
        noResultsMessage: "There's nothing to show.",
        template: _.template(listTemplateText),
        listItemTemplate: _.template(listItemTemplateText),
        groupHeadingTemplate: _.template(groupHeadingTemplateText),
        groupBy: null,
        getGroupings: function(){
            var groupings = {};
            if(!this.groupBy){
                return null;
            } else if(this.collection){
                this.collection.each(function(item){
                    var value = null;
                    if(typeof(this.groupBy) == "function"){
                        value = this.groupBy(item);
                    } else {
                        value = item.get(this.groupBy);
                    }
                    if(!groupings[value]){
                        groupings[value] = [];
                    }
                    groupings[value].push(item);

                }, this);
            }
            return groupings;
        },
        initialize: function(){
            this._filterGroups = {};
            ViewBase.prototype.initialize.apply(this, arguments);
            if(this.collection){
                this.collection.on("add update sort sync", function(){
                    this._renderListTimeout = setTimeout(_.bind(function(){
                        this.renderList();
                    }, this), 200);
                }, this);
            }
        },
        getListItemContext: function(item){
            var context = {};
            return context;
        },
        renderListItem: function(item){
            var context = this.getListItemContext(item);
            for(var key in this.listItemContextMap){
                var key_list = this.listItemContextMap[key].split("__");
                context[key] = item;
                for(var subkey_index in key_list){
                    var subkey = key_list[subkey_index];
                    if(context[key].get){
                        context[key] = context[key].get(subkey);
                    } else {
                        context[key] = context[key][subkey];
                    }
                }
                if(context[key] == item){
                    context[key] = null;
                }
            }
            return this.listItemTemplate(context);
        },
        renderList: function(){
            var listContainer = this.$el.find(".list-container");
            listContainer.empty();
            if(this.data){
                _.each(this.data, function(listItem){
                    var renderedListItem = this.renderListItem(listItem);
                    listContainer.append(renderedListItem);
                }, this);
            } else if(this.collection){
                var groupings = this.getGroupings();
                if(groupings){
                    for(var grouping in groupings){
                        var heading = this.groupHeadingTemplate({title:grouping});
                        listContainer.append(heading);
                        _.each(groupings[grouping], _.bind(function(listItem){
                            var renderedListItem = this.renderListItem(listItem);
                            listContainer.append(renderedListItem);
                        }, this));
                    }
                } else {
                    this.collection.each(function(listItem){
                        var renderedListItem = this.renderListItem(listItem);
                        listContainer.append(renderedListItem);
                    }, this);
                }
            }
            if((!this.data || this.data.length == 0) && 
                (!this.collection || this.collection.length == 0)){
                var noResults = $("<h4> "+this.noResultsMessage+" </h4>")
                listContainer.append(noResults);
            }
        },
        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
            var filterContainer = this.$el.find(".filter-container");
            _.each(this.filters, function(filter){
                if(!this._filterGroups[filter.field]){
                    this._filterGroups[filter.field] = new FilterGroup({
                        title: filter.title,
                        options: filter.options,
                    });
                }
                filterContainer.append(this._filterGroups[filter.field].$el);
            }, this);
            //this.renderList();
            // if((this.data && this.data.length > 0) || (this.collection && this.collection.length > 0)){
            //     this.renderList();
            // }
        }
    });

    return List;
});
