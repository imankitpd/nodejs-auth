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
                var ol = $('<ol></ol>').addClass('event-ol');

                if (data.events.length === 0) {
                    $('<div></div>').addClass('alert alert-info').text('No event exist.').appendTo($('#events_list').empty());
                } else {
                    for (var i = 0; i < data.events.length; i++) {
                    var delBtn = $('<a></a>')
                                    .attr('href', '#')
                                    .data('_id', data.events[i]._id)
                                    .addClass('pull-right')
                                    .text('Delete')
                                    .click(function(e) {
                                        e.preventDefault();
                                        var $this = $(this);
                                        bootbox.confirm("Are you sure you want to delete this event?", function(result){
                                            if (result) {
                                                $.ajax({
                                                    url: '/events/' + $this.data('_id'),
                                                    type: 'delete',
                                                    success: function (data) {
                                                        if (data.success) {
                                                            bootbox.alert('You have deleted the event successfully');
                                                            getAllEvents();
                                                        }
                                                    }
                                                })
                                            }
                                        });
                                    });

                    var editBtn = $('<a></a>')
                                    .attr('href', '#')
                                    .addClass('pull-right')
                                    .text('Edit')
                                    .click(function(e) {
                                        e.preventDefault();
                                    });

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
})(jQuery);