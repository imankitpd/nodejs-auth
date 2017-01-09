(function ($) {
    $.ajaxSetup({
        contentType: 'application/json; charset=utf-8',
        cache: false
    });
    $.formDataSerializer = function ($form, mergeJson) {
        var formData = {}, key;
        $form.serializeArray().map(function (item) {
            if (formData[item.name]) {
                if (typeof (formData[item.name]) === 'string') {
                    formData[item.name] = [formData[item.name]];
                }
                formData[item.name].push(item.value);
            } else {
                formData[item.name] = item.value;
            }
        });
        if (mergeJson) {
            for (key in mergeJson) {
                formData[key] = mergeJson[key];
            }
        }
        return JSON.stringify(formData);
    };
})(jQuery);