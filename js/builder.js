$(function() {

    $('#lookup-customer').click(function() {
        var customerId = $("#customer-id").val();
        console.log('customer id: ' + customerId);
        var customerData = getCustomerData(customerId);
        console.log(customerData);
        //debugger;
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

    function addDemoData() {

    }
});
