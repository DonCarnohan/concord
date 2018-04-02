define([
    "views/pages/PageBase",
    "views/widgets/Button",
    "backbone",
    "underscore",
    "text!views/templates/login.html",
], function(
    PageBase,
    Button,
    Backbone,
    _,
    templateText,
){
    var Login = PageBase.extend({
        template: _.template(templateText),
        mode: "login",
        validateEmail: function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },
        initialize: function(){
            var self = this;
            this._createComponent("loginButton", function(){
                var button = new Button({
                    text: "Login",
                    style: "primary",
                    className: "btn login-button",
                });
                button.$el.on("click", function(){
                    self.postInfo();
                });
                return button;
            });
            this._createComponent("toggleButton", function(){
                var button = new Button({
                    text: "or Register",
                    style: "muted",
                    className: "btn toggle-button pull-right",
                });
                button.$el.on("click", function(){
                    //do things
                    var registerButtonContainer = self.$el.find(".register-button-container");
                    var loginButtonContainer = self.$el.find(".login-button-container");
                    var registerContainer = self.$el.find(".register-container");
                    if(self.mode == "login"){
                        self.mode = "register";
                        button.text = "or Login";
                        button.render();
                        self.$el.find("#password2").val("");
                        registerButtonContainer.append(button.$el);
                        loginButtonContainer.addClass("hidden");
                        registerContainer.removeClass("hidden");
                    } else {
                        self.mode = "login";
                        button.text = "or Register";
                        button.render();
                        loginButtonContainer.append(button.$el);
                        loginButtonContainer.removeClass("hidden");
                        registerContainer.addClass("hidden");
                    }
                });
                return button;
            });
            this._createComponent("registerButton", function(){
                var button = new Button({
                    text: "Register",
                    style: "success",
                });
                button.$el.on("click", function(){
                    self.postInfo();
                });
                return button;
            });
            PageBase.prototype.initialize.apply(this, arguments);
        },
        postInfo: function(){
            var loginErrorMessage = this.$el.find("#login-error-message");
            var email = this.$el.find("#email");
            var password = this.$el.find("#password");
            var password2 = this.$el.find("#password2");
            email.parent().removeClass("has-error");
            password.parent().removeClass("has-error");
            password2.parent().removeClass("has-error");
            var emailRE = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if(!email.val() || !this.validateEmail(email.val())){
                loginErrorMessage.removeClass("hidden");
                loginErrorMessage.html("Enter a valid email.");
                email.parent().addClass("has-error");
            } else if(!password.val()){
                loginErrorMessage.removeClass("hidden");
                loginErrorMessage.html("Enter a valid password.");
                password.parent().addClass("has-error");

            } else if(password.val().length < 8){
                loginErrorMessage.removeClass("hidden");
                loginErrorMessage.html("Password must be at least 8 characters long.");
                password.parent().addClass("has-error");

            } else if(!password2.val() && this.mode == "register"){
                loginErrorMessage.removeClass("hidden");
                loginErrorMessage.html("The 2 passwords must match.");
                password2.parent().addClass("has-error");

            } else if(password.val() != password2.val() && this.mode == "register"){
                loginErrorMessage.removeClass("hidden");
                loginErrorMessage.html("The 2 passwords must match.");
                password.parent().addClass("has-error");
                password2.parent().addClass("has-error");
            } else {
                loginErrorMessage.addClass("hidden");
                $.ajax({
                    url: "/login/",
                    data: {
                        email: email.val(),
                        password: password.val(),
                        password2: password2.val(),
                    },
                    method: "POST",
                    success: function(data, status, xhr){
                        data = JSON.parse(data);
                        if(data.success){
                            window.location.href = "/";
                        } else {
                            loginErrorMessage.removeClass("hidden");
                            loginErrorMessage.html("");
                            for(var i = 0; i < data.errors.length; i++){
                                var newError = $("<div>");
                                newError.html(data.errors[i]);
                                loginErrorMessage.append(newError);
                            }
                        }
                    },
                    error: function(){
                        loginErrorMessage.removeClass("hidden");
                        loginErrorMessage.html("A server error occurred while logging in.");
                    },
                });
            }   
        },
        getContext: function(){
            return {
                error: this.error,
            }
        },
        render: function(){
            var self = this;
            PageBase.prototype.render.apply(this, arguments);
            var registerButtonContainer = this.$el.find(".register-button-container");
            var loginButtonContainer = this.$el.find(".login-button-container");
            registerButtonContainer.append(this.getRegisterButton().$el);
            loginButtonContainer.append(this.getLoginButton().$el);
            loginButtonContainer.append(this.getToggleButton().$el);

            this.$el.find("input").on("keyup", function(evt){
                if(evt.keyCode == 13){
                    self.postInfo();
                }
            });
        },
    });

    return Login;
});
