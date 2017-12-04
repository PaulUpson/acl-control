import viewModel from './aclControlViewModel';
import template from './AclControl.html';

"use strict";
function createViewModel(params) {
    return new viewModel(params);
}

var component = { viewModel: { createViewModel: createViewModel }, template: template };

export { component };