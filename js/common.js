
function setCustomerData(customerId, data) {
    //debugger;
    if (window['localStorage']) {
        var storage = window['localStorage'];
        var customerData = storage.getItem('plugin-config-builder.customerData');
        if (customerData) {
            customerData = JSON.parse(customerData);
            if (data && customerData[customerId]) {
                customerData[customerId] = data;
            } else if (customerData[customerId]) {
                delete customerData[customerId];
            }
            storage.setItem('plugin-config-builder.customerData', JSON.stringify(customerData));
        } else {
            customerData = {};
            if (data) {
                customerData[customerId] = data;
                storage.setItem('plugin-config-builder.customerData', JSON.stringify(customerData));
            }
        }
    }
}
