InstalledModules = {
    library : {},
    numModules: 0,
    numCallBacks: 0,
    checkLoadComplete: function() {
        if(this.numModules * 2 == this.numCallBacks) {
            loadLibraries(this.library);
        }
    },
    register: function(modName, sublibName) {
        var context = this;
        var sublib = context.library[sublibName];
        if(sublib === undefined) {
            sublib = [];
            context.library[sublibName] = sublib;
        }
        context.numModules++;
        $.ajax({
            url: '../installed_modules/' + modName + '/Properties.js', 
            success: function(data){
                var props = eval(data);
                props.icon = '../installed_modules/' + modName + '/' + props.icon;
                props.module = modName;
                sublib.push(props);
                context.numCallBacks++;
                context.checkLoadComplete();
            },
            dataType: "text"
        });
        $.ajax({
            url: '../installed_modules/' + modName + '/IO.js', 
            success: function(data){
                var io = eval(data);
                FE.registerModuleClass(modName, io);
                context.numCallBacks++;
                context.checkLoadComplete();
            },
            dataType: "text"
        });
        $.ajax({
            url: '../installed_modules/' + modName + '/property_page.html', 
            success: function(data){
                FE.registerModulePropertyPage(modName, data);
            }
        });
    },

};


InstalledModules.register('EmailClient', 'comm');
InstalledModules.register('FileReader', 'database');
InstalledModules.register('FileWriter', 'database');

