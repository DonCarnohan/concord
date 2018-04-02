define([
    "models/ModelBase",
    "models/validators",
    "backbone",
], function(
    ModelBase,
    validators,
    Backbone,
){
    var Group = ModelBase.extend({
        urlRoot: '/api/groups/',
        title: 'Group',
        defaults: {
            id: null,
            name: "",
            url_name: "",
            discord_server_identifier: "",
            discord_channel_identifier: "",
            permissions: {},
        },

        schema: [
            {name:'name', type: 'Text', label: "Group Name", editorOptions: {autocomplete: "off"}, validators:[validators.NotBlankValidator]},
            {name:'url_name', type: 'Text', label: "Group Abbreviation", validators:[validators.NotBlankValidator]},
            {name:'discord_server_identifier', type:'Text', label: "Discord Server ID", validators:[validators.NumberValidator]},
            {name:'discord_channel_identifier', type:'Text', label: "Discord Channel ID", validators:[validators.NumberValidator]},
            {name:'description', type:'TextArea', label: "Short Description"},
            {name:'permissions', type: 'TextArea', label: "Permissions"},
        ],

        initialize: function(){
            ModelBase.prototype.initialize.apply(this, arguments);

        },

    });

    return Group;
});
