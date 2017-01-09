(function ($) {
    $.ajaxSetup({ // Add token in header
        beforeSend: function (request) {
            var token = localStorage.getItem('jwtToken');
            request.setRequestHeader('x-auth', token);
        },
        cache: false
    });

    function getAllEvents() { // get all events
        $.ajax({
            url: '/events',
            type: 'get',
            success: function (data) {
                console.log(data);
            }
        });
}

    getAllEvents();

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
            url: form.action,
            type: form.method,
            data: $.formDataSerializer($('#event_form')),
            success: function (data) {
                if (data.success) {
                    bootbox.alert("You have added event succesfully");
                    form.reset();
                    getAllEvents();
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
} (jQuery));