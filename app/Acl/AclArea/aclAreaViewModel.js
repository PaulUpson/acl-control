import ko from "knockout";
import eventNames from '../../utils/eventNames';
import dataservice from "../../utils/dataservice";
import logger from "../../utils/logger";
import disposable from "../../utils/disposable";
import aclItemMapper from  "../aclItemMapper";
import aclArrayFilterHelper from "../../utils/aclArrayFilterHelper";
"use strict";

aclAreaViewModel.prototype = new disposable();

function aclAreaViewModel(params) {
    var self = this;

    self.isLoading = ko.observable(false);
    self.id = typeof params.itemId === 'function' ? params.itemId : ko.observable(params.itemId);
    self.canUserEditGrants = params.userHasEditGrantsPrivilege;
    self.owner = ko.observable().syncWith(eventNames.grantAccess.assignedInvestigatorChanged,true);
    self.parentFormIsLoaded = params.parentFormIsLoaded;
    self.isEmbedded = params.isEmbedded ? params.isEmbedded : false;
    self.pageType = params.pageType;
    self.userHasEditGrantsPrivilege = typeof params.userHasEditGrantsPrivilege === 'function'
        ? params.userHasEditGrantsPrivilege
        : ko.observable(params.userHasEditGrantsPrivilege);

    self.hasEditGrants = function () {
        return self.userHasEditGrantsPrivilege() && !self.isLoading();
    }
    self.initialDataWasLoaded = ko.observable(false);



    self.uriData = setUriData(params.pageType);
    self.isLoading = ko.observable(false);

    //internal list of all recipients returned from select2 search
    self.allOptions = [];
    self.initialData = [];
    self.aclControlData = ko.observableArray([]).publishOn(eventNames.grantAccess.aclControlData);
    self.aclDifference = ko.observableArray([]);
    self.ownerDifference = ko.observable();
    self.allSelectedIds = ko.observableArray([]);

    self.toExcludeIds = function () {
        var concatIds = [];
        if (self.aclControlData().length > 0) {
            for (var i = 0; i < self.aclControlData().length; i++) {
                ko.utils.arrayForEach(self.aclControlData()[i].values, function (value) {
                    if (value && value.recipientId) {
                        concatIds.push(value.recipientId);
                    }
                });
            }
            self.allSelectedIds(concatIds);
        }
    };

    self.getAllOptions = function (data) {
        ko.utils.arrayForEach(data, function (item) {
            self.allOptions.push(aclItemMapper.aclRecipientDto(item));
        });

    };
    self.getAclData = function (data) {
        ko.utils.arrayForEach(data, function (item) {
            self.aclControlData.push(aclItemMapper.aclControlItem(item));
            self.initialData.push(aclItemMapper.aclControlItem(item));
        });

    };

    self.replaceAclData = function (data) {
        var itemHasInnerData = function (item) {
            return !!(item.values && item.values.length);
        };

        var dataCleanIsRequired = self.aclControlData().some(itemHasInnerData);

        if (dataCleanIsRequired) {
            self.cleanAclControlData();
        }

        self.setViewerData(data);
    };

    self.reaggregateAclData = function (data) {

        var difference = [];

        aclArrayFilterHelper.filterArrayData(self.aclDifference(), self.allSelectedIds());


        self.aclControlData().forEach(function (item) {
            var values = item.values;
            if (item.type === 'Reader') {
                aclArrayFilterHelper.filterArrayData(self.aclDifference(), values, true);
            }
            self.removeOwnerFromTheSelectedValues(self.owner(), item, self.requestValuesChanged);

        });


        aclArrayFilterHelper.filterArrayData(self.allSelectedIds(), data, true);

        data.forEach(function (item) {
            difference.push(item.recipientId);
            self.allSelectedIds().push(item.recipientId);
        });

        self.aclDifference(difference);
        self.setViewerData(data);

    }

    self.removeOwnerFromTheSelectedValues = function (ownerId, item, callback) {
        var buffer = aclArrayFilterHelper.getBufferToDelete([ownerId], item.values, true);
        if (buffer.length > 0) {
            aclArrayFilterHelper.deleteData(buffer, item.values);
            callback(item);
        }
    }

    self.cleanAclControlData = function () {
        self.allSelectedIds([]);
        self.aclControlData().forEach(function (item) {
            item.values = [];
            self.requestValuesChanged(item);
        });
    }

    self.requestValuesChanged = function (item) {
        var option = {
            values: item.values,
            type: item.type
        };
        ko.postbox.publish(eventNames.grantAccess.aclValuesChanged, option);
    }

    self.setViewerData = function (data) {

        self.aclControlData().forEach(function (oldItem) {
            if (oldItem.type === 'Reader') {
                ko.utils.arrayForEach(data, function (newItem) {
                    oldItem.values.push(newItem);
                });
                self.requestValuesChanged(oldItem);
            }

        });
    }

    self.loadInitialData = function () {
        self.isLoading(true);
        dataservice.getData(self.uriData.getDataUrl, function (data) {
            if (data.options)
                self.getAllOptions(data.options);
            if (data.accessRightsByType) {
                self.getAclData(data.accessRightsByType);
            }
            if (data.rowVersion) {
                self.rowVersion = data.rowVersion;
            }
            if (data.owner) {
                self.owner(data.owner);
            }
            self.isLoading(false);
            self.toExcludeIds();
            self.initialDataWasLoaded(true);
            self.canUserEditGrants(self.hasEditGrants());
        }, self.loadErrorCallback);

    };

    self.initialize = ko.computed(function () {
        if (self.parentFormIsLoaded() && self.parentFormIsLoaded() && self.initialDataWasLoaded()) {
            ko.postbox.publish(eventNames.grantAccess.getAssignedInvestigatorOnCaseForm);
        }
    });

    function isOwnerAddedToAcl(ownerId) {
        var index = self.allSelectedIds.indexOf(ownerId);
        if (index > -1) {
            return true;
        }
        return false;
    }

    function getOwnerTypeById(ownerId, aclControlData) {
        for (var i = 0; i < aclControlData.length; i++) {
            var values = aclControlData[i].values;
            for (var j = 0; j < values.length; j++) {
                if (values[j].recipientId === ownerId) {
                    return aclControlData[i].type;
                }
            }
        }
    }

    self.setOwnerDifference = function (ownerId, aclControlData, ownerDifference, allOptions) {
        if ((ownerDifference() !== undefined) && (ownerDifference() !== null)) {
            recoverPreviousOwner(ownerDifference(), allOptions, aclControlData);
        }
        var difference = null;
        if (isOwnerAddedToAcl(ownerId)) {
            difference = {
                ownerId: ownerId,
                type: getOwnerTypeById(ownerId, aclControlData)
            }
        }
        ownerDifference(difference);

    };

    function recoverPreviousOwner(ownerDifference, allOptions, aclControlData) {
        for (var i = 0; i < aclControlData.length; i++) {
            if (aclControlData[i].type === ownerDifference.type) {
                for (var j = 0; j < allOptions.length; j++) {
                    if (allOptions[j].recipientId === ownerDifference.ownerId) {
                        aclControlData[i].values.push(allOptions[j]);
                        return self.requestValuesChanged(aclControlData[i]);
                    }
                }
            }
        }
    }


    self.disposables.push(
        ko.postbox.subscribe(eventNames.grantAccess.grantAccessRequest, function () {
            var data = {
                accessRightsByType: self.aclControlData(),
                rowVersion: self.rowVersion,
                owner: self.owner()
            };
            dataservice.postData(self.uriData.postDataUrl, data, self.updateCallback, self.errorCallback);
        }),
        ko.postbox.subscribe(eventNames.grantAccess.aclItemChanged, function (options) {
            self.processItemsChange(options);
        })
    );

    self.removeDuplications = function (newRecipients, accessLevel) {

        var accessLevelToUpdate;
        newRecipients.values.forEach(function (item) {

            var originalAccessLevelRecipients = accessLevel.values.length;
            accessLevel.values = accessLevel.values.filter(function (value) {
                if (value.recipientId === item.recipientId) {
                    accessLevelToUpdate = value;
                }
                return value.recipientId !== item.recipientId;
            });
            if (originalAccessLevelRecipients > accessLevel.values.length) {
                self.requestValuesChanged(accessLevel);
            }
        });

        return accessLevelToUpdate;
    }


    self.updateCallback = function (response) {
        if (!response) return;

        if (!self.isEmbedded) {
            //show alert message
            logger.success('GrantAccessSuccessfullyChanged');
            ko.postbox.publish(eventNames.openActionHeaderForm, { formName: "" });
        }

    };

    function errorProcessing(httpRequest, alertType) {
        if ((httpRequest) && (httpRequest.responseText)) {
            var response = JSON.parse(httpRequest.responseText);
            if (response.message) {
                logger.errorUntranslatedMessage(response.message);
                return;
            }
        }
        logger.error(alertType);
    }

    self.errorCallback = function (httpRequest) {
        errorProcessing(httpRequest, 'GrantAccessSaveError');
    };

    self.loadErrorCallback = function (httpRequest) {
        errorProcessing(httpRequest, 'GrantAccessLoadError');
        self.isLoading(false);
        self.canUserEditGrants(self.hasEditGrants());

    };

    function setUriData(pageType) {
        if (pageType === "case") {
            var caseUriRoute = "/api/case/";
            var caseMethodGet = "/GetCaseAccessRights";
            var caseMethodNewGet = "GetNewCaseAccessRights";
            var caseMethodPost = "/GrantCaseAccess";
            return {
                getDataUrl: caseUriRoute + (self.id().length > 0 ? (self.id() + caseMethodGet) : caseMethodNewGet),
                postDataUrl: caseUriRoute + self.id() + caseMethodPost
            };
        }
        else if (pageType === 'evidence') {
            var evidenceUriRoute = "/api/evidence/";
            var evidenceMethodGet = "/GetEvidenceAccessRights";
            var evidenceMethodNewGet = "GetNewEvidenceAccessRights";
            var evidenceMethodPost = "/GrantEvidenceAccess";
            return {
                getDataUrl: evidenceUriRoute + (self.id().length > 0 ? (self.id() + evidenceMethodGet) : evidenceMethodNewGet),
                postDataUrl: evidenceUriRoute + self.id() + evidenceMethodPost
            }
        }
    }
}

export default aclAreaViewModel;
