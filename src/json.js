'use strict';

class JsonObj{

    get jsonData(){
        return new Promise(function (resolve, reject) {
            let request = new XMLHttpRequest();
            request.open("GET", "src/data.json");
            request.onload = function () {
                if (request.status === 200){
                    let json = JSON.parse(request.response);
                    resolve(json.students);
                }else{
                    reject(request.statusText);
                }
            };

            request.onerror = function (error) {
                reject(error);
            };
            request.send();
        });
    }

    set jsonData(newData){

    }

}

let jsonStudents = new JsonObj();
console.log(jsonStudents.jsonData);

jsonData
    .then( function(students) {
        students.forEach(function (student) {
            tableExemplar.fillTableRowsProperty(student)
        })
    })
    .catch(error=> console.error(error));
