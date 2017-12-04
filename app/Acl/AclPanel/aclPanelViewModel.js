import ko from 'knockout';
import enums from '../../utils/enums.js';
import eventNames from '../../utils/eventNames.js';

"use strict";
function aclPanelViewModel(params) {

    var self = this;
    var pageType = ((params.pageType === enums.pageTypes.CaseList) || (params.pageType === enums.pageTypes.CaseDetails)) ? 'case' : 'evidence'; 
    self.id = params.pageType === (enums.pageTypes.CaseList) ? params.selectedItems[0].id : params.id;
    self.pageType = pageType;
    self.title = 'Grant case access:';
    self.parentFormIsLoaded = ko.observable(true);
    ko.postbox.publish(eventNames.actionFormTitleResponse, self.title);
    //because showing of this form checked at the higher level
    self.userHasEditGrantsPrivilege = function (){return true;}
    self.submitGrantAccess = function() {
        ko.postbox.publish(eventNames.grantAccess.grantAccessRequest);
    }
}

export default { aclPanelViewModel };