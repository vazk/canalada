FE.Canal = function(canalName, canalId, cnlElem){
	return {
	    name: canalName,
        id: canalId,
        is_enabled: false,
        row: cnlElem,
        // also caching some of the controls for faster/convenient access...
        header: cnlElem.find('canalhead'),
        workspace: cnlElem.find('#canal-workspace'),
        module_lib_panel: {
            top: 35, left: 15, minimized: false,
            widget: cnlElem.find('#module-library-widget'),
            library: $('#library').clone(),
        },
        module_prop_panel: {
            top: 35, left: 15, minimized: false,
            widget: cnlElem.find('#module-properties-widget'),
        },
        toolbar: cnlElem.find('#toolbar'),
        scheme: $('#canal-scheme'),
        log: cnlElem.find('#canal-log-textbox'), 
        content: {},

        /////////////////////////////////////////////////////
        //// interface									 ////
        /////////////////////////////////////////////////////
        logMessage: function(msg, date) {
        	this.log.append('[' + date + ']: ' + msg + '&#xA;');
        },
        onModuleSelected: function(module) {
        	var mpp = FE.modulePropPageRegistry[module.mname];
        	this.module_prop_panel.widget.append(mpp);
        },

    };
};