var contextCanal = undefined;
var loadedCanals = [];

function onCanalToBeSelected(event, ui) {
    var a = $(this);
    var b = ui.newHeader.length;
    var c = ui.newPanel.length;
    var d = ui.oldHeader.length;
    var e = ui.oldPanel.length;

    if(ui.newPanel.length != 0) {
        var row_content = $(ui.newPanel).parent();
        contextCanal = row_content.data('canalData');
        var canalschemeD = $('#canal-scheme');   
        var workspaceD = ui.newPanel.find('#workspace');
        canalschemeD.appendTo(workspaceD);
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
        if(!contextCanal.dialog.minimized) {
            showLibraryDialog();
        }
        // show the toolbar
        contextCanal.dialog.toolbar.show();
        // get the canvas element, add it to the active tab, and show
        var canalschemeD = $('#canal-scheme');  
        canalschemeD.show(); 
        canalschemeD.find("*").show();
        //var canvasD = $('canvas');   
        //canvasD.appendTo(activeTab);
        //canalschemeD.css({'display':'block'});
        //canvasD.css({'display':'block'});
        // resize the activeTab
        //activeTab.resize();
        var a = contextCanal.dialog.widget;
        var b = a.parent();//.minimize();
    } 
    return false;
}

function onCanalWorkspaceResize() {
    var self = $(this);
    var parent = self.closest('.ui-accordion-content');
    var oHeight = parent.innerHeight();
    var tabs = parent.find('.tabs');
    self.height(oHeight-tabs.height()-3);

    $('canvas').height(self.height()-4);
    $('canvas').width(self.width()-4);
    Canalada.canvas.setWidth(self.width-4);
    Canalada.canvas.setHeight(self.height-4);
    Canalada.canvas.calcOffset();

    var a = $('#canal-scheme').height();
}

function onDialogLDrag(event, ui) {
    var position = $(event.target).parent().position();
    contextCanal.dialog.top = position.top;
    contextCanal.dialog.left = position.left;
}

function onDialogMinimize(event, ui) {
    console.log('minimize');
    contextCanal.dialog.minimized = true;
}

function onDialogUnminimize(event, ui) {
    console.log('unminimize');
    contextCanal.dialog.minimized = false;
    showLibraryDialog();
}

function showLibraryDialog() {
    contextCanal.dialog.widget.dialog('open');
    contextCanal.dialog.widget.parent().css({'display':' block', 
                                  'top': contextCanal.dialog.top, 
                                  'left': contextCanal.dialog.left});
    contextCanal.dialog.widget.parent().find("*").show();
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
            header: "> div > a",
            icons: false,
            collapsible: true,
            active: false,
            heightStyle: "content",
            beforeActivate: onCanalToBeSelected
        })
        .sortable({
            axis: "y",
            handle: "a.handle",
            stop: function() {
                stop = true;
            }
        });

}


function createCanalRow() {
    var content = "<div>" +
                  "<a href=\"#\" class=\"handle\" height=10px>Section 1</a>" + 
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
                  //"       <div id=\"canal\" tabindex=\"1\">" + 
                  //"           <canvas id=\"canal-canvas\" style=\"z-index: 1\"></canvas>" + 
                  //"       </div> " + 
                  "       <div id=\"dialogL\" title=\"Actor Library\" display=\"none\"> </div>" +
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
        workspace: row_content.find('#workspace'),
        dialog:{
            top:5, left:5, minimized:false,
            widget:row_content.find('#dialogL'),
            library:$('#library').clone(),
            toolbar:row_content.find('#toolbar'),
        },
    };
    // add it to the list
    loadedCanals.push(newCanal);
    // and to the element itself
    row_content.data('canalData', newCanal);

    var stop = false;
    newCanal.dialog.library.find('h3').click(function( event ) {
                          if(stop) {
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            stop = false;
                          }
                        });
    newCanal.dialog.library.accordion({
                        header: '> div > h3',
                        collapsible: true,
                        heightStyle: 'content',
                        activate: function() {
                          console.log('activate');
                          //alert(ui.newHeader.text());  // For instance.
                        }
                   })
                   .sortable({
                        axis: 'y',
                        handle: 'h3',
                        stop: function() {
                          stop = true;
                        },
                        update: function() {
                          //alert( $(this).sortable('serialize') );
                        }
                   });



    newCanal.dialog.widget.dialog({width: '150px', minimize: newCanal.dialog.toolbar, 
                 autoOpen:false, maximize: false, close: false, 
                 drag: onDialogLDrag,
                 beforeMinimize: onDialogMinimize,
                 beforeUnminimize: onDialogUnminimize,
            })
            .parent().resizable({ 
                        // Settings that will execute when resized.
                        maxHeight: 380,
                        minHeight: 170,
                        maxWidth: 180,
                        minWidth: 140,
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
    newCanal.dialog.library.appendTo(newCanal.dialog.widget);
    newCanal.dialog.widget.parent().appendTo(newCanal.workspace);

    // refresh all
    $("#canal-rows").accordion("refresh");
}
