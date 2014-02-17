InstalledModules = {};


InstalledModules.register = function(module, library) {
    $.getJSON('../installed_modules/' + module + '/properties.json')
      .done(function(json) {
          json = eval(json);
          json.icon = '../installed_modules/' + module + '/' + json.icon;
          json.module = module;
          library.push(json);
      })
      .fail(function(jqxhr, textStatus, error) {});
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

