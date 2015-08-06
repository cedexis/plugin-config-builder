COMPILER?=node_modules/google-closure-compiler/compiler.jar
JSHINT?=node_modules/jshint/bin/jshint

validate-javascript:
	java -jar $(COMPILER) \
	--js js/common.js \
	--js js/builder.js \
	--externs externs.js \
	--externs jquery-1.9.externs.js \
	--language_in ECMASCRIPT5 \
	--js_output_file /dev/null \
	--warning_level VERBOSE

	java -jar $(COMPILER) \
	--js js/common.js \
	--js js/storage.js \
	--externs externs.js \
	--externs jquery-1.9.externs.js \
	--language_in ECMASCRIPT5 \
	--js_output_file /dev/null \
	--warning_level VERBOSE

	$(JSHINT) --config common.jshint.json js/common.js
	$(JSHINT) --config builder.jshint.json js/builder.js
	$(JSHINT) --config storage.jshint.json js/storage.js
