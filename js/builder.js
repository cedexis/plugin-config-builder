$(function() {

    $('#plugin-selection select').change(displaySelectedPluginConfiguration);
    $('#add-plugin').click(addPlugin);
    $('#config-area-impact button.add-site').click(addImpactSite);
    $('#config-area-impact button.confirm').click(confirmAddImpactSite);
    $('#lookup-customer').click(displayPluginSelection);

    addDemoData();

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
        var select = $('#plugin-selection select');
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

    function addDemoData() {
        setCustomerData(
            '10660',
            {
                'impactKpis4': {
                    debugging: true,
                    sessionTimeout: 30,
                    cookieTimeout: 7*24*60*60*1000,
                    sites: {},
                    layouts: {},
                    sourceConfigs: {}
                },
                'someOtherPlugin': { 'foo': 'bar' }
            }
        );
    }

    function displayPluginSelection() {
        var customerData = getCustomerData();
        var select = $('#plugin-selection select');
        //debugger;
        for (var pluginName in customerData) {
            if (customerData.hasOwnProperty(pluginName)) {
                $(document.createElement('option'))
                    .text(pluginName)
                    .val(pluginName)
                    .appendTo(select);
            }
        }
        $('#plugin-selection').show();
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
    }

    function addImpactSite() {
        console.log('addImpactSite');
        var container = $('#config-area-impact .add-site-container');
        container.show();
    }

    function confirmAddImpactSite() {
        console.log('confirmAddImpactSite');
        var input = $("#config-area-impact .add-site-container input");
        var value = input.val();
        if (value) {
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
        }
        $("#config-area-impact .add-site-container").hide();
    }
});
