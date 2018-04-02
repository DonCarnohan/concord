define([
    "backbone",
], function(
    CollectionBase,
    Backbone,
){
    var validators = {
        NumberValidator: {
            pattern:/^(\d+)?$/,
            error: "Must be all numbers.",
        },
        NotBlankValidator: {
            pattern:/^.+$/,
            error: "This field may not be blank.",
        },
        MaxLengthValidator: function(maxLength){
            return {
                validate: function(value){
                    return value.length <= maxLength;
                },
                error: "This field may not be blank.",
            };
        },
    };

    return validators;
});
