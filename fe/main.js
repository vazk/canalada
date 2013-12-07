main = {};

main.resize = function() {
    var topDiv = document.getElementById('top-workspace');
    var bottomDiv = document.getElementById('bottom-workspace');
    var canvasDiv = document.getElementById('canal');
    var canvasSelf = document.getElementById('canal-canvas');

    var clientHeight = $(document).innerHeight();
    var topHeight = $("#top-workspace").outerHeight(true);
    var bottomHeight = clientHeight-topHeight-5;
    $('#bottom-workspace').offset({'top':topHeight});
    $('#bottom-workspace').height(bottomHeight);

    var canvasWidth = $("#bottom-workspace").innerWidth();
    var canvasHeight = bottomHeight;
    console.log(canvasHeight);

    canvasDiv.style.position = "absolute";
    //canvasDiv.style.left = 160 + 'px';
    canvasDiv.style.width = canvasWidth + 'px';
    canvasDiv.style.height = canvasHeight - 1 + 'px';
    canvasSelf.style.top = 0;
    canvasSelf.style.left = 0;
    Canalada.canvas.setWidth(canvasWidth);
    Canalada.canvas.setHeight(canvasHeight-1);
    Canalada.canvas.calcOffset();

};

function loadLibraries(library) {
    function handleDragStart(e) {
        ctype = e.target.getAttribute('ctype');
        e.dataTransfer.setData("module", ctype);
        return true;
    }
    
    for(var category in library) {
        if(!library.hasOwnProperty(category)){continue;}
       
        var accordion_div = document.getElementById('library');
       
        var library_div = document.createElement('div');
        library_div.setAttribute('id','library_'+category);
        var caption_h3 = document.createElement('h3');
        caption_h3.innerHTML = '<a href="#">' + category + '</a>';
       
        var body_ul = document.createElement('ul');
        body_ul.setAttribute('id','grid');
       

        for(var index in library[category]) {
            var module = library[category][index];
            var module_li = document.createElement('li');
            var module_icon = document.createElement('img');
            module_icon.setAttribute('src', module['src']);
            module_icon.setAttribute('ctype', module.info['module']);
            module_icon.addEventListener('dragstart', handleDragStart, false);
            //module_icon.addEventListener('dragend', function(e){console.log("end")}, false);
            module_li.appendChild(module_icon);
            body_ul.appendChild(module_li);
        }
        
        library_div.appendChild(caption_h3);
        library_div.appendChild(body_ul);
        accordion_div.appendChild(library_div);
    }
    buildLibraryAccordion();
}

function buildLibraryAccordion() {
    var stop = false;
    $("#library h3").click(function( event ) {
                          if(stop) {
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            stop = false;
                          }
                        });
    $("#library").accordion({
                       header: "> div > h3"
                   })
                   .sortable({
                       axis: "y",
                       handle: "h3",
                       stop: function() {
                         stop = true;
                       },
                       update: function() {
                         alert( $(this).sortable('serialize') );
                       }
                   });
    $('#dialogL')
        .dialog({width: '155px', minimize: '#toolbar', maximize: false, close: false})
        .parent().resizable({ 
                    // Settings that will execute when resized.
                    maxHeight: 380,
                    minHeight: 230,
                    maxWidth: 155,
                    minWidth: 155,
                    handles: 's',
                    containment: "#bottom-workspace" // Constrains the resizing to the div.
                  })
                 .draggable({ 
                    // Settings that execute when the dialog is dragged. If parent isn't 
                    // used the text content will have dragging enabled.
                    containment: "#bottom-workspace", // The element the dialog is constrained to.
                    opacity: 0.70 // Fancy opacity. Optional.
                 });
    
    var maxBorderCellHeight = 450;
    var minBorderCellHeight = 100;
    $("#top-workspace").resizable({
      maxHeight: maxBorderCellHeight,
      minHeight: minBorderCellHeight,
      handles: 's',
      resize: function (event, ui){
          main.resize();
      }
    });
}

function setupDragDrop() {

    
    function handleKeyDown(e) {
        Canalada.onKeyDown(e);
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }
    
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        return false;
    }
    
    function handleDrop(e) {
        var modelName = e.dataTransfer.getData("module");
        var model = Canalada.actorClassRegistry[modelName];
        if(model) {
            var inst = new model();
            inst.setPositionByOrigin({x:e.offsetX,y:e.offsetY},'center','center');
            Canalada.addActor(inst);
        }
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        return false;
    }
    
    function handleDragLeave(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        return false;
    }
    
    function handleDragEnter(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
        return false;
    }

    // Bind the event listeners for the canvas
    var canvasContainer = document.getElementById('canal');
    canvasContainer.addEventListener('dragenter', handleDragEnter, false);
    canvasContainer.addEventListener('dragover',  handleDragOver, false);
    canvasContainer.addEventListener('dragleave', handleDragLeave, false);
    canvasContainer.addEventListener('drop',      handleDrop, false);
    canvasContainer.addEventListener('keydown',   handleKeyDown, false);
}
    
    
function setupCanvas() {
    Canalada.canvas = new fabric.Canvas('canal-canvas', { backgroundColor:'#fff' });
    Canalada.canvas.selection = false;
    Canalada.canvas.findTarget = (function(originalFn) {
        return function() {
            var target = originalFn.apply(this, arguments);
            var e = arguments[0];
            if(target == null || e.type !== 'mousedown')
                return target;
            
            if(target.ctype === 'Actor') {
                var p = target.getSelectedItem({x:e.offsetX, y:e.offsetY});
                if(p && (p.ctype === 'InPort' || p.ctype === 'OutPort')) {
                    var portCenter = p.getCenterPoint();
                    var actorCenter = target.getCenterPoint();
                    Canalada.linkState.x = portCenter.x + actorCenter.x;//mouse.x;
                    Canalada.linkState.y = portCenter.y + actorCenter.y;//mouse.y;
                    Canalada.linkState.sport = p;
                    var endpt = new fabric.Circle({
                                    radius: 3,
                                    left: Canalada.linkState.x,
                                    top: Canalada.linkState.y,
                                    stroke: '#444',
                                    hasBorders : false,
                                    hasControls : false});
                    var ln = new fabric.Line(
                                    [Canalada.linkState.x,
                                     Canalada.linkState.y,
                                     Canalada.linkState.x,
                                     Canalada.linkState.y],
                                    {
                                        strokeDashArray: [5, 5],
                                        stroke: '#444',
                                        strokeWidth: 2,
                                        hasBorders: false,
                                        hasControls: false
                                    });
                    Canalada.canvas.add(endpt);
                    Canalada.canvas.add(ln);
                    Canalada.linkState.marker = endpt;
                    Canalada.linkState.line = ln;
                    return Canalada.linkState.marker;
                }
            }
            return target;
        };
    })(Canalada.canvas.findTarget);
}


function setupSocket()
{
    var serverBaseUrl = document.domain;
    /* 
    On client init, try to connect to the socket.IO server.
    Note we don't specify a port since we set up our server
    to run on port 8080
    */
    Canalada.socket = io.connect(serverBaseUrl);

    //We'll save our session ID in a variable for later
    var sessionId = '';
    /*
    When the client successfuly connects to the server, an
    event "connect" is emitted. Let's get the session ID and
    log it.
    */
    Canalada.socket.on('connect', function () {
        sessionId = Canalada.socket.socket.sessionid;
        console.log('Connected ' + sessionId);  

        //socket.emit('requestSaveCanal', {name: 'blabla', canal: {pam: 'parampampam'}}); 
        //socket.emit('requestReadCanal', {name: 'blabla'}); 
    });
    Canalada.socket.on('responseReadCanal', function(cdata) {
        Canalada.onOpenData(cdata);
        console.log(cdata);
    });
}

function start()
{
    window.addEventListener('resize', main.resize, false);

    var library = {image:
        [
         {'src':'image/Disk.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'FileWriter'}},
         {'src':'image/Folder.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'FileReader'}},
         {'src':'image/Mail-2.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'EmailClient'}},
         {'src':'image/Mobile.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'DropboxWriter'}},
         {'src':'image/PaperClip.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'DropboxReader'}},
         {'src':'image/Rss.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'YoutubeDownloader'}},
         {'src':'image/Lock.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'MediaConverter'}}
        ]
    };

    buildCanals();
    
    loadLibraries(library);
    
    setupDragDrop();
    
    setupCanvas();
    
    setupSocket();
    
    Canalada.canvas.on({
        'object:moving'           : Canalada.onObjectMoving,
        'mouse:up'                : Canalada.onMouseUp,
        'mouse:down'              	: Canalada.onMouseDown
    });
    main.resize();
}
