var contextCanal = undefined;
var loadedCanals = [];

function onCanalToBeSelected(event, ui) {
    /*
    var a = $(this);
    var b = ui.newHeader.length;
    var c = ui.newPanel.length;
    var d = ui.oldHeader.length;
    var e = ui.oldPanel.length;
    */
    // keep the old data first (if exists)
    if(contextCanal) {
        showCtrlRightBlock(false);
        contextCanal.canalcontent = Canalada.serialize();
        Canalada.reset();
    }
    if(ui.newPanel.length != 0) {

        ui.newHeader.css({'background-color':'#CBCBC1'});

        // find and set the right context
        var row_content = $(ui.newPanel).parent();
        contextCanal = row_content.data('canalData');
        contextCanal.canalscheme.appendTo(contextCanal.workspace);
        // load the content back
        Canalada.deserialize(contextCanal.canalcontent);
    }
    if(ui.oldPanel.length != 0) {
        ui.oldHeader.css({'background-color':'#E5E5E0'});    
    }
}

function onCanalSelected(event, ui) {
    if(ui.newPanel.length != 0) {
        showCtrlRightBlock(true);
        Canalada.canvas.calcOffset();
        Canalada.canvas.renderAll();
    }
}

function onCanalSchemeDrop(event, ui) {
    var modelName = event.toElement.attributes.ctype.nodeValue;
    console.log('dropped: ', modelName);
    var model = Canalada.moduleClassRegistry[modelName];
    if(model) {
        var inst = new model();
        var offset = {x: ui.position.left + ui.helper.width()/2,
                      y: ui.position.top + ui.helper.height()/2};
        inst.setPositionByOrigin(offset,'center','center');
        Canalada.addModule(inst);
    }
}

function onCanalTabSelected() {
    var self = $(this);
    // check if the tab is already active and return if so...
    if(self.hasClass('active')) {
        return;
    }
    var parentContent = self.closest('.canal-row-content');
    parentContent.find('ul.tabs li').removeClass('active');
    self.addClass('active')
    parentContent.find('.block div').hide();
    var activeTabRef = self.find('a').attr('href');
    var activeTab = parentContent.find(activeTabRef);
    
    activeTab.show();

    if(activeTabRef == '#workspace') {
        activeTab.resize();
        if(!contextCanal.module_lib_panel.minimized) {
            showModuleLibraryPanel();
        }
        if(!contextCanal.module_prop_panel.minimized) {
            showModulePropertiesPanel();
        }
        // show the toolbar
        contextCanal.toolbar.show();
        // get the canvas element, add it to the active tab, and show
        contextCanal.canalscheme.show(); 
        contextCanal.canalscheme.find("*").show();
        Canalada.canvas.calcOffset();
        Canalada.canvas.renderAll();
    } 
    return false;
}

function onCanalWorkspaceResize(event) {
    var self = $(event.currentTarget);//$(this);
    var parent = self.closest('.ui-accordion-content');
    var oHeight = parent.height();//parent.innerHeight();
    self.height(oHeight-self[0].offsetTop);

    //var ratio = PIXEL_RATIO;
    var htmlcanvas = $('canvas');
    htmlcanvas.height(self.height());
    htmlcanvas.width(self.width());
    /*
    htmlcanvas.css({'height': self.height()-4 + 'px',
                    'width': self.width()-4 + 'px'});
    htmlcanvas[0].getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    */

    Canalada.canvas.setWidth(self.width()-4);
    Canalada.canvas.setHeight(self.height()-4);
    Canalada.canvas.calcOffset();
}

function workspaceResize(wWidth, wHeight, tOffset, pHeight) {
    contextCanal.workspace.height(pHeight-tOffset);

    //var ratio = PIXEL_RATIO;
    var htmlcanvas = $('canvas');
    htmlcanvas.width(wWidth);
    htmlcanvas.height(wHeight);
    
    Canalada.canvas.setWidth(wWidth-4);
    Canalada.canvas.setHeight(wHeight-4);
    Canalada.canvas.calcOffset();
}


function onModuleLibraryPanelDrag(event, ui) {
    var position = $(event.target).parent().position();
    contextCanal.module_lib_panel.top = position.top;
    contextCanal.module_lib_panel.left = position.left;
}

function onModuleLibraryPanelMinimize(event, ui) {
    console.log('minimize');
    contextCanal.module_lib_panel.minimized = true;
}

function onModuleLibraryPanelUnminimize(event, ui) {
    console.log('unminimize');
    contextCanal.module_lib_panel.minimized = false;
    showModuleLibraryPanel();
}

function onModulePropertiesPanelDrag(event, ui) {
    var position = $(event.target).parent().position();
    contextCanal.module_prop_panel.top = position.top;
    contextCanal.module_prop_panel.left = position.left;
}

function onModulePropertiesPanelMinimize(event, ui) {
    console.log('minimize');
    contextCanal.module_prop_panel.minimized = true;
}

function onModulePropertiesPanelUnminimize(event, ui) {
    console.log('unminimize');
    contextCanal.module_prop_panel.minimized = false;
    showModulePropertiesPanel();
}

function onSaveBtnClick(event, ui) {
    event.stopPropagation();
    contextCanal.canalcontent = Canalada.serialize();
    Canalada.socket.emit('requestSaveCanal', {
                 name: contextCanal.name,
                 id: contextCanal.id,
                 content: contextCanal.canalcontent,
                 /*
                 lib_panel: {
                         top: contextCanal.module_lib_panel.top,
                         left: contextCanal.module_lib_panel.left,
                         minimized: contextCanal.module_lib_panel.minimized,
                     },
                 prop_panel: {
                         top: contextCanal.module_prop_panel.top,
                         left: contextCanal.module_prop_panel.left,
                         minimized: contextCanal.module_prop_panel.minimized,
                     },
                 */
                 workspace: {
                         width: contextCanal.workspace.width(),
                         height: contextCanal.workspace.height(),
                         toffset: contextCanal.workspace[0].offsetTop,
                         pheight: contextCanal.workspace.closest('.ui-accordion-content').height(),
                     }
                });
    console.log('canal save request sent!');
};

function onResetBtnClick(event) {
    event.stopPropagation();
    Canalada.socket.emit('requestLoadCanal',
                         {id: contextCanal.id});
    console.log('canal load request sent!');
};


function onActiveBtnClick(event) {
        event.stopPropagation();
        console.log('canalhead active span!');
};

function onCanalLoaded(cdata) {
    var canal = contextCanal;
    canal.name = cdata.name;
    canal.canalcontent = cdata.content;
    /*
    canal.module_lib_panel.top = cdata.lib_panel.top;
    canal.module_lib_panel.left = cdata.lib_panel.left;
    canal.module_lib_panel.minimized = cdata.lib_panel.minimized;
    canal.module_prop_panel.top = cdata.prop_panel.top;
    canal.module_prop_panel.left = cdata.prop_panel.left;
    canal.module_prop_panel.minimized = cdata.prop_panel.minimized;
    */
    var wWidth = cdata.workspace.width;
    var wHeight = cdata.workspace.height;
    var tOffset = cdata.workspace.toffset;
    var pHeight = cdata.workspace.pheight;
    console.log('canal data loaded!');
    
    workspaceResize(wWidth, wHeight, tOffset, pHeight);
    Canalada.deserialize(canal.canalcontent);   
    onCanalTabSelected();
}

function showModuleLibraryPanel() {
    contextCanal.module_lib_panel.widget.dialog('open');
    contextCanal.module_lib_panel.widget.parent().css({'display':' block', 
                                  'top': contextCanal.module_lib_panel.top, 
                                  'left': contextCanal.module_lib_panel.left});
    contextCanal.module_lib_panel.widget.parent().find("*").show();
}

function showModulePropertiesPanel() {
    contextCanal.module_prop_panel.widget.dialog('open');
    contextCanal.module_prop_panel.widget.parent().css({'display':' block', 
                                  'top': contextCanal.module_prop_panel.top, 
                                  'left': contextCanal.module_prop_panel.left});
    contextCanal.module_prop_panel.widget.parent().find("*").show();
}

function showCtrlRightBlock(flag) {
    var rblock = contextCanal.header.find('.ctrl_right_block');
    if(flag) {
        rblock.show();
    } else {
        rblock.hide();
    }
}












function buildCanals() {
    var stop = false;
    $("#canal-rows a").click(function(event) {
        if (stop) {
            event.stopImmediatePropagation();
            event.preventDefault();
            stop = false;
        }
    });
    $("#canal-rows").accordion({
            header: "> div > canalhead",
            icons: false,
            collapsible: true,
            active: false,
            heightStyle: "content",
            beforeActivate: onCanalToBeSelected,
            activate: onCanalSelected,
        })
        .sortable({
            axis: "y",
            handle: "a.handle",
            stop: function() {
                stop = true;
                Canalada.canvas.calcOffset();
            }
        });


    // support drop on the canvas
    $('#canal-scheme').droppable({
        accept: 'img',
        drop: onCanalSchemeDrop,
    });
}


function createCanalRow() {
    var content = "<div>" +
                  "<canalhead>" + 
                      "<div class=\"info_left_block\">"+
                          "<a href=\"#\" class=\"handle\">Section 1 </a>" + 
                      "</div>" +
                      "<div class=\"ctrl_right_block\">"+
                        "<span class=\"btn\" onclick=\"onSaveBtnClick(event)\">Save</span>" + 
                        "<span class=\"btn\" onclick=\"onResetBtnClick(event)\">Reset</span>" + 
                      "</div>" +
                      "<div class=\"ctrl_state_block\">"+
                        "<span class=\"indicator\" onclick=\"onActiveBtnClick(event)\">active</span>" + 
                      "</div>" +
                  "</canalhead>" +
                  "<div class=\"canal-row-content\">" + 
                  " <ul class=\"tabs\">" + 
                  "   <li><a href=\"#properties\">Properties</a></li>" + 
                  "   <li><a href=\"#workspace\">Scheme</a></li>" + 
                  " </ul>" + 
                  " <div class=\"clr\"></div>" + 
                  " <section class=\"block\">" + 
                  "   <div id=\"properties\">" + 
                  "     <p>Lorem, nunc.</p>" + 
                  "   </div>" + 
                  "   <div id=\"workspace\">" + 
                  "       <div id=\"module-library-widget\" title=\"Library\" display=\"none\"> </div>" +
                  "       <div id=\"module-properties-widget\" title=\"Properties\" display=\"none\"> </div>" +
                  "       <div id=\"toolbar\">&nbsp;&nbsp;&nbsp;</div>" + 
                  "   </div>" + 
                  "  </section>" + 
                  "</div>" + 
                  "</div>";
                
    var row_content = $(content);
    $('#canal-rows').append(row_content);

    // create the data to be associated with canal
    var newCanal = { 
        name: 'dummy',
        id: loadedCanals.length,
        header: row_content.find('canalhead'),
        workspace: row_content.find('#workspace'),
        module_lib_panel: {
            top: 5, left: 5, minimized: false,
            widget: row_content.find('#module-library-widget'),
            library: $('#library').clone(),
        },
        module_prop_panel: {
            top: 15, left: 15, minimized: false,
            widget: row_content.find('#module-properties-widget'),
        },
        toolbar: row_content.find('#toolbar'),
        canalscheme: $('#canal-scheme'),
        canalcontent: {},
    };
    // add it to the list
    loadedCanals.push(newCanal);
    // and to the element itself
    row_content.data('canalData', newCanal);

    var stop = false;
    newCanal.module_lib_panel.library.find('h3').click(function( event ) {
                          if(stop) {
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            stop = false;
                          }
                        });
    newCanal.module_lib_panel.library.accordion({
                        header: '> div > h3',
                        collapsible: true,
                        heightStyle: 'content',
                        activate: function() {
                          console.log('activate');
                        }
                   })
                   .sortable({
                        axis: 'y',
                        handle: 'h3',
                        stop: function() {
                          stop = true;
                        },
                        update: function() {
                        }
                   });

    // set the drag callbacks on module-lib-panel icons
    newCanal.module_lib_panel.library.find('img').draggable({
                        helper: 'clone',
                        appendTo: newCanal.canalscheme,
                        scroll: false,
                        zIndex: 100000,
                        containment: newCanal.canalscheme,
                        start: function( event, ui ) { 
                            console.log('drag start: ', event.target.attributes.ctype);
                        }
                    });


    // setup the module-panel widget
    newCanal.module_lib_panel.widget.dialog({width: '120px', minimize: newCanal.toolbar, 
                 autoOpen:false, maximize: false, close: false, 
                 drag: onModuleLibraryPanelDrag,
                 beforeMinimize: onModuleLibraryPanelMinimize,
                 beforeUnminimize: onModuleLibraryPanelUnminimize,
            })
            .parent().resizable({ 
                        // Settings that will execute when resized.
                        maxHeight: 380,
                        minHeight: 170,
                        maxWidth: 180,
                        minWidth: 100,
                        handles: 'n, e, s, w',
                        containment: newCanal.workspace // Constrains the resizing to the div.
                      })
                     .draggable({ 
                        // Settings that execute when the dialog is dragged. If parent isn't 
                        // used the text content will have dragging enabled.
                        containment: newCanal.workspace, // The element the dialog is constrained to.
                        opacity: 0.7
                     });


    // setup the module-panel widget
    newCanal.module_prop_panel.widget.dialog({width: '160px', minimize: newCanal.toolbar, 
                 autoOpen:false, maximize: false, close: false, 
                 drag: onModulePropertiesPanelDrag,
                 beforeMinimize: onModulePropertiesPanelMinimize,
                 beforeUnminimize: onModulePropertiesPanelUnminimize,
            })
            .parent().resizable({ 
                        // Settings that will execute when resized.
                        maxHeight: 800,
                        minHeight: 100,
                        maxWidth: 800,
                        minWidth: 100,
                        handles: 'n, e, s, w',
                        containment: newCanal.workspace // Constrains the resizing to the div.
                      })
                     .draggable({ 
                        // Settings that execute when the dialog is dragged. If parent isn't 
                        // used the text content will have dragging enabled.
                        containment: newCanal.workspace, // The element the dialog is constrained to.
                        opacity: 0.7
                     });



    // setup the on-resize callback
    newCanal.workspace.resize(onCanalWorkspaceResize);
    // and hide the workspace for now
    newCanal.workspace.hide();

    // setup the control
    row_content.find('ul.tabs li:first').addClass('active');
    row_content.find('.block div').hide();
    row_content.find('.block div:first').show();
    row_content.find('ul.tabs li').click(onCanalTabSelected);
    row_content.find(".canal-row-content").resizable({
        maxHeight: 600,
        minHeight: 300,
        handles: 's',
        resize: function (ev, ui) {
            var content = $(this);
            newCanal.workspace.resize();
        }
    });

    // finalize the dialog widget and add it to the workspace
    newCanal.module_lib_panel.library.appendTo(newCanal.module_lib_panel.widget);
    newCanal.module_lib_panel.widget.parent().appendTo(newCanal.workspace);

    var content = jQuery("<div>").load('installed_modules/EmailClient/property_page.html', 
                                       function() {
                                            console.log("content loaded!");
                                       });
    content.appendTo(newCanal.module_prop_panel.widget);
    newCanal.module_prop_panel.widget.parent().appendTo(newCanal.workspace);

    // refresh all
    $("#canal-rows").accordion("refresh");
}
