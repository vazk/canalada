FE.Canal = function(canalName, canalId, cnlElem){
	return {
	    name: canalName,
        id: canalId,
        is_enabled: false,
        selected_module: undefined,

        /////////////////////////////////////////////////////
        // caching some of the controls for faster/      ////
        // convenient access...                          ////
        /////////////////////////////////////////////////////
        row: cnlElem,
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
            if(module === this.selected_module) {
                return;
            }
        	// if selected_module is not undef, save the parameters
            if(this.selected_module !== undefined) {
                var mparray = this.module_prop_panel.widget.find('.mpp');
                for(var i = 0; i < mparray.length; ++i) {
                    var si = mparray[i].className.indexOf('mpp-');
                    if(si == -1) continue;
                    var ei = mparray[i].className.indexOf(' ', si);
                    if(ei == -1) ei = mparray[i].className.length;
                    var mparam = mparray[i].className.substring(si,ei);
                    
                    var mvalue = $('.'+mparam).val();
                    this.selected_module.parameters[mparam] = mvalue;
                    //console.log('mparam: ', mparam, ' value: ', $('.'+mparam).val());

                    //var mptmp = mparray[i].className.split(' ');
                    //for(var j = 0; j < mptmp.length; ++j) {
                    //}
                }
            }
            // reset the property page
            this.module_prop_panel.widget.empty();
            // now if the new one is set -> load the parameters
            if(module !== undefined) {
                // set the new page
                var mppage = FE.modulePropPageRegistry[module.mname].clone();
                this.module_prop_panel.widget.append(mppage);
                // set the new module as selected
                this.selected_module = module;
                for(var mparam in module.parameters) {
                    var inp = this.module_prop_panel.widget.find('.'+mparam);
                    inp.val(module.parameters[mparam]);
                }
                /*
                this.module_prop_panel.widget.find('.mpp');
                for(var i = 0; i < mparray.length; ++i) {
                    var si = mparray[i].className.indexOf('mpp-');
                    if(si == -1) continue;
                    var ei = mparray[i].className.indexOf(' ', si);
                    if(ei == -1) ei = mparray[i].className.length;
                    var mparam = mparray[i].className.substring(si,ei);
                    if (mparam in this.selected_module.parameters) {
                        $('.'+mparam).val() = this.selected_module.parameters[mparam];
                    }
                   
                }
                */
            	
            }
        },
        onModuleDeleted: function(module) {
            this.module_prop_panel.widget.empty();//html("<div>");
        }
    };
};