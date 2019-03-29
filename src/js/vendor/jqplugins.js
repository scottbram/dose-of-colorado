/** Get URL query string parameter */
$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                      .exec(window.location.search);

    var valueBeginsIdx = results[1].indexOf('=');

    return (results !== null) ? results[1].substr(valueBeginsIdx, results[1].length) || 0 : false;
}
