define([
    "views/widgets/Nav",
    "backbone",
    "underscore",
    "jquery",
    "text!views/templates/nav.html",
], function(
    Nav,
    Backbone,
    _,
    $,
    templateText,
){
    var GroupNav = Nav.extend({
        el: '#group-nav',
        getGroup: function(){
            //group should always be provided to nav
            return this.group;
        },
        getPages: function(){
            var group = this.getGroup();
            var urlPrefix = "/group/"+group.get("url_name");

            var pages = [
                {title:"Schedule", href: urlPrefix+"/schedule/"},
                {title:"Events", href: urlPrefix+"/events/"},
                {title:"Members", href: urlPrefix+"/members/"},
            ];

            if( group.hasPermission("invite") ){
                pages.push({title: "Invites", href: urlPrefix+"/invites/"})
            }
            if( group.hasPermission("edit") ){
                pages.push({title: "Edit Group", className:"position-right", href: "/edit/group/"+group.get("id")+"/"})
            }

            return pages;
        },
        getContext: function(){
            var group = this.getGroup();
            return {
                group: group,
                pages: this.getPages(),
                brand: '<a class="navbar-brand">'+group.get("url_name")+"</a>",
            }

        },
    });

    return GroupNav;
});
