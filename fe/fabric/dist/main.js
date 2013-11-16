
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


function loadLibraries() {
 
    var library = {image: 
        [{"src":"image/Globe.png","info":{"title":"Globa","author":"vazkus","description":"globe bla."}}]
    };


    var lib_items = document.querySelectorAll('#lib_items_s1 itm');
    [].forEach.call(lib_items, function (itm) {
        img.addEventListener('dragstart', function(e){this.style.opacity = '0.4'}, false);
        img.addEventListener('dragend', function(e){}, false);
    });
    

    
    
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
    
    



function main()
{
    
    window.addEventListener('resize', resize, false);

    loadLibraries();
    
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
    
    var actA = new Canalada.Actor("FileWriter");
    actA.addInPort('blain1');
    actA.addInPort('blain2');
    actA.addInPort('blain3');
    actA.addOutPort('blaout1');
    actA.addOutPort('blaout2');
    actA.addOutPort('blaout3');
    actA.addOutPort('blaout4');
    actA.addOutPort('blaout5');

    var actB = new Canalada.Actor("FileReader");
    actB.addInPort('ain1');
    actB.addInPort('ain2');
    actB.addOutPort('aout1');

    actA.setup();
    actB.setup();
    Canalada.addActor(actA);
    Canalada.addActor(actB);
    Canalada.addActor(new Canalada.FileWriterActor())
    
    Canalada.canvas.on({
        'object:moving'           : Canalada.onObjectMoving,
        'mouse:up'                : Canalada.onMouseUp,
        'mouse:down'              	: Canalada.onMouseDown
    });
    resize();
}
