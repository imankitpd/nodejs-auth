(function ($) {
    $.validator.addMethod("pwcheck", function (value) {
        return /^[A-Za-z0-9\d=!\-@._#*]*$/.test(value) // consists of only these
            && /[a-z]/.test(value) // has a lowercase letter
            && /\d/.test(value) // has a digit
    });

    $.ajaxSetup({ // Add token in header
        beforeSend: function (request) {
            var token = localStorage.getItem('jwtToken');
            request.setRequestHeader('x-auth', token);
        },
        cache: false
    });

    $.ajax({
        url: "/users/me",
        success: function (data) {
            $("#welcome_user").text(data.first_name + " " + data.last_name);
            $("#actions_form").show();
            $(".logout").show().find(">a").click(function(e) {
                e.preventDefault();
                localStorage.clear();
                window.location.href="/";
            });
        }, error: function (jqXHR) {
            if(jqXHR.status === 401) {
                $("#login_logout_forms").show();
            } else {
                bootbox.alert("Some system error occured");
            }
        }
    })

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
                        window.location.href="/";
                    } else {
                        bootbox.alert("Username or password is not valid");
                    }
                },
                error: function (jqXHR) {
                    bootbox.alert(jqXHR.responseJSON.errmsg);
                }
            })
        }
    });

    // event management form
    var eventId = null;
    var resetForm = function () {
        $('#text_title').text('Add Event');
        $('#event_form')[0].reset();
        eventId = null;
    };

    function getAllEvents() { // get all events
        $.ajax({
            url: '/events',
            type: 'get',
            success: function (data) {
                var ol = $('<ol></ol>').addClass('event-ol');

                if (data.events.length === 0) {
                    $('<div></div>').addClass('alert alert-info').text('No event exist.').appendTo($('#events_list').empty());
                } else {
                    for (var i = 0; i < data.events.length; i++) {

                        // Delete Button
                        var delBtn = $('<a></a>')
                            .attr('href', '#')
                            .data('_id', data.events[i]._id)
                            .addClass('pull-right')
                            .click(function (e) {
                                e.preventDefault();
                                var $this = $(this);
                                bootbox.confirm("Are you sure you want to delete this event?", function (result) {
                                    if (result) {
                                        $.ajax({
                                            url: '/events/' + $this.data('_id'),
                                            type: 'delete',
                                            success: function (data) {
                                                if (data.success) {
                                                    bootbox.alert('You have deleted the event successfully');
                                                    getAllEvents();
                                                    resetForm();
                                                }
                                            }
                                        })
                                    }
                                });
                            });

                        $('<span></span>').addClass("glyphicon glyphicon-remove").appendTo(delBtn);

                        // Edit Button
                        var editBtn = $('<a></a>')
                            .attr('href', '#')
                            .data('_id', data.events[i]._id)
                            .addClass('pull-right')
                            .click(function (e) {
                                e.preventDefault();
                                var $this = $(this);
                                $.ajax({
                                    url: '/events/' + $this.data('_id'),
                                    type: 'get',
                                    success: function (data) {
                                        eventId = data.event._id;
                                        $('#text_title').text('Edit Event');
                                        $("input[name='text']").val(data.event.text);
                                    }
                                })
                            });

                         $('<span></span>').addClass("glyphicon glyphicon-pencil").appendTo(editBtn);   

                        var li = $('<li></li>');
                        $('<span></span>').text(data.events[i].text).appendTo(li);
                        delBtn.appendTo(li);
                        editBtn.appendTo(li);
                        li.appendTo(ol);
                    }
                    ol.appendTo($('#events_list').empty());
                }
            }
        });
    }

    getAllEvents();

    // Add and Edit form
    $("#event_form").validate({
        rules: {
            text: {
                required: true
            }
        },
        messages: {
            text: {
                required: "Event name is required."
            }
        },
        submitHandler: function (form) {
            $.ajax({
                url: form.action + (eventId && eventId || ""), // (eventId ? eventId : '')
                type: eventId && 'patch' || form.method,  // (eventId ? 'patch' : post)
                data: $.formDataSerializer($('#event_form')),
                success: function (data) {
                    if (data.success) {
                        bootbox.alert("You have saved event succesfully");
                        getAllEvents();
                        resetForm();                        
                    } else {
                        bootbox.alert("Some error occured. Please contact your administrator.");
                    }
                },
                error: function (jqXHR) {
                    bootbox.alert(jqXHR.responseJSON.errmsg);
                }
            });
        }
    });
})(jQuery);