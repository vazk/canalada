
function resize() {
    var canvasDiv = document.getElementById('canal');
    var canvasSelf = document.getElementById('canal-canvas');
    var viewportWidth = window.innerWidth-180;
    var viewportHeight = window.innerHeight-20;
    canvasDiv.style.position = "fixed";
    canvasDiv.style.width = viewportWidth + 'px';
    canvasDiv.style.height = viewportHeight + 'px';
    canvasSelf.style.top = 0;
    canvasSelf.style.left = 0;
    Canalada.canvas.setWidth(viewportWidth);
    Canalada.canvas.setHeight(viewportHeight);
    Canalada.canvas.calcOffset();
};


function loadLibraries(library) {
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
            module_icon.setAttribute('ctype', module['module']);
            //module_icon.addEventListener('dragstart', function(e){console.log("start");}, false);
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
    $( "#library h3" ).click(function( event ) {
      if ( stop ) {
        event.stopImmediatePropagation();
        event.preventDefault();
        stop = false;
      }
    });
    $( "#library" )
      .accordion({
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
}

function setupDragDrop() {
    
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        return false;
    }
    
    function handleDrop(e) {
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
}
    
    
function setupCanvas() {
    Canalada.canvas = new fabric.Canvas('canal-canvas', { backgroundColor:'#fff' });
    
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


function main()
{
    window.addEventListener('resize', resize, false);

    var library = {image:
        [
         {'src':'image/Disk.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'FileWriter'}},
         {'src':'image/Folder.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'FileReader'}},
         {'src':'image/Mail-2.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'EmailReader'}},
         {'src':'image/Mobile.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'FileReader'}},
         {'src':'image/PaperClip.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'EmailReader'}},
         {'src':'image/Rss.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'FileReader'}},
         {'src':'image/Lock.png',
          'info':{'title':'Globe','author':'vazkus','description':'globe bla.','module':'EmailReader'}}
        ]
    };
    
    loadLibraries(library);
    
    setupDragDrop();
    
    setupCanvas();
    

    //Canalada.addActor(new Canalada.FileWriterActor());

    Canalada.addActor(new Canalada.actorClassRegistry['EmailClient']());
    
    Canalada.canvas.on({
        'object:moving'           : Canalada.onObjectMoving,
        'mouse:up'                : Canalada.onMouseUp,
        'mouse:down'              	: Canalada.onMouseDown
    });
    resize();
}
