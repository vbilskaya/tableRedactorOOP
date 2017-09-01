'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Table = function () {
    function Table(jsonData) {
        _classCallCheck(this, Table);

        this.rowsCount = rowsCount;
        this.currentRow = currentRow;
        this.tableRows = {};
    }

    _createClass(Table, [{
        key: 'transformJsonDataIntoTable',
        value: function transformJsonDataIntoTable() {}
    }, {
        key: 'createTable',
        value: function createTable() {//создание элемента div для дальнейшего заполнения строками

        }
    }, {
        key: 'renderTableRow',
        value: function renderTableRow() {}
    }, {
        key: 'renderTableHeadRow',
        value: function renderTableHeadRow() {}
    }, {
        key: 'deleteRow',
        value: function deleteRow() {}
    }, {
        key: 'fillTableRowsProperty',
        value: function createRow() {}
    }]);

    return Table;
}();