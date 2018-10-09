if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

angular.module("main")
    .controller("CloningCtrl", function($scope, $http){
        var rowCount = 1;

        $scope.inputsInMirror = [
            {
                name: 'inputMirror' + rowCount
            }
        ];
        
        $scope.addInputInMirror = function (){
            rowCount++;
            $scope.inputsInMirror.push({
                name: 'inputMirror' + rowCount
            });
        };

        var that = this;
        that.copyFromUser = null;
        that.loading = false;

        that.autoCompleteOptions = {
            minimumChars: 1,
            data: function (searchText) {
                return $http.get('/api/user?searchString=' + searchText )
                .then(function(res){
                    that.loading = true;

                    var filteredUsers = _.filter(res.data, function(user){
                        return user.name;
                    });
                    that.loading = false;

                    return _.map(filteredUsers, 'name');

                }).catch(function(err){
                    console.log(err);
                });
            }
        };

        //TODO
        //change search button to loading when loading
        //do the same in the other half
        //make button search unclickable
        //customize 'No result found' Make it a link
  
    });