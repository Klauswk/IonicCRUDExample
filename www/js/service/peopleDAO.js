angular.module("app").factory("peopleDAO", function ($q) {
    var db;

    var _createDB = function () {
        db = openDatabase('people', '1.0', 'persist of people', 2 * 1024 * 1024);

        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS people (id integer primary key, name text, age integer)');
        });
    };

    _getPeopleList = function () {
        return $q(function (resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM people', [], function (tx, results) {
                    var peopleList = [];
                    for (i = 0; i < results.rows.length; i++) {
                        peopleList.push(results.rows.item(i));
                    }
                    resolve(peopleList);
                });
            });
        });
    };

    _addPeople = function (people) {
        return $q(function (resolve, reject) {
            if (people) {
                if (people.name && people.age) {
                    db.transaction(function (tx) {
                        var retorno = tx.executeSql('INSERT INTO people (name, age) VALUES (?, ?)', [people.name, people.age]);
                        console.log(retorno);
                        resolve(true);
                    });
                }
            }
        });
    };

    _removePeople = function (people) {
        return $q(function (resolve, reject) {
            if (people) {
                db.transaction(function (tx) {
                    tx.executeSql('DELETE FROM people where id = ?', [people.id]);
                    resolve(true);
                });
            }
        });
    };
    
    
    _editPeople = function (people) {
        return $q(function (resolve, reject) {
            if (people) {
                db.transaction(function (tx) {
                    tx.executeSql('update people set name = ? where id = ?', [people.name,people.id]);
                    resolve(true);
                });
            }
        });
    };

    return{
        createDB: _createDB,
        getPeopleList: _getPeopleList,
        addPeople: _addPeople,
        removePeople: _removePeople,
        editPeople : _editPeople
    };
});