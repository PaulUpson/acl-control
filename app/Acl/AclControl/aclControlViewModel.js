import $ from 'jquery'; 
import ko from 'knockout';
import aclItemMapper from '../aclItemMapper';
'use strict';

function aclControlViewModel(params) {
    var self = this;
    this.selectedItems = params.values.map(item => { return { id: item.recipientId, name: item.name, type: item.recipientType }; });

    self.type = params.type;
    self.id = 'select-acl-' + self.type.toLowerCase();
    self.labelText = ko.observable(params.labelText);
    self.values = ko.observableArray([]);
    self.selectedIds = ko.observableArray(this.selectedItems.map(i => { return i.id }));
    self.options = params.options;

    self.owner = params.owner;
    self.allSelectedIds = params.allSelectedIds; 
    self.aclDifference = params.aclDifference;
    self.excludeOwner = params.excludeOwner;

    self.canUserEditGrants = params.canUserEditGrants;
    self.toReset = ko.observable(false);

    self.ajax = {
        url: '/api/user/usergroups',
        dataType: 'json',
        data: function (params) {
            var query = {
                search: params.term,
                exclude: self.selectedIds() || []
        }
            // Query parameters will be ?search=[term]&type=public
            return query;
        }
    };

    this.optionTemplate = function(item) {
        if (item.loading) return '';
        // if its an existing selection, type will be at the element level.
        var type = item.type || item.element.type;
        if (type === 'user')
            return $('<span><i class="fa fa-user"></i> &nbsp;' + item.text + '</span>');
        else
            return $('<span><i class="fa fa-group"></i> &nbsp;' + item.text + '</span>');
    };






    self.getValuesData = function(data) {
        var values = $.map(data, function(item) {
            return aclItemMapper.aclSelect2Item(item);
        });

        return values;
    }

    self.getSelectedIds = function(data) {
        var values = [];
        ko.utils.arrayForEach(data, function(item) {
            values.push(item.recipientId);
        });

        return values;
    }



    self.binderOptions = {
        values: self.values,
        selectedIds: self.selectedIds,
        options: self.options,
        type: self.type,
        excludeOwner: self.excludeOwner,
        allSelectedIds: self.allSelectedIds,
        toReset: self.toReset,
        aclDifference: self.aclDifference,
        owner: self.owner
    }

    self.initSelectedData = function(values) {
        var valuesData = values ? values : params.values;
        self.values(valuesData.length > 0 ? self.getValuesData(valuesData) : []);
        self.selectedIds(valuesData.length > 0 ? self.getSelectedIds(valuesData) : []);
    }
}

export default aclControlViewModel;