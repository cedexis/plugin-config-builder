$(function() {

    $('#plugin-selection-area > select').change(displaySelectedPluginConfiguration);
    $('#plugin-selection-area button.add').click(addPlugin);
    $('#plugin-selection-area .add-container button.confirm').click(confirmAddPlugin);
    $('#config-area-impact .layouts button.add').click(addImpactLayout);
    $('#config-area-impact .layouts button.confirm').click(confirmAddImpactLayout);
    $('#config-area-impact .sites button.add').click(addImpactSite);
    $('#config-area-impact .sites button.confirm').click(confirmAddImpactSite);
    $('#lookup-customer').click(displayPluginSelection);
    $('#config-area-impact select.sites').change(displaySelectedImpactSiteConfiguration);

    var builderConfig = {
        'impactKpis4': {
            makeDefault: function() {
                return {
                    debugging: true,
                    sessionTimeout: 30,
                    cookieTimeout: 7*24*60*60*1000,
                    sites: {},
                    layouts: {},
                    sourceConfigs: {}
                };
            }
        },
        'someOtherPlugin': {
            makeDefault: function() {
                return {
                    'foo': 'bar'
                };
            }
        }
    };

    setCustomerData(
        '10660',
        {
            'impactKpis4': builderConfig['impactKpis4'].makeDefault(),
            'someOtherPlugin': builderConfig['someOtherPlugin'].makeDefault()
        }
    );

    /**
     * @return {string|null}
     */
    function getCurrentCustomerId() {
        var result = $("#customer-id").val();
        return ('string' === typeof result) ? result : null;
    }

    /**
     * @return {string|null}
     */
    function getSelectedPlugin() {
        var select = $('#plugin-selection-area select');
        var result = select.val();
        return ('string' === typeof result) ? result : null;
    }

    function getCustomerData() {
        if (window['localStorage']) {
            var storage = window['localStorage'];
            var customerId = getCurrentCustomerId();
            var customerData = storage.getItem('customerData');
            console.log(customerData);
            if (!customerData) {
                customerData = {};
                customerData[customerId] = {};
                storage.setItem('customerData', JSON.stringify(customerData));
                return customerData[customerId];
            }
            customerData = JSON.parse(customerData);
            if (customerData[customerId]) {
                return customerData[customerId];
            }
            customerData[customerId] = {};
            storage.setItem('customerData', JSON.stringify(customerData));
            return customerData[customerId];
        }
        return null;
    }

    function getSelectedPluginData() {
        var pluginName = getSelectedPlugin();
        var customerData = getCustomerData();
        return customerData[pluginName];
    }

    function setSelectedPluginData(data) {
        var customerId = getCurrentCustomerId();
        var pluginName = getSelectedPlugin();
        var customerData = getCustomerData();
        customerData[pluginName] = data;
        setCustomerData(customerId, customerData);
        displayJSON();
    }

    function setCustomerData(customerId, data) {
        //debugger;
        if (window['localStorage']) {
            var storage = window['localStorage'];
            var customerData = storage.getItem('customerData');
            if (customerData) {
                customerData = JSON.parse(customerData);
                if (data && customerData[customerId]) {
                    customerData[customerId] = data;
                } else if (customerData[customerId]) {
                    delete customerData[customerId];
                }
                storage.setItem('customerData', JSON.stringify(customerData));
            } else {
                customerData = {};
                if (data) {
                    customerData[customerId] = data;
                    storage.setItem('customerData', JSON.stringify(customerData));
                }
            }
        }
    }

    function displayPluginSelection() {
        var customerData = getCustomerData();
        var select = $('#plugin-selection-area select');
        //debugger;
        for (var pluginName in customerData) {
            if (customerData.hasOwnProperty(pluginName)) {
                $(document.createElement('option'))
                    .text(pluginName)
                    .val(pluginName)
                    .appendTo(select);
            }
        }
        $('#plugin-selection-area').show();
        select.change();
    }

    function displaySelectedPluginConfiguration() {
        console.log('selected plugin changed');
        var pluginName = getSelectedPlugin();
        if ('string' === typeof pluginName) {
            switch (pluginName) {
                case 'impactKpis4':
                    displayConfigForImpact();
                    break;
            }
            displayJSON();
        }
    }

    function displayJSON() {
        var pluginConfig = getSelectedPluginData();
        var textArea = $('#json-area textarea');
        var text = JSON.stringify(pluginConfig, null, 2);
        var lines = text.split('\n');
        textArea.text(text);
        textArea.prop('rows', lines.length);
        $('#json-area').show();
    }

    function displayConfigForImpact() {
        var area = $('#config-area-impact');
        area.show();
    }

    function addPlugin() {
        console.log('addPlugin');
        var container = $('#plugin-selection-area div.add-container');
        var select = $('#plugin-selection-area .add-container select.plugins');
        var customerData = getCustomerData();
        var candidates = Object.keys(builderConfig).sort();
        for (var i = 0; i < candidates.length; i++) {
            var current = candidates[i];
            if (!customerData[current]) {
                var option = $(document.createElement('option'));
                option.text(current).val(current);
                select.append(option);
            }
        }
        container.show();
    }

    function addImpactSite() {
        console.log('addImpactSite');
        var container = $('#config-area-impact .sites div.add-container');
        container.show();
    }

    function confirmAddImpactSite() {
        console.log('confirmAddImpactSite');
        var input = $("#config-area-impact .sites div.add-container input");
        var value = input.val();
        if (value && 'string' === typeof value) {
            var data = getSelectedPluginData();
            data['sites'][value] = {
                'layout': 'default',
                'sourceConfig': null,
                'cookie': {
                    'domain': null
                },
                'enableMetadataReporting': false
            };
            setSelectedPluginData(data);

            var option = $(document.createElement('option'));
            option.text(value).val(value);
            $('#config-area-impact select.sites').append(option).val(value).change();
        }
        $("#config-area-impact .sites div.add-container").hide();
    }

    function displaySelectedImpactSiteConfiguration() {
        console.log('displaySelectedImpactSiteConfiguration');
    }

    function addImpactLayout() {
        console.log('addImpactLayout');
        var container = $('#config-area-impact .layouts div.add-container');
        container.show();
    }

    function confirmAddImpactLayout() {
        console.log('confirmAddImpactLayout');
        var input = $("#config-area-impact .layouts div.add-container input");
        var value = input.val();
        if (value && 'string' === typeof value) {
            var data = getSelectedPluginData();
            data['layouts'][value] = {
                kpi: [],
                categoryRuleSets: []
            };
            setSelectedPluginData(data);

            var option = $(document.createElement('option'));
            option.text(value).val(value);
            $('#config-area-impact select.layouts').append(option).val(value).change();
        }
        $("#config-area-impact .layouts div.add-container").hide();
    }

    function confirmAddPlugin() {
        var pluginsContainer = $('#plugin-selection-area');
        var addContainer = $('#plugin-selection-area .add-container');
        var value = $('select', addContainer).val();
        console.log(value);
        addContainer.hide();
        if (value && 'string' === typeof value) {
            var select = $('> select', pluginsContainer);
            console.log(select);
            var option = $(document.createElement('option'));
            option.text(value).val(value);
            select.append(option).val(value);
            var data = getCustomerData();
            data[value] = builderConfig[value].makeDefault();
            setCustomerData(getCurrentCustomerId(), data);
            select.change();
        }
    }
});
