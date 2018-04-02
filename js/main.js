var require = {
    baseUrl: '/static/js',
    shim: {
        'jquery': {
            exports: "$",
        },
        'underscore': {
            exports: "_",
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone',
        },
        'bootstrap': {
            deps: ['jquery'],
        },
    },
    paths: {
        jquery: '../lib/jquery-3.2.1.min',
        backbone: '../lib/backbone',//-min',
        backboneForm: '../lib/backbone-forms.min',
        underscore: '../lib/underscore-min',
        showdown: '../lib/showdown.min',
        moment: '../lib/moment.min',
        bootstrap: '../lib/bootstrap/js/bootstrap.min',
        datetimepicker: '../lib/bootstrap-datetimepicker.min',
        text: '../lib/text',
    }
};
