
$(function() {
    $('#messages-container .clear-all').click(function() {
        $.when($('#messages-container').fadeOut())
            .done(function() {
                $('#messages-container div.message').remove();
            });
    });
});

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
 * @param {Object=} options
 * @return {jQuery}
 */
function createTag(tagName, options) {
    var i;
    var tag = $(document.createElement(tagName));
    if (options) {
        if (options.text) {
            tag.text(options.text);
        }
        if (options.class) {
            tag.addClass(options.class);
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

/**
 * @param {string} tagName
 * @param {jQuery} parent
 * @param {Object=} options
 * @return {jQuery}
 */
function appendElemTo(tagName, parent, options) {
    var tag = createTag(tagName, options);
    tag.appendTo(parent);
    return tag;
}

/**
 * @param {string} tagName
 * @param {jQuery} parent
 * @param {number} index
 * @param {Object=} options
 * @return {jQuery}
 */
function insertElemInto(tagName, parent, index, options) {
    var tag = createTag(tagName, options);
    if (0 === index) {
        parent.prepend(tag);
    } else {
        parent.children().eq(index - 1).after(tag);
    }
    return tag;
}

function displayMessage(level, message) {
    var messages = $("#messages-container");
    var levelClassPart = '';
    switch (level) {
        case 'info':
        case 'warning':
        case 'error':
            levelClassPart = ' ' + level;
            break;
    }
    var messageContainer = insertElemInto('div', messages, 0, {
        class: 'message' + levelClassPart
    });
    if ('string' === typeof message) {
        appendElemTo('p', messageContainer, {
            text: message
        });
    } else if ('length' in message) {
        for (var i = 0; i < message.length; i++) {
            var current = message[i];
            if (0 < current.length) {
                appendElemTo('p', messageContainer, {
                    text: current
                });
            } else {
                appendElemTo('hr', messageContainer);
            }
        }
    }
    messages.fadeIn();
}
