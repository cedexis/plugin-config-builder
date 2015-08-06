$(function() {

    loadPageData();

    function deletePluginFromStorage(customerId, pluginName) {
        //debugger;
        var storage = window['localStorage'];
        var customerData = JSON.parse(storage.getItem('plugin-config-builder.customerData'));
        if (customerData
            && customerData[customerId]) {
            delete customerData[customerId][pluginName];
            setCustomerData(customerId, customerData[customerId]);

            $("#customers-list").empty();
            loadPageData();
        }
    }

    function loadPageData() {
        if (window['localStorage']) {
            var storage = window['localStorage'];
            var customerData = JSON.parse(storage.getItem('plugin-config-builder.customerData'));
            console.log(customerData);
            if (customerData) {
                var list = $("#customers-list");
                for (var i in customerData) {
                    if (customerData.hasOwnProperty(i)) {
                        console.log(i);
                        for (var j in customerData[i]) {
                            if (customerData[i].hasOwnProperty(j)) {
                                console.log(j);
                                var item = $(document.createElement('li'));
                                item.data('customerId', i);
                                item.data('pluginName', j);
                                item.addClass('plugin-row');
                                var span = appendElemTo('span', item, { text: i + ' - ' + j, class: 'plugin-label' });
                                span = appendElemTo('span', item);
                                appendElemTo('a', span, {
                                        text: 'goto',
                                        props: {
                                            href: '/plugin-config-builder/?customerId=' + i + '&' + 'pluginName=' + j
                                        }
                                    });
                                appendElemTo('button', item, {
                                        text: 'delete',
                                        click: onDeleteButtonClick
                                    });
                                var areYouSureContainer = appendElemTo('span', item, {
                                        text: 'Are you sure?',
                                        class: 'are-you-sure-container',
                                        css: {
                                            display: 'none'
                                        }
                                    });
                                appendElemTo('button', areYouSureContainer, {
                                        text: 'Yes',
                                        click: onDeleteSureYesClick
                                    });
                                appendElemTo('button', areYouSureContainer, {
                                        text: 'No',
                                        click: onDeleteSureNoClick
                                    });

                                item.appendTo(list);
                            }
                        }
                    }
                }
            }
        }

        function onDeleteButtonClick() {
            var parent = $(this).parent();
            $('.are-you-sure-container', parent).show();
        }

        function onDeleteSureYesClick() {
            var parent = $(this).parent().parent();
            var customerId = parent.data('customerId');
            var pluginName = parent.data('pluginName');
            deletePluginFromStorage(customerId, pluginName);
        }

        function onDeleteSureNoClick() {
            $(this).parent().hide();
        }
    }

});
