'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JsonObj = function () {
    function JsonObj() {
        _classCallCheck(this, JsonObj);
    }

    _createClass(JsonObj, [{
        key: "jsonData",
        get: function get() {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.open("GET", "src/data.json");
                request.onload = function () {
                    if (request.status === 200) {
                        var json = JSON.parse(request.response);
                        resolve(json.students);
                    } else {
                        reject(request.statusText);
                    }
                };

                request.onerror = function (error) {
                    reject(error);
                };
                request.send();
            });
        },
        set: function set(newData) {}
    }]);

    return JsonObj;
}();

var jsonStudents = new JsonObj();
console.log(jsonStudents.jsonData);

jsonData.then(function (students) {
    students.forEach(function (student) {
        tableExemplar.fillTableRowsProperty(student);
    });
}).catch(function (error) {
    return console.error(error);
});