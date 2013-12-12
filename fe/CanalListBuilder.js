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
    ////////////////////////////////////////////////////////////////
    ///  This is a special section for the last one that's used 
    ///  for creating the new canal row
    ////////////////////////////////////////////////////////////////
}

function createCanalRow() {
    var content = "</div>" +
                  "    <a href=\"#\" class=\"handle\">Section 1</a>" +
                  "    <div class=\"canal-row-content\">" + 
                  "      <label for=\"name\">Name</label>" + 
                  "      <input type=\"text\" class=\"name\" required>" + 
                  "    </div>" +
                  "</div>"

    var row_div = document.createElement('div');
    row_div.innerHTML = content;
    $("#canal-rows").append(row_div);
    $("#canal-rows").accordion("refresh");

}
