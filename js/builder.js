$(function() {

    $('#plugin-selection select').change(displaySelectedPluginConfiguration);

    $('#lookup-customer').click(function() {
        var customerId = $("#customer-id").val();
        console.log('customer id: ' + customerId);
        var customerData = getCustomerData(customerId);
        console.log(customerData);

        displayPluginSelection(customerData);
    });

    addDemoData();

    function getCustomerData(customerId) {
        if (window['localStorage']) {
            var storage = window['localStorage'];
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

    function setCustomerPluginData(customerId, pluginName, data) {
        if (window['localStorage']) {
            var storage = window['localStorage'];
            var customerData = storage.getItem('customerData');
            if (customerData) {
                customerData = JSON.parse(customerData);
            } else {
                customerData = {};
            }
            customerData[customerId] = customerData[customerId] || {};
            if (data) {
                customerData[customerId][pluginName] = data;
            } else {
                delete customerData[customerId][pluginName];
            }
            storage.setItem('customerData', JSON.stringify(customerData));
        }
    }

    function addDemoData() {
        setCustomerData('10660', null);
        setCustomerPluginData('10660', 'impactKpis4', {
            debugging: true,
            sessionTimeout: 30,
            cookieTimeout: 7*24*60*60*1000,
            sites: {},
            layouts: {},
            sourceConfigs: {}
        });
        setCustomerPluginData('10660', 'someOtherPlugin', { 'foo': 'bar' });
    }

    function displayPluginSelection(customerData) {
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
        var select = $('#plugin-selection select');
        console.log(select.val());
        var pluginName = select.val();
        if ('string' === typeof pluginName) {
            switch (pluginName) {
                case 'impactKpis4':
                    displayConfigForImpact();
                    break;
            }
            displayJSON(pluginName);
        }
    }

    /**
     * @param {string} pluginName
     */
    function displayJSON(pluginName) {
        var customerId = $("#customer-id").val();
        var customerData = getCustomerData(customerId);
        var pluginConfig = customerData[pluginName];
        //debugger;
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
});
