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
   
    //$(".canal-row-content").append($('dialogL');


        
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
                  //"       <div id=\"toolbar\"  style=\"z-index: 3\">&nbsp;&nbsp;&nbsp;</div>" + 
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
                var dialogL = $('#dialogL');   
                dialogL.dialog('open');
                activeTab.resize();

                dialogL.parent().appendTo(activeTab);
                dialogL.parent().draggable('option', 'containment', activeTab);
                dialogL.parent().resizable('option', 'containment', activeTab);

                dialogL.parent().css({'display':' block', 'position': 'absolute', 'top': '55px', 'left': '250px'});
                dialogL.parent().find("*").show();
                //activeTab.find("#toolbar").show();

                

            } 
            return false;
        });

    row_content.find(".canal-row-content").resizable({
        maxHeight: 400,
        minHeight: 300,
        handles: 's',
        resize: function (ev, ui) {
            var content = $(this);
            console.log("h: " + content.innerHeight());
            workspace.resize();
        }
    });

    

    $("#canal-rows").accordion("refresh");
}
