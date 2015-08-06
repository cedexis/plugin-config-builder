
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

/**
 * @param {string} tagName
 * @param {jQuery} parent
 * @param {Object=} options
 * @return {jQuery}
 */
function appendElemTo(tagName, parent, options) {
    var i;
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
            for (i in options.props) {
                if (options.props.hasOwnProperty(i)) {
                    tag.prop(i, options.props[i]);
                }
            }
        }
        if (options.css) {
            for (i in options.css) {
                if (options.css.hasOwnProperty(i)) {
                    tag.css(i, options.css[i]);
                }
            }
        }
        if (options.click) {
            tag.click(options.click);
        }
    }

    return tag;
}
