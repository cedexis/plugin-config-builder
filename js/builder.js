$(function() {

    $('#lookup-customer').click(function() {
        var customerId = $("#customer-id").text();
        console.log('customer id: ' + customerId);
        var customerData = getCustomerData(customerId);
        console.log(customerData);
        //debugger;
    });

    function getCustomerData(customerId) {
        if (window['localStorage']) {
            var customerData = window['localStorage'].getItem('customerData');
        }
    }
});
