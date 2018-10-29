define([
    "views/ViewBase",
    "backbone",
    "underscore",
    "select2",
], function(
    ViewBase,
    Backbone,
    _,
    select2,
){
    var ModelChoice = ViewBase.extend({
        tagName: "div",
        className: "input-group",
        name: null,
        options: {
            
        },
        collectionType: null,
        descriptionProperty: 'description',
        idProperty: 'id',
        placeholder: 'Select an option',
        // events: {
        //     "change": "setInstanceValue",
        // },
        setInstanceValue: function(){
            if(this.instance){
                this.instance.set(this.name, this.$el.find('select').val());
            }
        },
        isFieldValid: function(){
            return true;
        },
        setValue: function(value){
            this.value = value;
            this.$el.find('input').val(value);
        },
        initialize: function(){

            this._createComponent("collection", _.bind(function(){
                if(this.collectionType){
                    var collection = new this.collectionType();
                    collection.fetch();
                    return collection;
                }
                return null;
            }, this));

            this._createComponent("choices", _.bind(function(){
                var choices = [{id: '', text: this.placeholder}];
                var collection = this.getCollection();
                if(collection){
                    collection.each(_.bind(function(item){
                        choices.push({
                            id: item.get(this.idProperty),
                            text: item.get(this.descriptionProperty),
                        });
                    },this));
                }
                return choices;
            }, this));
            $.when(this.getCollection().dataDeferred).then(_.bind(function(){
                ViewBase.prototype.initialize.apply(this, arguments);
            }, this));
        },
        render: function(){
            ViewBase.prototype.render.apply(this, arguments);
            this.inputEl = $('<select>');
            this.$el.append(this.inputEl);
            this.inputEl.addClass(this.sizeClass);
            if(this.instance){
                this.inputEl.val(this.instance.get(this.name));
            }
            this.inputEl.select2(_.extend({
                data: this.getChoices(),
                placeholder: this.placeholder,
            }, this.options));
            this.inputEl.on("change", _.bind(this.setInstanceValue, this));
        }
    });

    return ModelChoice;
});
