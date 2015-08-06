$(function() {

    $('#plugin-selection-area button.add').click(addPlugin);
    $('#plugin-selection-area .add-container button.confirm').click(confirmAddPlugin);
    $('#config-area-impact button.layouts.add').click(addImpactLayout);
    $('#config-area-impact button.layouts.confirm').click(confirmAddImpactLayout);
    $('#config-area-impact button.sites.add').click(addImpactSite);
    $('#config-area-impact button.sites.confirm').click(confirmAddImpactSite);
    $('#lookup-customer').click(displayPluginSelection);

    $('#plugin-selection-area > select').change(function() {
        console.log('selected plugin changed');
        var pluginName = getSelectedPlugin();
        if ('string' === typeof pluginName) {
            builderConfig[pluginName].displayConfig();
            displayJSON();
        }
    });

    $('#config-area-impact select.layouts').change(function() {
        console.log('layout changed');
        var container = $('#config-area-impact div.config-area');
        updateImpactLayoutConfigArea();
        updateImpactSiteConfigArea();
        container.show();
    });

    $('#config-area-impact select.sites').change(function() {
        console.log('site changed');
    });

    $('#config-area-impact button.category-rulesets.add').click(function() {
        console.log('Adding ruleset');
        // var panel = buildImpactCategoryPanel();
        // panel.insertBefore(this);
        var data = getSelectedPluginData();
        var layout = getSelectedImpactLayout();
        data['layouts'][layout]['categoryRuleSets'].push({
            'rules': []
        });
        setSelectedPluginData(data);
        updateImpactLayoutConfigArea();
    });

    var builderConfig = {
        'impactKpis4': {
            makeDefault: function() {
                return {
                    'debugging': true,
                    'sessionTimeout': 30,
                    'cookieTimeout': 7*24*60*60*1000,
                    'sites': {},
                    'layouts': {
                        'default': {
                            'kpi': [],
                            'categoryRuleSets': []
                        }
                    },
                    'sourceConfigs': {}
                };
            },
            displayConfig: function() {
                //debugger;
                var area = $('#config-area-impact');
                var pluginConfig = getSelectedPluginData();
                var i;
                var option;
                var select = $('select.layouts', area);
                for (i in pluginConfig['layouts']) {
                    if (pluginConfig['layouts'].hasOwnProperty(i)) {
                        option = $(document.createElement('option'));
                        option.text(i)
                            .val(i)
                            .appendTo(select);
                    }
                }
                select.change();
                select = $('select.sites', area);
                for (i in pluginConfig['sites']) {
                    if (pluginConfig['sites'].hasOwnProperty(i)) {
                        option = $(document.createElement('option'));
                        option.text(i)
                            .val(i)
                            .appendTo(select);
                    }
                }
                select.change();
                area.show();
            }
        },
        'someOtherPlugin': {
            makeDefault: function() {
                return {
                    'foo': 'bar'
                };
            }
        },
        displayConfig: function() {
            console.log('Not implemented');
        }
    };

    setCustomerData(
        '10660',
        {
            'impactKpis4': {
                'debugging': true,
                'sessionTimeout': 30,
                'cookieTimeout': 7*24*60*60*1000,
                'sites': {
                    'www.foo.com': {
                        'layout': 'default',
                        'sourceConfig': 'default',
                        'cookie': {
                            'domain': '.www.foo.com'
                        },
                        'enableMetadataReporting': false
                    }
                },
                'layouts': {
                    'default': {
                        'kpi': [],
                        'categoryRuleSets': []
                    }
                },
                'sourceConfigs': {
                    'default': [
                        {
                            sourceFrom: 'sourceProperty',
                            source: 'twitter.com',
                            rule: { type: 'referrerDomain', value: 't.co' }
                        }, {
                            rule: { type: 'anyReferrerDomain', allowOwnHost: false }
                        }
                    ]
                }
            },
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

    function getSelectedImpactLayout() {
        return $('#config-area-impact select.layouts').val();
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

    function displayJSON() {
        var pluginConfig = getSelectedPluginData();
        var textArea = $('#json-area textarea');
        var text = JSON.stringify(pluginConfig, null, 2);
        var lines = text.split('\n');
        textArea.text(text);
        textArea.prop('rows', lines.length);
        $('#json-area').show();
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
                'kpi': [],
                'categoryRuleSets': []
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

    var impactCategoryNameTypeChangedFunctions = {
        'category': {
            onChange: function() {
                console.log('onChange category');
            }
        },
        'categoryFromPathParts': {
            onChange: function() {
                console.log('onChange categoryFromPathParts');
            }
        }
    };

    /**
     * @this {Element}
     */
    function impactCategoryNameTypeChanged() {
        impactCategoryNameTypeChangedFunctions[$(this).val()].onChange();
    }

    function buildImpactCategoryPanel(config) {
        console.log(config);
        var container = $(document.createElement('div'));
        container.addClass('category section-container');
        var innerContainer = $(document.createElement('div'))
            .appendTo(container);

        var categoryRadio = $(document.createElement('input'))
            .prop('type', 'radio')
            .prop('name', 'category-name')
            .val('category')
            .change(impactCategoryNameTypeChanged)
            .appendTo(innerContainer);

        $(document.createElement('label'))
            .addClass('radio')
            .text('Static')
            .appendTo(innerContainer);

        var categoryFromPathPartsRadio = $(document.createElement('input'))
            .prop('type', 'radio')
            .prop('name', 'category-name')
            .val('categoryFromPathParts')
            .change(impactCategoryNameTypeChanged)
            .appendTo(innerContainer);

        $(document.createElement('label'))
            .addClass('radio')
            .text('Name From Path')
            .appendTo(innerContainer);

        var radio = categoryRadio;
        if ('categoryFromPathParts' in config) {
            radio = categoryFromPathPartsRadio;
        }
        if (radio) {
            radio.prop('checked', true).change();
        }

        // $(document.createElement('input'))
        //     .addClass('category-name')
        //     .prop('type', 'text')
        //     .appendTo(innerContainer);
        // $(document.createElement('label'))
        //     .text('Category Name')
        //     .appendTo(innerContainer);
        // innerContainer.appendTo(container);
        //
        // innerContainer = $(document.createElement('div'));
        // $(document.createElement('input'))
        //     .addClass('category-from-path-parts')
        //     .prop('type', 'checkbox')
        //     .appendTo(innerContainer);
        // $(document.createElement('label'))
        //     .text('Category From Path Parts')
        //     .appendTo(innerContainer);
        // innerContainer.appendTo(container);
        //


        return container;
    }

    function updateImpactLayoutConfigArea() {
        console.log('updateImpactLayoutConfigArea');
        var pluginData = getSelectedPluginData();
        //console.log(pluginData);
        var layout = getSelectedImpactLayout();
        var layoutConfig = pluginData['layouts'][layout];
        //console.log(layoutConfig);
        var i;
        var current;
        var container = $('.category-rulesets .container');
        container.empty();
        for (i = 0; i < layoutConfig['categoryRuleSets'].length; i++) {
            current = layoutConfig['categoryRuleSets'][i];
            container.append(buildImpactCategoryPanel(current));
        }
    }

    function updateImpactSiteConfigArea() {
        console.log('updateImpactSiteConfigArea');
    }
});
