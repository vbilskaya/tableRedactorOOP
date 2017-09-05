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
            var request = new XMLHttpRequest();
            request.open("GET", "src/data.json", false);
            request.send(null);
            var data = JSON.parse(request.responseText);
            return data;
        }
    }]);

    return JsonObj;
}();

var Table = function () {
    function Table() {
        _classCallCheck(this, Table);

        this.currentRow = 0;
        this.tableRows = [];
        this.rowsCount = 0;
        this.editableCell = 0;
        this.lastRowIndex = 0;
    }

    _createClass(Table, [{
        key: "createTable",
        value: function createTable() {
            //создание элемента div для дальнейшего заполнения строками
            var table = document.createElement('div');
            table.classList.add('table_students');
            document.body.appendChild(table);
        }
    }, {
        key: "renderTableHeadRow",
        value: function renderTableHeadRow() {
            var headers = ['№', 'ID', 'Name', 'Surname', 'Physics', 'Math', 'Russian'];
            var table = document.querySelector('.table_students');
            var row = document.createElement('div');
            row.classList.add('table_students__row');
            var columnDataType = ['number'];
            for (var key in this.tableRows[0]) {
                columnDataType.push(key);
            }

            for (var i = 0; i < headers.length; i++) {

                var cell = document.createElement('div');
                cell.classList.add('row__data');
                cell.classList.add('column-header');
                cell.classList.add(columnDataType[i]);
                cell.innerHTML = headers[i];
                row.appendChild(cell);
            }

            table.appendChild(row);
        }
    }, {
        key: "createRow",
        value: function createRow(element) {
            var row = document.createElement('div');
            row.classList.add('table_students__row');

            var rowNum = document.createElement('div');
            rowNum.classList.add('row-number');
            rowNum.classList.add('row__data');
            row.appendChild(rowNum);

            var studentKeys = Object.keys(element);

            for (var i = 0; i < studentKeys.length; i++) {
                var td = document.createElement('div');
                td.classList.add(studentKeys[i]);
                td.classList.add('row__data');
                td.setAttribute('tabindex', '1');

                if (!td.classList.contains('id')) {
                    td.setAttribute('contenteditable', 'true');
                }
                row.appendChild(td);
            }

            this.currentRow = row;

            return row;
        }
    }, {
        key: "fillRowContent",
        value: function fillRowContent(data) {

            var row = this.currentRow;

            var cells = row.childNodes;
            var dataKeys = Object.keys(data);

            row.id = data[dataKeys[0]];
            row.classList.add('row');

            for (var i = 1; i < cells.length; i++) {

                for (var j = 0; j < dataKeys.length; j++) {

                    if (dataKeys[j] === cells[i].classList[0]) {
                        cells[i].innerHTML = data[dataKeys[j]];
                    }
                }
            }
        }
    }, {
        key: "fillId",
        value: function fillId() {

            var row = this.currentRow;
            row.id = tableExemplar.lastRowIndex + 1;
            row.classList.add('row');

            row.firstElementChild.nextElementSibling.innerHTML = tableExemplar.lastRowIndex + 1;
        }
    }, {
        key: "fillTableNumeration",
        value: function fillTableNumeration() {
            this.currentRow = document.querySelector('.row');

            for (var i = 1; i <= this.rowsCount; i++) {
                this.currentRow.firstChild.innerHTML = i;
                this.currentRow = this.currentRow.nextElementSibling;
            }
        }
    }, {
        key: "fillTableRowsProperty",
        value: function fillTableRowsProperty(student) {
            var arr = [];
            arr.push(student);
            this.tableRows = this.tableRows.concat(arr);
            this.rowsCount++;
        }
    }, {
        key: "makeCellEditable",
        value: function makeCellEditable(target) {
            this.editableCell = target;
            this.editableCell.setAttribute('contenteditable', 'true');
            this.editableCell.focus();
            target.addEventListener('blur', onCellBlurSaveChanges);
        }
    }, {
        key: "makeDataClone",
        value: function makeDataClone() {
            var clone = {};
            for (var key in this.tableRows[0]) {
                clone[key] = this.tableRows[0][key];
            }
            for (var _key in clone) {
                clone[_key] = '';
            }
            clone['id'] = this.lastRowIndex + 1;
            return clone;
        }
    }, {
        key: "sortData",
        value: function sortData(sortColumn, dataType) {
            var column = [];
            for (var i = 0; i < this.tableRows.length; i++) {
                var dataValue = this.tableRows[i][sortColumn];
                var id = this.tableRows[i]['id'];
                var student = [id, dataValue];
                column.push(student);
            }

            if (dataType === 'numeric') {

                column.sort(this.compareNumeric.bind(this));
            } else {

                column.sort(this.compareString.bind(this));
            }
            this.fillTableNumeration();
        }
    }, {
        key: "compareNumeric",
        value: function compareNumeric(a, b) {
            var result = void 0;
            if (+a[1] > +b[1]) result = 1;else if (+a[1] < +b[1]) result = -1;else result = 0;
            if (result > 0) {
                this.swap(a[0], b[0]);
            }
            return result;
        }
    }, {
        key: "compareString",
        value: function compareString(a, b) {
            var result = void 0;
            if (a[1] > b[1]) result = 1;else if (a[1] < b[1]) result = -1;else result = 0;
            if (result > 0) {
                this.swap(a[0], b[0]);
            }
            return result;
        }
    }, {
        key: "swap",
        value: function swap(id1, id2) {
            var table = document.querySelector('.table_students');
            for (var i = 0; i < this.tableRows.length; i++) {
                if (this.tableRows[i]['id'] === id1) {
                    //меняем местами элементы массива
                    var elem1 = this.tableRows[i];
                    var elem2 = this.tableRows[i + 1];
                    this.tableRows[i] = elem2;
                    this.tableRows[i + 1] = elem1;
                    //меняем местами строки
                    var row1 = document.getElementById(id1);
                    var row2 = document.getElementById(id2);
                    table.insertBefore(row2, row1);
                    return;
                }
            }
        }
    }, {
        key: "checkData",
        value: function checkData(type, value) {

            if (type === 'string') {
                var arrChars = value.split('');
                for (var i = 0; i < arrChars.length; i++) {
                    if (value.charCodeAt(i) < 65) {
                        return false;
                    }
                }
            } else if (type === 'numeric') {
                if (isNaN(value)) {
                    return false;
                }
            }
            return true;
        }
    }]);

    return Table;
}();

var Button = function () {
    function Button(name, eventListener) {
        _classCallCheck(this, Button);

        this.name = name;
        this.eventListener = eventListener;
    }

    _createClass(Button, [{
        key: "createButton",
        value: function createButton() {
            var button = document.createElement('button');
            button.setAttribute('id', this.name);
            button.innerHTML = this.name;
            document.body.appendChild(button);
            button.addEventListener('click', this.eventListener);
        }
    }]);

    return Button;
}();

var jsonStudents = new JsonObj();
var jsonData = jsonStudents.jsonData;
var tableExemplar = new Table();

//заполнили свойство tableRows экземпляра таблицы
jsonData.students.forEach(function (student) {
    tableExemplar.fillTableRowsProperty(student);
});

//создание и заполнение таблицы из данных json
tableExemplar.createTable();
tableExemplar.renderTableHeadRow();

tableExemplar.tableRows.forEach(function (elem) {
    var table = document.querySelector('.table_students');
    table.appendChild(tableExemplar.createRow(elem));
    tableExemplar.fillRowContent(elem);
    tableExemplar.lastRowIndex = elem['id'];
    table.addEventListener('click', onTableClick);
});

tableExemplar.fillTableNumeration();
//создание кнопок
var addButton = new Button('add', onAddButtonClick);
addButton.createButton();

var removeButton = new Button('remove', onRemoveButtonClick);
removeButton.createButton();

var saveButton = new Button('save', onSaveButtonClick);
saveButton.createButton();

//обработчики событий
function onAddButtonClick() {

    var table = document.querySelector('.table_students');

    if (tableExemplar.currentRow === null) {
        var clone = tableExemplar.makeDataClone();
        var newRow = tableExemplar.createRow(clone); //
        tableExemplar.tableRows.push(clone);
        table.appendChild(newRow);
        tableExemplar.fillId();
    } else {
        var id = tableExemplar.currentRow.id;
        for (var i = 0; i < tableExemplar.tableRows.length; i++) {
            if (id == tableExemplar.tableRows[i]['id']) {
                var _clone = tableExemplar.makeDataClone();
                var _newRow = tableExemplar.createRow(_clone);
                tableExemplar.tableRows.splice(i, 0, _clone);
                table.insertBefore(_newRow, document.getElementById(id));
                tableExemplar.fillId();
                tableExemplar.rowsCount++;
                tableExemplar.lastRowIndex++;
                tableExemplar.fillTableNumeration();
                tableExemplar.currentRow = document.getElementById(id);
                return;
            }
        }
    }

    tableExemplar.rowsCount++;
    tableExemplar.lastRowIndex++;

    tableExemplar.fillTableNumeration();
}

function onRemoveButtonClick() {

    var confirmToDelete = confirm('Вы уверены что хотите удалить эту строку?');
    if (!confirmToDelete) {
        return;
    }

    var table = document.querySelector('.table_students');

    if (tableExemplar.currentRow === null) {
        table.removeChild(table.lastElementChild);
        tableExemplar.tableRows.pop();
    } else {
        var id = tableExemplar.currentRow.id;
        for (var i = 0; i < tableExemplar.tableRows.length; i++) {
            if (id == tableExemplar.tableRows[i]['id']) {
                table.removeChild(tableExemplar.currentRow);
                tableExemplar.tableRows.splice(i, 1);
            }
        }
    }

    tableExemplar.rowsCount--;

    tableExemplar.fillTableNumeration();
}

function onSaveButtonClick() {
    var newTableData = { students: [] };
    newTableData.students = tableExemplar.tableRows;
    var newJson = JSON.stringify(newTableData);
    console.log(newJson);
}

function onCellBlurSaveChanges(event) {

    var target = event.target;
    var newValue = target.innerHTML;
    var prop = target.classList[0];
    var id = target.parentNode.id;

    for (var i = 0; i < tableExemplar.tableRows.length; i++) {
        if (tableExemplar.tableRows[i]['id'] == id) {
            tableExemplar.tableRows[i][prop] = newValue;
        }
    }
}

function onCellBlurCheckData(event) {
    var dataType = event.target.classList[0];
    var target = event.target;
    var newValue = target.innerHTML;
    var result = void 0;

    switch (dataType) {
        case 'name':
        case 'surname':
            result = tableExemplar.checkData('string', newValue);
            if (!result) alert("В это поле необходимо ввести строковое значение.");
            break;

        default:
            result = tableExemplar.checkData('numeric', newValue);
            if (!result) alert("В это поле необходимо ввести числовое значение.");
            break;

    }
}

function onTableClick(event) {

    var target = event.target;
    var table = document.querySelector('.table_students');

    while (target != table) {

        if (target.classList.contains('column-header')) {
            target.addEventListener('click', onColumnHeaderClick);
        }

        if (target.classList.contains('row__data') && !target.classList.contains('id') && !target.classList.contains('row-number') && !target.classList.contains('column-header')) {
            target.addEventListener('blur', onCellBlurCheckData);
            target.addEventListener('blur', onCellBlurSaveChanges);
        }
        if (target.classList.contains('row')) {
            if (tableExemplar.currentRow === null) {
                tableExemplar.currentRow = target;
                tableExemplar.currentRow.classList.add('current_row');
            } else {
                tableExemplar.currentRow.classList.remove('current_row');
                tableExemplar.currentRow = target;
                tableExemplar.currentRow.classList.add('current_row');
            }
        }

        target = target.parentNode;
    }
}

function onColumnHeaderClick(event) {
    var sortColumn = event.target.classList[2];
    switch (sortColumn) {
        case 'name':
        case 'surname':
            tableExemplar.sortData(sortColumn, 'string');
            break;

        default:
            tableExemplar.sortData(sortColumn, 'numeric');
            break;

    }
}