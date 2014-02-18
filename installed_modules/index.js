InstalledModules = {};


InstalledModules.register = function(module, library) {

    $.ajax({
        url: '../installed_modules/' + module + '/Properties.js', 
        success: function(data){
            var props = eval(data);
            console.log('XXXXXX: ', props);
            props.icon = '../installed_modules/' + module + '/' + props.icon;
            props.module = module;
            library.push(props);
        },
        dataType: "text"
    });
    $.ajax({
        url: '../installed_modules/' + module + '/IO.js', 
        success: function(data){
            var io = eval(data);
            console.log('YYYYYY: ', io);
            FE.registerModuleClass(module, io);
        },
        dataType: "text"
    });
};

InstalledModules.library = { 
    comm: [],
    database: [],
    other: []
}

InstalledModules.register('EmailClient', InstalledModules.library.comm);

/*        [
         {'src':'batch/32x32/in.png',
          'info':{'author':'vazkus','description':'globe bla.','module':'FileWriter'}},
         {'src':'batch/32x32/out.png',
          'info':{'author':'vazkus','description':'globe bla.','module':'FileReader'}},
         InstalledModules.register('EmailClient'),
         /*{'src':'batch/32x32/@.png',
          'info':{'author':'vazkus','description':'globe bla.','module':'EmailClient'}},
         /*{'src':'batch/32x32/cloud-upload.png',
          'info':{'author':'vazkus','description':'globe bla.','module':'DropboxWriter'}},
         {'src':'batch/32x32/cloud-download.png',
          'info':{'author':'vazkus','description':'globe bla.','module':'DropboxReader'}},
         {'src':'batch/32x32/marquee-download.png',
          'info':{'author':'vazkus','description':'globe bla.','module':'YoutubeDownloader'}},
         {'src':'batch/32x32/repeat-2.png',
          'info':{'author':'vazkus','description':'globe bla.','module':'MediaConverter'}}
        ]
    };
*/

