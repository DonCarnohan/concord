define([
    "models/ModelBase",
    "backbone",
], function(
    ModelBase,
    Backbone,
){
    var Group = ModelBase.extend({
        defaults: {
            id: null,
            name: "",
            url_name: "",
            discord_server_identifier: "",
            discord_channel_identifier: "",
            permissions: "{}"
        },

        schema: [
            {name:'name', type: 'Text', label: "Group Name"},
            {name:'url_name', type: 'Text', label: "Group Abbreviation"},
            {name:'discord_server_identifier', type:'Text', label: "Discord Server ID", validators:[/\d+/]},
            {name:'discord_channel_identifier', type:'Text', label: "Discord Channel ID", validators:[/\d+/]},
            {name:'description', type:'TextArea', label: "Short Description", validators:[/\d+/]},
            {name:'permissions', type: 'TextArea', label: "Permissions"},
        ],

        initialize: function(){
            ModelBase.prototype.initialize.apply(this, arguments);
        },

    });

    return Group;
});
