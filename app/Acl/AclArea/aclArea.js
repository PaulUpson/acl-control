import ko from 'knockout'; 
import viewModel from './aclAreaViewModel';
import template from './AclArea.html';
'use strict';

function createViewModel(params) {
    var vm = new viewModel(params);
    vm.loadInitialData();
    ko.components.register('acl-control', { require: 'Investigate/Acl/AclControl/aclControl' });
    return vm;
}

var component = { viewModel: { createViewModel: createViewModel }, template: template };

export { component };