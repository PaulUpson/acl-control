import ko from 'knockout';
import viewModel from './aclPanelViewModel';
import template from './AclPanel.html';

"use strict";
function createViewModel(params) {
    var vm = new viewModel(params);
    ko.components.register('acl-area', { require: 'Investigate/Acl/AclArea/aclArea' });
    return vm;
}

var vm = { viewModel: { createViewModel: createViewModel }, template: template };

export { vm };