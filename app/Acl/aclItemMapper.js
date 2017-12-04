import xssProtect from '../utils/xssProtect';
    
"use strict";

var aclRecipientDto = function(item) {
    return {
        recipientId: item.recipientId,
        name: item.name,
        recipientType: item.recipientType,
        status: item.status
    };
};

var aclSelect2Item = function(item) {
    return {
        id: item.recipientId,
        text: xssProtect.htmlEncode(item.name)
    };
};

var aclControlItem = function(item) {
    return {
        type: item.type,
        labelText: item.labelText,
        values: item.values.map(aclRecipientDto)
    };
};
var aclControlValuesReplace = function(item, values) {
    return {
        type: item.type,
        labelText: item.labelText,
        values: values
    };
};

export default {
    aclRecipientDto: aclRecipientDto,
    aclSelect2Item: aclSelect2Item,
    aclControlItem: aclControlItem,
    aclControlValuesReplace: aclControlValuesReplace
};