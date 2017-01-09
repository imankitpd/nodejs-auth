(function ($) {
    $.validator.addMethod("pwcheck", function (value) {
        return /^[A-Za-z0-9\d=!\-@._#*]*$/.test(value) // consists of only these
            && /[a-z]/.test(value) // has a lowercase letter
            && /\d/.test(value) // has a digit
    });

    $("#sign_up_form").validate({
        rules: {
            first_name: {
                required: true
            },
            last_name: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                pwcheck: true
            },
            confirm_password: {
                required: true,
                equalTo: "#id_password"
            },
        },
        messages: {
            first_name: {
                required: "First name is required."
            },
            last_name: {
                required: "Last name is required"
            },
            email: {
                required: "Email is required"
            },
            password: {
                required: "Password is required",
                pwcheck: "Password must consists alphanumerics and special characters"
            },
            confirm_password: {
                required: "Confirm password is required",
                equalTo: "Confirm password value must match password value"
            },
        },
        submitHandler: function (form) {
            $.ajax({
                url: form.action,
                type: form.method,
                data: $.formDataSerializer($('#sign_up_form')),
                success: function (data) {
                    if (data.success) {
                        bootbox.alert("You have successfully registered, please login with email and password!");
                        form.reset();
                        $("a[href='#sign_in']").click();
                    } else {
                        bootbox.alert("Some error occured. Please contact your administrator.");
                    }
                },
                error: function (jqXHR) {
                    bootbox.alert(jqXHR.responseJSON.errmsg);
                }
            })
        }
    })

    //for sign up
     $("#sign_in_form").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                pwcheck: true
            }
        },
        messages: {
            email: {
                required: "Email is required"
            },
            password: {
                required: "Password is required",
                pwcheck: "Password must consists alphanumerics and special characters"
            }
        },
        submitHandler: function (form) {
            $.ajax({
                url: form.action,
                type: form.method,
                data: $.formDataSerializer($('#sign_in_form')),
                success: function (data, textStatus, jqXHR) {
                    if (data.success) {
                        var token = jqXHR.getResponseHeader('x-auth');
                        localStorage.setItem("jwtToken", token);
                        window.location.href="/home";
                    } else {
                        bootbox.alert("Username or password is not valid");
                    }
                },
                error: function (jqXHR) {
                    bootbox.alert(jqXHR.responseJSON.errmsg);
                }
            })
        }
    })
})(jQuery);