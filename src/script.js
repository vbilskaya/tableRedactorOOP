'use strict';

class JsonObj {

    get jsonData() {
        let request = new XMLHttpRequest();
        request.open("GET", "src/data.json", false);
        request.send(null);
        let data = JSON.parse(request.responseText);
        return data;
    }

    set jsonData(newData) {

    }

}

class Table {

    constructor() {
        this.currentRow = 0;
        this.tableRows = [];
        this.rowsCount = 0;
        this.editableCell = 0;
        this.lastRowIndex = 0;
    }

    transformJsonDataIntoTable() {

    }

    createTable() {//создание элемента div для дальнейшего заполнения строками
        let table = document.createElement('div');
        table.classList.add('table_students');
        document.body.appendChild(table);
        console.log('Создан контейнер для таблицы');
    }

    renderTableRow() {

    }

    renderTableHeadRow() {
        let headers = ['№', 'ID', 'Name', 'Surname', 'Physics', 'Math', 'Russian'];
        let table = document.querySelector('.table_students');
        let row = document.createElement('div');
        row.classList.add('table_students__row');
        let columnDataType = ['number'];
        for (let key in this.tableRows[0]) {
            columnDataType.push(key);
        }


        for (let i = 0; i < headers.length; i++) {

            let cell = document.createElement('div');
            cell.classList.add('row__data');
            cell.classList.add('column-header');
            cell.classList.add(columnDataType[i]);
            cell.innerHTML = headers[i];
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    deleteRow() {

    }

    createRow(element) {
        let row = document.createElement('div');
        row.classList.add('table_students__row');

        let rowNum = document.createElement('div');
        rowNum.classList.add('row-number');
        rowNum.classList.add('row__data');
        row.appendChild(rowNum);

        let studentKeys = Object.keys(element);

        for (let i = 0; i < studentKeys.length; i++) {
            let td = document.createElement('div');
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

    fillRowContent(data) {

        let row = this.currentRow;

        let cells = row.childNodes;
        let dataKeys = Object.keys(data);

        row.id = data[dataKeys[0]];
        row.classList.add('row');

        for (let i = 1; i < cells.length; i++) {

            for (let j = 0; j < dataKeys.length; j++) {

                if (dataKeys[j] === cells[i].classList[0]) {
                    cells[i].innerHTML = data[dataKeys[j]];
                }
            }
        }
    }

    fillId() {

        let row = this.currentRow;
        row.id = tableExemplar.lastRowIndex + 1;
        row.classList.add('row');

        row.firstElementChild.nextElementSibling.innerHTML = tableExemplar.lastRowIndex + 1;
    }

    fillTableNumeration() {
        this.currentRow = document.querySelector('.row');

        for (let i = 1; i <= this.rowsCount; i++) {
            this.currentRow.firstChild.innerHTML = i;
            this.currentRow = this.currentRow.nextElementSibling;
        }

    }

    fillTableRowsProperty(student) {
        let arr = [];
        arr.push(student);
        this.tableRows = this.tableRows.concat(arr);
        this.rowsCount++;
        // console.log(student);
    }

    makeCellEditable(target) {
        this.editableCell = target;
        this.editableCell.setAttribute('contenteditable', 'true');
        this.editableCell.focus();
        target.addEventListener('blur', onCellBlurSaveChanges);
    }

}

let jsonStudents = new JsonObj();
let jsonData = jsonStudents.jsonData;
let tableExemplar = new Table();

//заполнили свойство tableRows экземпляра таблицы
jsonData.students.forEach(function (student) {
    tableExemplar.fillTableRowsProperty(student)
});

//создание и заполнение таблицы из данных json
tableExemplar.createTable();
tableExemplar.renderTableHeadRow();

tableExemplar.tableRows.forEach(function (elem) {
    let table = document.querySelector('.table_students');
    table.appendChild(tableExemplar.createRow(elem));
    tableExemplar.fillRowContent(elem);
    tableExemplar.lastRowIndex = elem['id'];
    table.addEventListener('click', onTableClick);
});

tableExemplar.fillTableNumeration();

//создание кнопок добавить, удалить, сохранить и их обработчики
function createButton(name, eventListener) {
    let button = document.createElement('button');
    button.setAttribute('id', name);
    button.innerHTML = name;
    document.body.appendChild(button);
    button.addEventListener('click', eventListener);
}

createButton('add', onAddButtonClick);
createButton('remove', onRemoveButtonClick);
createButton('save', onSaveButtonClick);

function onAddButtonClick() {

    let table = document.querySelector('.table_students');

    if (tableExemplar.currentRow === null) {
        let clone = makeDataClone();
        let newRow = tableExemplar.createRow(clone);//
        tableExemplar.tableRows.push(clone);
        table.appendChild(newRow);
        tableExemplar.fillId();

    } else {
        let id = tableExemplar.currentRow.id;
        for (let i = 0; i < tableExemplar.tableRows.length; i++) {
            if (id == tableExemplar.tableRows[i]['id']) {
                let clone = makeDataClone();
                let newRow = tableExemplar.createRow(clone);
                tableExemplar.tableRows.splice(i, 0, clone);
                table.insertBefore(newRow, document.getElementById(id));
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

function makeDataClone() {
    let clone = {};
    for (let key in tableExemplar.tableRows[0]) {
        clone[key] = tableExemplar.tableRows[0][key];
    }
    for (let key in clone) {
        clone[key] = '';
    }
    clone['id'] = tableExemplar.lastRowIndex + 1;
    return clone;
}

function onRemoveButtonClick() {

    let confirmToDelete = confirm('Вы уверены что хотите удалить эту строку?');
    if (!confirmToDelete) {
        return;
    }

    let table = document.querySelector('.table_students');

    if (tableExemplar.currentRow === null) {
        table.removeChild(table.lastElementChild);
        tableExemplar.tableRows.pop();
    } else {
        let id = tableExemplar.currentRow.id;
        for (let i = 0; i < tableExemplar.tableRows.length; i++) {
            if (id == tableExemplar.tableRows[i]['id']) {
                table.removeChild(tableExemplar.currentRow);
                tableExemplar.tableRows.splice(i, 1);
                //console.log('student with id = ' + id + ' was removed');
            }
        }
    }

    tableExemplar.rowsCount--;

    tableExemplar.fillTableNumeration();
}

function onSaveButtonClick() {
    let newTableData = {students: []};
    newTableData.students = tableExemplar.tableRows;
    let newJson = JSON.stringify(newTableData);
    console.log(newJson);
}

function onCellBlurSaveChanges(event) {

    let target = event.target;
    let newValue = target.innerHTML;
    let prop = target.classList[0];
    let id = target.parentNode.id;

    for (let i = 0; i < tableExemplar.tableRows.length; i++) {
        if (tableExemplar.tableRows[i]['id'] == id) {
            tableExemplar.tableRows[i][prop] = newValue;
        }
    }
}

function onCellBlurCheckData(event) {
    let dataType = event.target.classList[0];
    let target = event.target;
    let newValue = target.innerHTML;
    let result;

    switch (dataType) {
        case 'name':
        case 'surname':
            result = checkData('string', newValue);
            if (!result) alert("В это поле необходимо ввести строковое значение.");
            break;

        default:
            result = checkData('numeric', newValue);
            if (!result) alert("В это поле необходимо ввести числовое значение.");
            break;

    }
    // if (!result){
    //
    //     tableExemplar.editableCell = target;
    //     tableExemplar.editableCell.focus();
    // }
}

function checkData(type, value) {

    if (type === 'string') {
        let arrChars = value.split('');
        for (let i = 0; i < arrChars.length; i++) {
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

function onTableClick(event) {

    let target = event.target;
    let table = document.querySelector('.table_students');

    while (target != table) {

        if (target.classList.contains('column-header')) {
            target.addEventListener('click', onColumnHeaderClick);
        }

        if (target.classList.contains('row__data') && !target.classList.contains('id') && !target.classList.contains('row-number') && !target.classList.contains('column-header')) {
            // if (tableExemplar.editableCell === 0) {
            //     tableExemplar.makeCellEditable(target);
            //     //target.addEventListener('blur', onCellBlurSaveChanges);
            //     //return;
            // } else {
            //     tableExemplar.editableCell.removeAttribute('contenteditable');
            //     tableExemplar.makeCellEditable(target);
            //     //target.addEventListener('blur', onCellBlurSaveChanges);
            // }
            target.addEventListener('blur', onCellBlurCheckData);
            target.addEventListener('blur', onCellBlurSaveChanges);
        }
        if (target.classList.contains('row')) {
            if (tableExemplar.currentRow === null) {
                tableExemplar.currentRow = target;
                tableExemplar.currentRow.classList.add('current_row');
                //return;
            } else {
                tableExemplar.currentRow.classList.remove('current_row');
                tableExemplar.currentRow = target;
                tableExemplar.currentRow.classList.add('current_row');
            }
            //target.addEventListener('blur', onCurrentRowBlur);
        }

        target = target.parentNode;
    }

}

function onColumnHeaderClick(event) {
    let sortColumn = event.target.classList[2];
    console.log(sortColumn);
    switch (sortColumn) {
        case 'name':
        case 'surname':
            sortData(sortColumn, 'string');
            break;

        default:
            sortData(sortColumn, 'numeric');
            break;

    }
}

function sortData(sortColumn, dataType) {
    let column = [];
    for (let i = 0; i < tableExemplar.tableRows.length; i++) {
        let dataValue = tableExemplar.tableRows[i][sortColumn];
        let id = tableExemplar.tableRows[i]['id'];
        let student = [id, dataValue];
        column.push(student);
    }

    if (dataType === 'numeric') {

        column.sort(compareNumeric);

    } else {

        column.sort(compareString);

    }
    tableExemplar.fillTableNumeration();
}

function compareNumeric(a, b) {
    let result;
    if (+a[1] > +b[1]) result = 1;
    else if (+a[1] < +b[1]) result = -1;
    else result = 0;
    if (result > 0) {
        swap(a[0], b[0]);
    }
    return result;
}

function compareString(a, b) {
    let result;
    if (a[1] > b[1]) result = 1;
    else if (a[1] < b[1]) result = -1;
    else result = 0;
    if (result > 0) {
        swap(a[0], b[0]);
    }
    return result;
}

function swap(id1, id2) {
    let table = document.querySelector('.table_students');
    for (let i = 0; i < tableExemplar.tableRows.length; i++) {
        if (tableExemplar.tableRows[i]['id'] === id1) {
            //меняем местами элементы массива
            let elem1 = tableExemplar.tableRows[i];
            let elem2 = tableExemplar.tableRows[i + 1];
            tableExemplar.tableRows[i] = elem2;
            tableExemplar.tableRows[i + 1] = elem1;
            //меняем местами строки
            let row1 = document.getElementById(id1);
            let row2 = document.getElementById(id2);
            table.insertBefore(row2, row1);
            return;
        }
    }
}

