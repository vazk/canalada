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
   
    $('ul.tabs li:first').addClass('active');
    $('.block div').hide();
    $('.block div:first').show();
    $('ul.tabs li').click(function(){
            $('ul.tabs li').removeClass('active');
            $(this).addClass('active')
            $('.block div').hide();
            var activeTabRef = $(this).find('a').attr('href');
            var activeTab = $(activeTabRef)
            
 
            activeTab.show();

            if(activeTabRef == '#workspace') {
                var dialogL = $('#dialogL');   
                dialogL.dialog('open');
                activeTab.resize();

                dialogL.parent().appendTo(activeTab);
                dialogL.parent().css({'display':' block', 'position': 'absolute', 'top': '55px', 'left': '250px'});
                dialogL.parent().find("*").show();
                activeTab.find("#toolbar").show();
            } 
            return false;
        });

    $(".canal-row-content").resizable({
        maxHeight: 400,
        minHeight: 100,
        handles: 's',
        resize: function (ev, ui) {
            var content = $(this);
            console.log("h: " + content.innerHeight());
            var workspace = $(this).find('#workspace');
            workspace.resize();
        }
    });

    //$(".canal-row-content").append($('dialogL');


        
}
/*
function createCanalRow() {
    var content = "    <a href=\"#\" class=\"handle\">Section 1</a>" +
                  "    <div class=\"canal-row-content\">" + 
                  "         <ul>" + 
                  "              <li>" + 
                  "                  <a href=\"#a\">Tab A</a>" + 
                  "              </li>" + 
                  "              <li>" + 
                  "                  <a href=\"#b\">Tab B</a>" + 
                  "              </li>" + 
                  "          </ul>" +
                  "          <div id=\"a\"> Content of A </div>" +
                  "          <div id=\"b\"> Content of B </div>" +
                  "    </div>";// +
    var row_div = document.createElement('div');
    row_div.innerHTML = content;
    $("#canal-rows").append(row_div);
    $("#canal-rows").accordion("refresh");
}
*/