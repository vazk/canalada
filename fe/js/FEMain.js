main = {};

main.resize = function(outter) {


    return;/*
    var oWidth = outter.innerWidth();
    var oHeight = outter.innerHeight();
    console.log("h: " + oHeight);
    var workspaceDiv = $(outter).find('#workspace');
    workspaceDiv.height(oHeight);
    
    var canvasWidth = workspaceDiv.innerWidth();
    var canvasHeight = oHeight;

    //var canvasDiv = $(workspaceDiv).find('#canal');
    //var canvasSelf = $(workspaceDiv).find('#canal-canvas');
    var canvasDiv = outter.find('#canal');
    var canvasSelf = outter.find('#canal-canvas');


    canvasDiv.position("absolute");
    canvasDiv.width(canvasWidth + 'px');
    canvasDiv.height(canvasHeight - 1 + 'px');
    canvasSelf.offset({'left':0,'top':0});
    FE.canvas.setWidth(canvasWidth);
    FE.canvas.setHeight(canvasHeight-1);
    FE.canvas.calcOffset();


    /*
    var topDiv = document.getElementById('top-workspace');
    var bottomDiv = document.getElementById('bottom-workspace');
    var canvasDiv = document.getElementById('canal');
    var canvasSelf = document.getElementById('canal-canvas');

    var clientHeight = $(document).innerHeight();
    var topHeight = $("#top-workspace").outerHeight(true);
    var bottomHeight = clientHeight-topHeight-5;
    //$('#bottom-workspace').offset({'top':topHeight});
    //$('#bottom-workspace').height(bottomHeight);

    var canvasWidth = $("#bottom-workspace").innerWidth();
    var canvasHeight = bottomHeight;
    console.log(canvasHeight);

    canvasDiv.style.position = "absolute";
    //canvasDiv.style.left = 160 + 'px';
    canvasDiv.style.width = canvasWidth + 'px';
    canvasDiv.style.height = canvasHeight - 1 + 'px';
    canvasSelf.style.top = 0;
    canvasSelf.style.left = 0;
    FE.canvas.setWidth(canvasWidth);
    FE.canvas.setHeight(canvasHeight-1);
    FE.canvas.calcOffset();
    */

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
            module_icon.setAttribute('src', module.icon);
            module_icon.setAttribute('ctype', module.module);
            //module_icon.addEventListener('dragstart', handleDragStart, false);
            //module_icon.addEventListener('dragend', function(e){console.log("end")}, false);
            module_li.appendChild(module_icon);
            body_ul.appendChild(module_li);
        }
        
        library_div.appendChild(caption_h3);
        library_div.appendChild(body_ul);
        accordion_div.appendChild(library_div);
    }
}

function setupDragDrop() {
  
    function handleKeyDown(e) {
        FE.onKeyDown(e);
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }
    /*
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        return false;
    }
    
    function handleDrop(e) {
        var modelName = e.dataTransfer.getData("module");
        var model = FE.moduleClassRegistry[modelName];
        if(model) {
            var inst = new model();
            inst.setPositionByOrigin({x:e.offsetX,y:e.offsetY},'center','center');
            FE.addModule(inst);
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
    */
    var canvasContainer = document.getElementById('canal-scheme');
    /*
    canvasContainer.addEventListener('dragenter', handleDragEnter, false);
    canvasContainer.addEventListener('dragover',  handleDragOver, false);
    canvasContainer.addEventListener('dragleave', handleDragLeave, false);
    canvasContainer.addEventListener('drop',      handleDrop, false);
    */
    canvasContainer.addEventListener('keydown',   handleKeyDown, false);
}
    
    
function setupCanvas() {
    FE.canvas = new fabric.Canvas('canal-canvas', { backgroundColor:'#fff' });
    FE.canvas.selection = false;

    FE.canvas.findTarget = (function(originalFn) {
        return function() {
            var target = originalFn.apply(this, arguments);
            var e = arguments[0];
            if(!target || e.type != 'mousedown')
                return target;
            
            if(target.ctype === 'Module') {
                var p = target.getSelectedItem({x:e.offsetX, y:e.offsetY});
                if(p && (p.ctype === 'InPort' || p.ctype === 'OutPort')) {
                    var portCenter = p.getCenterPoint();
                    var moduleCenter = target.getCenterPoint();
                    FE.linkState.x = portCenter.x + moduleCenter.x;//mouse.x;
                    FE.linkState.y = portCenter.y + moduleCenter.y;//mouse.y;
                    FE.linkState.sport = p;
                    var endpt = new fabric.Circle({
                                    radius: 3,
                                    left: FE.linkState.x,
                                    top: FE.linkState.y,
                                    stroke: '#444',
                                    hasBorders : false,
                                    hasControls : false});
                    var ln = new fabric.Line(
                                    [FE.linkState.x,
                                     FE.linkState.y,
                                     FE.linkState.x,
                                     FE.linkState.y],
                                    {
                                        strokeDashArray: [5, 5],
                                        stroke: '#444',
                                        strokeWidth: 2,
                                        hasBorders: false,
                                        hasControls: false
                                    });
                    FE.canvas.add(endpt);
                    FE.canvas.add(ln);
                    FE.linkState.marker = endpt;
                    FE.linkState.line = ln;
                    return FE.linkState.marker;
                }
            }
            return target;
        };
    })(FE.canvas.findTarget);
}


function setupSocket()
{
    var serverBaseUrl = document.domain;
    /* 
    On client init, try to connect to the socket.IO server.
    Note we don't specify a port since we set up our server
    to run on port 8080
    */
    FE.socket = io.connect(serverBaseUrl);

    //We'll save our session ID in a variable for later
    var sessionId = '';
    /*
    When the client successfuly connects to the server, an
    event "connect" is emitted. Let's get the session ID and
    log it.
    */
    FE.socket.on('connect', function () {
        sessionId = FE.socket.socket.sessionid;
        console.log('Connected ' + sessionId);  

        //socket.emit('requestSaveCanal', {name: 'blabla', canal: {pam: 'parampampam'}}); 
        //socket.emit('requestLoadCanal', {name: 'blabla'}); 
    });
    FE.socket.on('responseCanalLoad', function(cdata) {
        //FE.onOpenData(cdata);
        //console.log(cdata);
        onCanalLoaded(cdata);
    });
    FE.socket.on('canalUpdate', function(cupdate) {
        //FE.onOpenData(cdata);
        //console.log(cdata);
        onCanalUpdate(cupdate);
    });
    FE.socket.on('systemUpdate', function(supdate) {
        //FE.onOpenData(cdata);
        //console.log(cdata);
        onSystemUpdate(supdate);
    });
}
/*
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();
*/
function start()
{
    window.addEventListener('resize', onCanalWorkspaceResize, false);

    buildCanals();
    
    //loadLibraries(InstalledModules.library);
    
    setupDragDrop();
    
    setupCanvas();
    
    setupSocket();
    
    FE.canvas.on({
        'object:moving'           : FE.onObjectMoving,
        'object:scaling'          : FE.preventLeaving,
        'mouse:up'                : FE.onMouseUp,
        'mouse:down'              : FE.onMouseDown
    });
    //main.resize();
}
