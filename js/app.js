        var isHtml5Compatible = document.createElement('canvas').getContext != undefined;
  
        if (isHtml5Compatible) {  
            initiateLocalStorage();  
  
        }  
  
        function initiateLocalStorage() {  
            // Create the AngularJS app with dependencies
            var app = angular.module('Contacts', ['storageService', 'ngAnimate']);  
            
            //create a filter for finding objects 
            app.filter('getById', function() {
              return function(input, id) {
                var i=0, len=input.length;
                for (; i<len; i++) {
                  if (input[i].name == id) {
                    return input[i];
                  }
                }
                return null;
              }
            });
            
            // Create the Controller  
            app.controller('ContactsController', ['$scope', '$filter', 'getLocalStorage', function ($scope, $filter, getLocalStorage) {  
                $scope.appTitle = "External Contacts";  
                $scope.appHeadline = "Select the client Contacts associated with this offer";  
                
                  //declare variable for mainain ajax load and entry or edit mode
                  $scope.loading = true;
                  $scope.addMode = false;
                  $scope.editMode = false;
                  $scope.contacts = [];
                  $scope.contact = {editMode: false, deleteMode:true};
                  $scope.permissions = {create: true, edit:true, delete:true}; 
                
                //Read the Contact List from LocalStorage  
                $scope.contacts = getLocalStorage.getContacts();  
  
                //Count the Contact List  
                $scope.count = $scope.contacts.length;  
  
                //Add Contact - using AngularJS push to add Contact in the Contact Object  
                //Call Update Contact to update the locally stored Contact List  
                //Reset the AngularJS Contact scope  
                //Update the Count  
                $scope.add = function () { 
                    var id = $scope.contacts.length;
                    $scope.contacts.push({'id': id, 'checked': false, 'type': $scope.type, 'name': $scope.name, 'title': $scope.title, 'phone':$scope.phone, 'ext': $scope.ext, 'fax':$scope.fax, 'email':$scope.email });  
                    getLocalStorage.updateContacts($scope.contacts);  
                    $scope.id = 0;
                    $scope.checked = false;
                    $scope.type = '';  
                    $scope.name = '';  
                    $scope.title = '';  
                    $scope.phone = '';
                    $scope.ext = '';
                    $scope.fax = '';
                    $scope.email = '';
                    $scope.count = $scope.contacts.length;  
                }; 
                
                $scope.toggleAdd = function()
                {
                    $scope.addMode = !$scope.addMode;
                };
                
               
                //by pressing toggleEdit button ng-click in html, this method will be hit
                $scope.cancelEdit = function()
                {
                  $scope.addMode = false;
                  $scope.editMode = false;
                    $scope.contact.editMode = false;
                  this.contact.editMode = false;
                    console.log($scope.contact);
                };
                
                $scope.toggleEdit = function () {
                  $scope.contact.editMode   = !($scope.contact.editMode);
                  this.contact.editMode = !this.contact.editMode;
                  $scope.addMode = false;
                  $scope.editMode = !$scope.editMode;
                  if (this.contact.editMode) {
                      $scope.contact = this.contact;
                  }
                    else {
                      $scope.contact = {editMode: true};
                  }
                    
                };
                
            //Edit Contact
            $scope.save = function () {
                    //console.log("Edit");
                    $scope.loading = true;
                    var item = this.contact;
                    //getLocalStorage.updateContact(item); 
                    var contacts = getLocalStorage.getContacts(); 
                    for (i=0; i<contacts.length; i++) {
                      if (contacts[i].name == item.name) {
                        contacts[i] = item;
                        contacts[i].editMode = true;
                      }
                    }

                    //var foundContact = $filter('getById')(contacts, item.name);
                    getLocalStorage.updateContacts(contacts);            
                    item.editMode = false;

                  $scope.loading = false;
                  $scope.addMode = false;
                  $scope.editMode = false;
                  $scope.contact = {editMode: false};
                  $scope.permissions = {create: true, edit:true, delete:true};
               };
  
                //Delete Contact - Using AngularJS splice to remove the emp row from the Contact list  
                //All the Update Contact to update the locally stored Contact List  
                //Update the Count  
                $scope.deleteContact = function (contact) {  
                    $scope.contacts.splice($scope.contacts.indexOf(contact), 1);  
                    getLocalStorage.updateContacts($scope.contacts);  
                    $scope.count = $scope.contacts.length;  
                };  
            }]);  
  
            //Create the Storage Service Module  
            //Create getLocalStorage service to access UpdateContacts and getContacts method  
            var storageService = angular.module('storageService', []);  
            storageService.factory('getLocalStorage', function () {  
                var contactList = {};  
                return {  
                    list: contactList,  
                    updateContacts: function (ContactsArr) {  
                        if (window.localStorage && ContactsArr) {  
                            //Local Storage to add Data  
                            localStorage.setItem("contacts", angular.toJson(ContactsArr));  
                        }  
                        contactList = ContactsArr;  
  
                    },  
                    updateContact: function (contact) {  
                        if (window.localStorage && contact != undefined) {  
                            contactList = angular.fromJson(localStorage.getItem("contacts"));                   
                        } 
 
                    },
                    getContacts: function () {  
                        //Get data from Local Storage  
                        contactList = angular.fromJson(localStorage.getItem("contacts"));  
                        angular.forEach(contactList, function(item, key) {
                          item.editMode=false;
                        });
                        return contactList ? contactList : [];  
                    }  
                };  
  
            });  
        } 

    function runJasmineTests()
    {
                describe('Save Contact', function () {
                   it('1 contact + 1 contact should equal 2 contacts');
                });        
    }