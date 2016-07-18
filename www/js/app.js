angular.module('app', ['ionic'])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        });

angular.module('app').controller("mainCtrl", function ($scope, $ionicPopup, peopleDAO, PopupFactory) {

    peopleDAO.createDB();

    peopleDAO.getPeopleList().then(function (data) {
        $scope.peopleList = data;
    }, function (reason) {
        console.log(reason);
    });

    $scope.insert = function (people) {
        peopleDAO.addPeople(people).then(function (data) {
            if (data) {
                delete $scope.people;
                peopleDAO.getPeopleList().then(function (peopleList) {
                    peopleList.forEach(function (people) {
                        var encontrou = $scope.peopleList.some(function (p1) {
                            return p1.id === people.id;
                        });
                        if (!encontrou) {
                            $scope.peopleList.push(people);
                        }
                    });
                }, function (reason) {});
            }
        }, function (reason) {});
    };

    $scope.edit = function (people) {
        $scope.data = {};
        var myPopup = PopupFactory.getPopup($scope);
        myPopup.then(function (res) {
            if (res) {
                people.name = res;
                peopleDAO.editPeople(people);
            }
        });
    };

    $scope.remove = function (people) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Deleting user ' + people.name,
            template: 'You sure want to delete this user?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $scope.peopleList.forEach(function (item, index, object) {
                    if (item.id === people.id) {
                        object.splice(index, 1);
                    }
                });
                peopleDAO.removePeople(people);
            }
        });
    };
});

angular.module('app').factory("PopupFactory", function ($ionicPopup) {
    function getPopup(scope) {
        return $ionicPopup.show({
            templateUrl: 'view/dialogTemplate.html',
            title: 'Edit',
            subTitle: 'Tell us the new name:',
            scope: scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!scope.data.newname) {
                            e.preventDefault();
                        } else {
                            return scope.data.newname;
                        }
                    }
                }
            ]
        });
    }

    return {
        getPopup: getPopup
    };
});