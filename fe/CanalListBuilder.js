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
    var model = Canalada.actorClassRegistry[modelName];
    if(model) {
        var inst = new model();
        var offset = {x: ui.position.left + ui.helper.width()/2,
                      y: ui.position.top + ui.helper.height()/2};
        inst.setPositionByOrigin(offset,'center','center');
        Canalada.addActor(inst);
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
        if(!contextCanal.actor_panel.minimized) {
            showActorPanel();
        }
        // show the toolbar
        contextCanal.actor_panel.toolbar.show();
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

function onActorPanelDrag(event, ui) {
    var position = $(event.target).parent().position();
    contextCanal.actor_panel.top = position.top;
    contextCanal.actor_panel.left = position.left;
}

function onActorPanelMinimize(event, ui) {
    console.log('minimize');
    contextCanal.actor_panel.minimized = true;
}

function onActorPanelUnminimize(event, ui) {
    console.log('unminimize');
    contextCanal.actor_panel.minimized = false;
    showActorPanel();
}

function onSaveBtnClick(event) {
        event.stopPropagation();
        console.log('canalhead save span!');
        //$(this).prev('span').find('input:radio').prop('checked', true);
};

function onResetBtnClick(event) {
        event.stopPropagation();
        console.log('canalhead reset span!');
        //$(this).prev('span').find('input:radio').prop('checked', true);
};

function onActiveBtnClick(event) {
        event.stopPropagation();
        console.log('canalhead active span!');
        //$(this).prev('span').find('input:radio').prop('checked', true);
};


function showActorPanel() {
    contextCanal.actor_panel.widget.dialog('open');
    contextCanal.actor_panel.widget.parent().css({'display':' block', 
                                  'top': contextCanal.actor_panel.top, 
                                  'left': contextCanal.actor_panel.left});
    contextCanal.actor_panel.widget.parent().find("*").show();
}

function showCtrlRightBlock(flag) {
    var rblock = contextCanal.header.find('.ctrl_right_block');
    if(flag) {
        rblock.show();//css({'display':'block'});
    } else {
        rblock.hide();//css({'display':'none'});
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
                  "       <div id=\"actor-panel-widget\" title=\"Actor Library\" display=\"none\"> </div>" +
                  "       <div id=\"toolbar\">&nbsp;&nbsp;&nbsp;</div>" + 
                  "   </div>" + 
                  "  </section>" + 
                  "</div>" + 
                  "</div>";
                
    var row_content = $(content);
    $('#canal-rows').append(row_content);

    // create the data to be associated with canal
    var newCanal = { 
        id: loadedCanals.length,
        header: row_content.find('canalhead'),
        workspace: row_content.find('#workspace'),
        actor_panel: {
            top: 5, left: 5, minimized: false,
            widget: row_content.find('#actor-panel-widget'),
            library: $('#library').clone(),
            toolbar: row_content.find('#toolbar'),
        },
        canalscheme: $('#canal-scheme'),
        canalcontent: {},
    };
    // add it to the list
    loadedCanals.push(newCanal);
    // and to the element itself
    row_content.data('canalData', newCanal);

    var stop = false;
    newCanal.actor_panel.library.find('h3').click(function( event ) {
                          if(stop) {
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            stop = false;
                          }
                        });
    newCanal.actor_panel.library.accordion({
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
    // setup the actor-panel widget
    newCanal.actor_panel.widget.dialog({width: '120px', minimize: newCanal.actor_panel.toolbar, 
                 autoOpen:false, maximize: false, close: false, 
                 drag: onActorPanelDrag,
                 beforeMinimize: onActorPanelMinimize,
                 beforeUnminimize: onActorPanelUnminimize,
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
    // set additional styles
    var ap_parent = newCanal.actor_panel.widget.parent();
    newCanal.actor_panel.widget.css({'padding': '0px 0px',
                                     'margin': '0px, 0px, 0px, 0px'
                                    });
    ap_parent.find('.ui-dialog-titlebar').css({'font-size': '0.6em', 
                                               'line-height': '0.9em',
                                                'padding': '0px, 0px',
                                                'margin': '0px, 0px, 0px, 0px'
                                              });
    ap_parent.find('.ui-dialog-titlebar-minimize').css({'right':'0.3em'});

    // set the drag callbacks on actor-panel icons
    newCanal.actor_panel.library.find('img').draggable({
                        helper: 'clone',
                        appendTo: newCanal.canalscheme,
                        scroll: false,
                        zIndex: 100000,
                        containment: newCanal.canalscheme,
                        start: function( event, ui ) { 
                            console.log('drag start: ', event.target.attributes.ctype);
                        }
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
    newCanal.actor_panel.library.appendTo(newCanal.actor_panel.widget);
    newCanal.actor_panel.widget.parent().appendTo(newCanal.workspace);

    // refresh all
    $("#canal-rows").accordion("refresh");
}
