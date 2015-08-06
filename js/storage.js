$(function() {

    loadPageData();

    /**
     * @param {string} tagName
     * @param {jQuery} parent
     * @param {Object=} options
     * @return {jQuery}
     */
    function appendElemTo(tagName, parent, options) {
        var tag = $(document.createElement(tagName));
        tag.appendTo(parent);

        if (options) {
            if (options.text) {
                tag.text(options.text);
            }
            if (options.classes) {
                tag.addClass(options.classes);
            }
            if (options.props) {
                for (var i in options.props) {
                    if (options.props.hasOwnProperty(i)) {
                        tag.prop(i, options.props[i]);
                    }
                }
            }
            if (options.click) {
                tag.click(options.click);
            }
        }

        return tag;
    }

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
                                var span = appendElemTo('span', item, { text: i + ' - ' + j, classes: 'plugin-label' });
                                span = appendElemTo('span', item, { classes: 'plugin-row-link' });
                                appendElemTo('a', span,
                                    {
                                        text: 'goto',
                                        props: {
                                            href: '/plugin-config-builder/?customerId=' + i + '&' + 'pluginName=' + j
                                        }
                                    });
                                appendElemTo('button', item,
                                    {
                                        text: 'delete',
                                        click: onDeleteButtonClick
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
            var customerId = parent.data('customerId');
            var pluginName = parent.data('pluginName');
            deletePluginFromStorage(customerId, pluginName);
        }
    }

});
