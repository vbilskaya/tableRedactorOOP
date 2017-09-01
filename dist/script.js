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
        },
        set: function set(newData) {}
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
    }

    _createClass(Table, [{
        key: "transformJsonDataIntoTable",
        value: function transformJsonDataIntoTable() {}
    }, {
        key: "createTable",
        value: function createTable() {
            //создание элемента div для дальнейшего заполнения строками
            var table = document.createElement('div');
            table.classList.add('table_students');
            document.body.appendChild(table);
            console.log('Создан контейнер для таблицы');
        }
    }, {
        key: "renderTableRow",
        value: function renderTableRow() {}
    }, {
        key: "renderTableHeadRow",
        value: function renderTableHeadRow() {
            var headers = ['№', 'ID', 'Name', 'Surname', 'Physics', 'Math', 'Russian'];
            var table = document.querySelector('.table_students');
            var row = document.createElement('div');
            row.classList.add('table_students__row');

            headers.forEach(function (elem) {
                var cell = document.createElement('div');
                cell.classList.add('row__data');
                cell.innerHTML = elem;
                row.appendChild(cell);
            });
            table.appendChild(row);
        }
    }, {
        key: "deleteRow",
        value: function deleteRow() {}
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
                var td = document.createElement('div'); //change to div
                td.classList.add(studentKeys[i]);
                td.classList.add('row__data');
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
            row.id = tableExemplar.rowsCount + 1;
            row.classList.add('row');

            row.firstElementChild.nextElementSibling.innerHTML = tableExemplar.rowsCount + 1;
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
            // console.log(student);
        }
    }, {
        key: "makeCellEditable",
        value: function makeCellEditable(target) {
            this.editableCell = target;
            this.editableCell.setAttribute('contenteditable', 'true');
            this.editableCell.focus();
        }
    }]);

    return Table;
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
    table.addEventListener('click', onTableClick);
});

tableExemplar.fillTableNumeration();

function createButton(name, eventListener) {
    var button = document.createElement('button');
    button.setAttribute('id', name);
    button.innerHTML = name;
    document.body.appendChild(button);
    button.addEventListener('click', eventListener);
}

createButton('add', onAddButtonClick);
createButton('remove', onRemoveButtonClick);
createButton('save', onSaveButtonClick);

function onAddButtonClick() {

    var table = document.querySelector('.table_students');

    if (tableExemplar.currentRow === null) {
        table.appendChild(tableExemplar.createRow(tableExemplar.tableRows[0]));
        tableExemplar.fillId();
    }

    tableExemplar.rowsCount++;

    tableExemplar.fillTableNumeration();
}

function onRemoveButtonClick() {
    var table = document.querySelector('.table_students');

    if (tableExemplar.currentRow === null) {
        table.removeChild(table.lastElementChild);
    }

    tableExemplar.rowsCount--;

    tableExemplar.fillTableNumeration();
}

function onSaveButtonClick() {}

function onTableClick(event) {

    var target = event.target;
    var table = document.querySelector('.table_students');

    while (target != table) {

        // if (target.classList.contains('table-header')) {
        //     onTableHeadClick(target);
        // }

        if (target.classList.contains('row__data') && !target.classList.contains('id') && !target.classList.contains('row-number')) {
            if (tableExemplar.editableCell === 0) {
                tableExemplar.makeCellEditable(target);
                return;
            } else {
                tableExemplar.editableCell.removeAttribute('contenteditable');
                tableExemplar.makeCellEditable(target);
            }
        }
        // if (target.classList.contains('row-number')) {
        //
        //     selectRow(target);
        //     return;
        // }

        target = target.parentNode;
    }
}

console.log(tableExemplar);
console.log(tableExemplar.tableRows);