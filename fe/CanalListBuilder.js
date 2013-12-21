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
            active: false
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
                  "       <div id=\"canal\" tabindex=\"1\">" + 
                  "           <canvas id=\"canal-canvas\" style=\"z-index: 1\"></canvas>" + 
                  "       </div> " + 
                  "       <div id=\"dialogL\" title=\"Actor Library\" display=\"none\"> </div>" +
                  "       <div id=\"toolbar\"  style=\"z-index: 3\">&nbsp;&nbsp;&nbsp;</div>" + 
                  "   </div>" + 
                  "  </section>" + 
                  "</div>" + 
                  "</div>";
                

    /*
    var row_div = document.createElement('div');
    row_div.innerHTML = content;
    $("#canal-rows").append(row_div);
    var row_content = $(row_div);
    */

    var row_content = $(content);
    $("#canal-rows").append(row_content);

    var workspace = row_content.find('#workspace');
    var dialogL = row_content.find('#dialogL');   
    var toolbar = row_content.find('#toolbar');   

    dialogL.dialog({width: '155px', minimize: toolbar, 
                 autoOpen:false, maximize: false, close: false, 
            })
            .parent().resizable({ 
                        // Settings that will execute when resized.
                        maxHeight: 380,
                        minHeight: 230,
                        maxWidth: 155,
                        minWidth: 155,
                        handles: 's',
                        containment: workspace // Constrains the resizing to the div.
                      })
                     .draggable({ 
                        // Settings that execute when the dialog is dragged. If parent isn't 
                        // used the text content will have dragging enabled.
                        containment: workspace, // The element the dialog is constrained to.
                        opacity: 0.70 // Fancy opacity. Optional.
                     });




    workspace.resize(function(ev) {
        var self = $(this);
        var parent = self.closest('.ui-accordion-content');
        //var oWidth = parent.innerWidth();

        var oHeight = parent.innerHeight();
        //self.offset({'top':40});
        var tabs = parent.find('.tabs');
        self.height(oHeight-tabs.height() - 12);
        console.log("workspace h: " + parent.innerHeight());

        //self.find('#dialogL').dialog("option", "position");
    });
    workspace.hide();

    row_content.find('ul.tabs li:first').addClass('active');
    row_content.find('.block div').hide();
    row_content.find('.block div:first').show();

    row_content.find('ul.tabs li').click(function(){
            var self = $(this);
            var parentContent = self.closest('.canal-row-content');
            parentContent.find('ul.tabs li').removeClass('active');
            self.addClass('active')
            parentContent.find('.block div').hide();
            var activeTabRef = self.find('a').attr('href');
            var activeTab = parentContent.find(activeTabRef);
            
            activeTab.show();

            if(activeTabRef == '#workspace') {
                var dialogL = activeTab.find('#dialogL');   
                var toolbar = activeTab.find("#toolbar");
                dialogL.dialog('open');
                activeTab.resize();
                dialogL.parent().css({'display':' block', 'position': 'absolute', 'top': '5px', 'left': '50px'});
                dialogL.parent().find("*").show();
                toolbar.show();
            } 
            return false;
        });

    row_content.find(".canal-row-content").resizable({
        maxHeight: 600,
        minHeight: 200,
        handles: 's',
        resize: function (ev, ui) {
            var content = $(this);
            console.log("h: " + content.innerHeight());
            workspace.resize();
        }
    });
    dialogL.parent().appendTo(workspace);

    

    $("#canal-rows").accordion("refresh");
}
