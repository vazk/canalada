

var CanalManager = 
{
    context: undefined,
    canals: [],
    newCanalId: -1,
    defaultDock: $('#default-dock'),

    setContextCanal: function(canal) {
        if(canal === undefined) {
            // attach the scheme to the invisible default dock before removing it
            this.context.scheme.appendTo(this.defaultDock);
            this.context = undefined;        
        } else {
            this.context = canal;
            this.context.scheme.appendTo(this.context.workspace);
            $(this.context.scheme).droppable({
                accept: 'img',
                drop: onCanalSchemeDrop,
            });
        }
    }
};

function onCanalToBeSelected(event, ui) {
    /*
    var a = $(this);
    var b = ui.newHeader.length;
    var c = ui.newPanel.length;
    var d = ui.oldHeader.length;
    var e = ui.oldPanel.length;
    */
    // keep the old data first (if exists)
    if(CanalManager.context) {
        showControls(false);
        CanalManager.context.content = FE.serialize();
        FE.reset();
        CanalManager.setContextCanal();
    }
    if(ui.newPanel.length != 0) {

        ui.newHeader.css({'background-color':'#CBCBC1'});

        // find and set the right context
        var row_content = $(ui.newPanel).parent();

        var newContext = row_content.data('canalData');
        CanalManager.setContextCanal(newContext);
        // load the content back
        FE.deserialize(CanalManager.context.content);
    }
    if(ui.oldPanel.length != 0) {
        ui.oldHeader.css({'background-color':'#E5E5E0'});    
    }
}

function onCanalSelected(event, ui) {
    if(ui.newPanel.length != 0) {
        onCanalWorkspaceResize();
        showControls(true);
        FE.canvas.calcOffset();
        FE.canvas.renderAll();
    }
}

function onCanalSchemeDrop(event, ui) {
    var modelName = event.toElement.attributes.ctype.nodeValue;
    console.log('dropped: ', modelName);
    var model = FE.moduleClassRegistry[modelName];
    if(model) {
        var inst = new model();
        var offset = {x: ui.position.left + ui.helper.width()/2,
                      y: ui.position.top + ui.helper.height()/2};
        inst.setPositionByOrigin(offset,'center','center');
        FE.addModule(inst);
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

    if(activeTabRef == '#canal-workspace') {
        activeTab.resize();
        if(!CanalManager.context.module_prop_panel.minimized) {
            showModulePropertiesPanel();
        }
        if(!CanalManager.context.module_lib_panel.minimized) {
            showModuleLibraryPanel();
        }
        // show the toolbar
        CanalManager.context.toolbar.show();
        // get the canvas element, add it to the active tab, and show
        CanalManager.context.scheme.show(); 
        CanalManager.context.scheme.find("*").show();
        FE.canvas.calcOffset();
        FE.canvas.renderAll();
    } 
    return false;
}

function onCanalWorkspaceResize(event) {

    var self = event ? $(event.target) : $(CanalManager.context.row.find('.canal-row-content'));
    var b = self[0]; // this is the div
    var c = $(b).children('ul.tabs')[0];
    var d = $(b).find('section.block')[0];

    var newWidth = self.width()-8;
    var newHeight = b.clientHeight-d.offsetTop - 8;
    CanalManager.context.log.css({'width': newWidth, 'height': newHeight});
    CanalManager.context.scheme.css({'width': newWidth, 'height': newHeight});
    FE.canvas.setWidth(newWidth);
    FE.canvas.setHeight(newHeight);


    if( window.devicePixelRatio !== 1 ){
 
        var c = FE.canvas.getElement(); // canvas = fabric.Canvas
        var w = c.width, h = c.height;
        // Scale the canvas up by two for retina
        // just like for an image
        c.setAttribute('width', w*window.devicePixelRatio);
        c.setAttribute('height', h*window.devicePixelRatio);
        // then use css to bring it back to regular size
        // or set it here
        //    c.setAttribute('style', 'width="'+w+'"; height="'+h+'";')
        // or jQuery  $(c).css('width', w);
        //      $(c).css('width', w);
        //      $(c).css('height', h);
        // finally set the scale of the context
        c.getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
        FE.canvas.renderAll();
    }


    FE.canvas.calcOffset();
}

function workspaceResize(wWidth, wHeight, tOffset, pHeight) {
    CanalManager.context.workspace.height(pHeight-tOffset);

    //var ratio = PIXEL_RATIO;
    var htmlcanvas = $('canvas');
    htmlcanvas.width(wWidth);
    htmlcanvas.height(wHeight);
    
    FE.canvas.setWidth(wWidth-4);
    FE.canvas.setHeight(wHeight-4);
    FE.canvas.calcOffset();
}


function onModuleLibraryPanelDrag(event, ui) {
    var position = $(event.target).parent().position();
    CanalManager.context.module_lib_panel.top = position.top;
    CanalManager.context.module_lib_panel.left = position.left;
}

function onModuleLibraryPanelMinimize(event, ui) {
    console.log('minimize');
    CanalManager.context.module_lib_panel.minimized = true;
}

function onModuleLibraryPanelUnminimize(event, ui) {
    console.log('unminimize');
    CanalManager.context.module_lib_panel.minimized = false;
    showModuleLibraryPanel();
}

function onModulePropertiesPanelDrag(event, ui) {
    var position = $(event.target).parent().position();
    CanalManager.context.module_prop_panel.top = position.top;
    CanalManager.context.module_prop_panel.left = position.left;
}

function onModulePropertiesPanelMinimize(event, ui) {
    console.log('minimize');
    CanalManager.context.module_prop_panel.minimized = true;
}

function onModulePropertiesPanelUnminimize(event, ui) {
    console.log('unminimize');
    CanalManager.context.module_prop_panel.minimized = false;
    showModulePropertiesPanel();
}

function onSaveBtnClick(event, ui) {
    event.stopPropagation();
    CanalManager.context.content = FE.serialize();
    FE.socket.emit('requestCanalSave', {
                 name: CanalManager.context.name,
                 id: CanalManager.context.id,
                 content: CanalManager.context.content,
                 /*
                 lib_panel: {
                         top: CanalManager.context.module_lib_panel.top,
                         left: CanalManager.context.module_lib_panel.left,
                         minimized: CanalManager.context.module_lib_panel.minimized,
                     },
                 prop_panel: {
                         top: CanalManager.context.module_prop_panel.top,
                         left: CanalManager.context.module_prop_panel.left,
                         minimized: CanalManager.context.module_prop_panel.minimized,
                     },
                 */
                 workspace: {
                         width: CanalManager.context.workspace.width(),
                         height: CanalManager.context.workspace.height(),
                         toffset: CanalManager.context.workspace[0].offsetTop,
                         pheight: CanalManager.context.workspace.closest('.ui-accordion-content').height(),
                     }
                });
    console.log('canal save request sent!');
};

function onReloadBtnClick(event) {
    event.stopPropagation();
    FE.socket.emit('requestCanalLoad',
                         {id: CanalManager.context.id});
    console.log('canal load request sent!');
};

function onDeleteBtnClick(event) {
    event.stopPropagation();

    //$("#canal-rows").accordion("option", "active", 0);

    FE.socket.emit('requestCanalDelete', {id: CanalManager.context.id});

    var accordionElem = CanalManager.context.row;
    FE.reset();
    // cleanup of the CanalManager instance
    var contextId = CanalManager.canals.indexOf(CanalManager.context);
    console.log('Deleting: ', contextId);
    CanalManager.canals.splice(contextId,1);
    CanalManager.setContextCanal();
    /*
    if(CanalManager.canals.length) {
        // setup the first element as a new context, attach the scheme before removal
        CanalManager.context.scheme.appendTo(CanalManager.canals[0].workspace);
        CanalManager.context = CanalManager.canals[0];

    } else {
        // attach the scheme to the invisible default dock before removing it
        CanalManager.context.scheme.appendTo($('#default-dock'));
        CanalManager.context = undefined;
    }
    */
    // delete the accordion element now
    accordionElem.fadeOut('fast', function(){
            $(this).remove();
        });



    // refresh all
    $("#canal-rows").accordion("refresh");

    console.log('canal delete request sent!');
    FE.syslog(FE.LOG.I, 'Canal is deleted.');
};



function onStateBtnClick(event) {
    event.stopPropagation();
    console.log('canalhead active span!');
    CanalManager.context.is_enabled = !CanalManager.context.is_enabled;
    var state_indicator = CanalManager.context.header.find('.state-indicator')[0];
    if(CanalManager.context.is_enabled) {
        state_indicator.innerText = "enabled";
    } else {
        state_indicator.innerText = "disabled";
    }
    FE.socket.emit('requestCanalEnable', {
                 id: CanalManager.context.id,
                 enable: CanalManager.context.is_enabled,
             });
};

function onCanalLoaded(cdata) {
    var canal = CanalManager.context;
    canal.name = cdata.name;
    canal.content = cdata.content;
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
    FE.syslog(FE.LOG.I, 'Canal is loaded.');

    
    workspaceResize(wWidth, wHeight, tOffset, pHeight);
    FE.deserialize(canal.content);   
    onCanalTabSelected();
}

function showModuleLibraryPanel() {
    CanalManager.context.module_lib_panel.widget.dialog('open');
    CanalManager.context.module_lib_panel.widget.parent().css({'display':' block', 
                                  'top': CanalManager.context.module_lib_panel.top, 
                                  'left': CanalManager.context.module_lib_panel.left});
    CanalManager.context.module_lib_panel.widget.parent().find("*").show();
}

function showModulePropertiesPanel() {
    CanalManager.context.module_prop_panel.widget.dialog('open');
    CanalManager.context.module_prop_panel.widget.parent().css({'display':' block', 
                                  'top': CanalManager.context.module_prop_panel.top, 
                                  'left': CanalManager.context.module_prop_panel.left});
    CanalManager.context.module_prop_panel.widget.parent().find("*").show();
}

function showControls(flag, canal) {
    if(canal === undefined) {
        canal = CanalManager.context;
    }
    if(canal) {
        var rblock = canal.header.find('.ctrl_right_block');
        var state_btn = canal.header.find('.state-btn');
        if(flag) {
            //state_btn.attr("disabled", true);
            state_btn.show();
            rblock.show();
        } else {
            //state_btn.attr("disabled", false);
            state_btn.hide();
            rblock.hide();
        }
    }
}











function createCanalRow() {
    var content = "<div>" +
                  "<canalhead>" + 
                      "<div class=\"info_left_block\">"+
                          "<a href=\"#\" class=\"handle\">Section 1 </a>" + 
                      "</div>" +
                      "<div class=\"ctrl_right_block\">"+
                        "<span class=\"btn\" onclick=\"onSaveBtnClick(event)\">Save</span>" + 
                        "<span class=\"btn\" onclick=\"onReloadBtnClick(event)\">Reload</span>" + 
                        "<span class=\"btn\" onclick=\"onDeleteBtnClick(event)\">Delete</span>" + 
                      "</div>" +
                      "<div class=\"ctrl_state_block\">"+
                        "<span class=\"indicator state-indicator\">disabled</span>" + 
                        "<span class=\"btn small-btn state-btn\" onclick=\"onStateBtnClick(event)\">Start</span>" + 
                      "</div>" +
                  "</canalhead>" +
                  "<div class=\"canal-row-content\">" + 
                  " <ul class=\"tabs\">" + 
                  "   <li><a href=\"#canal-log-pane\">Log</a></li>" + 
                  "   <li><a href=\"#canal-properties\">Properties</a></li>" + 
                  "   <li><a href=\"#canal-workspace\">Scheme</a></li>" + 
                  " </ul>" + 
                  " <div class=\"clr\"></div>" + 
                  " <section class=\"block\">" + 
                  "   <div id=\"canal-log-pane\">" + 
                  "       <textarea id=\"canal-log-textbox\"></textarea>" + 
                  "   </div>" + 
                  "   <div id=\"canal-properties\">" + 
                  "     <p>Lorem, nunc.</p>" + 
                  "   </div>" + 
                  "   <div id=\"canal-workspace\">" + 
                  "       <div id=\"module-properties-widget\" title=\"Properties\" display=\"none\"> </div>" +
                  "       <div id=\"module-library-widget\" title=\"Library\" display=\"none\"> </div>" +
                  "       <div id=\"toolbar\">&nbsp;&nbsp;&nbsp;</div>" + 
                  "   </div>" + 
                  "  </section>" + 
                  "</div>" + 
                  "</div>";
                
    var row_content = $(content);
    $('#canal-rows').append(row_content);

    var newCanal = new FE.Canal('dummy', CanalManager.newCanalId--, row_content);
    // add it to the list
    CanalManager.canals.push(newCanal);
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
                        appendTo: newCanal.scheme,
                        scroll: false,
                        zIndex: 100000,
                        containment: newCanal.scheme,
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
    //newCanal.workspace.resize(onCanalWorkspaceResize);
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
            onCanalWorkspaceResize(ev);
            //newCanal.workspace.resize();

        }
    });
    
    showControls(false, newCanal);

    // finalize the dialog widget and add it to the workspace
    var content = jQuery("<div>").load('installed_modules/EmailClient/property_page.html', 
                                       function() {
                                            console.log("content loaded!");
                                       });
    content.appendTo(newCanal.module_prop_panel.widget);
    newCanal.module_prop_panel.widget.parent().appendTo(newCanal.workspace);

    newCanal.module_lib_panel.library.appendTo(newCanal.module_lib_panel.widget);
    newCanal.module_lib_panel.widget.parent().appendTo(newCanal.workspace);

    // refresh all
    $("#canal-rows").accordion("refresh");
}




function buildCanals() {
    var stop = false;

    $('body').layout({
        minSize:                  100 // ALL panes
    ,   west__size:               200
    ,   stateManagement__enabled: true
    ,   center__childOptions: {
            minSize:              50  // ALL panes
        ,   south__size:          100
        }
    });

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
                FE.canvas.calcOffset();
            }
        });
}
