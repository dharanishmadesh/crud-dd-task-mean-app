(function() {
  'use strict';

  angular
    .module('crudApp', [])
    .constant('API_BASE', '/api/items')
    .controller('MainController', ['$http', 'API_BASE', MainController]);

  function MainController($http, API_BASE) {
    var vm = this;

    vm.items = [];
    vm.loading = false;
    vm.error = '';
    vm.editMode = false;
    vm.form = {
      _id: null,
      name: '',
      description: ''
    };

    vm.loadItems = function() {
      vm.loading = true;
      vm.error = '';
      $http.get(API_BASE)
        .then(function(res) {
          vm.items = res.data || [];
        })
        .catch(function(err) {
          console.error('Error fetching items:', err);
          vm.error = 'Failed to load items. Check backend / Nginx config.';
        })
        .finally(function() {
          vm.loading = false;
        });
    };

    vm.saveItem = function() {
      vm.error = '';
      if (!vm.form.name) {
        vm.error = 'Name is required';
        return;
      }

      if (vm.editMode && vm.form._id) {
        $http.put(API_BASE + '/' + vm.form._id, {
          name: vm.form.name,
          description: vm.form.description
        }).then(function() {
          vm.loadItems();
          vm.resetForm();
        }).catch(function(err) {
          console.error('Error updating item:', err);
          vm.error = 'Failed to update item.';
        });
      } else {
        $http.post(API_BASE, {
          name: vm.form.name,
          description: vm.form.description
        }).then(function() {
          vm.loadItems();
          vm.resetForm();
        }).catch(function(err) {
          console.error('Error creating item:', err);
          vm.error = 'Failed to create item.';
        });
      }
    };

    vm.startEdit = function(item) {
      vm.editMode = true;
      vm.form._id = item._id;
      vm.form.name = item.name;
      vm.form.description = item.description;
    };

    vm.resetForm = function() {
      vm.editMode = false;
      vm.form._id = null;
      vm.form.name = '';
      vm.form.description = '';
      vm.error = '';
    };

    vm.deleteItem = function(item) {
      if (!confirm('Delete this item?')) return;
      vm.error = '';

      $http.delete(API_BASE + '/' + item._id)
        .then(function() {
          vm.loadItems();
        })
        .catch(function(err) {
          console.error('Error deleting item:', err);
          vm.error = 'Failed to delete item.';
        });
    };

    // Initial load
    vm.loadItems();
  }
})();
