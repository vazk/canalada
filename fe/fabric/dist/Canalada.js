
Canalada = {};

Canalada.mouseState = {
    x:0,
    y:0,
    down:false,
    marker:null,
    line:null
};





Canalada.onMouseDown = function(e) {
    if(e.target === undefined) {
        return;
    }
    if(e.target.ctype === 'Actor') {
        var p = e.target.getSelectedItem({x:e.e.offsetX, y:e.e.offsetY});
        if(p) {
            p.setStroke('#ad2e3a');
            if(p.ctype === 'InPort' || p.ctype === 'OutPort') {
                /*var mouse = Canalada.canvas.getPointer(e.e);
                Canalada.mouseState.down = true;
                Canalada.mouseState.x = mouse.x;
                Canalada.mouseState.y = mouse.y;
                //var lnk = new Canalada.Link();
                var ln = new fabric.Line({strokeDashArray: [5, 5],
                                          stroke: 'black'});
                var endpt = new fabric.Circle({
                        radius: 10, fill: 'green', left:
                        Canalada.mouseState.x1, top: Canalada.mouseState.y1});
                ln.x1 = Canalada.mouseState.x;
                ln.y1 = Canalada.mouseState.y;
                Canalada.canvas.add(ln);
                Canalada.canvas.add(endpt);
                Canalada.mouseState.marker = endpt;
                //e.target = endpt;
                Canalada.canvas.setActiveObject(endpt);*/
            }
        }
    } else {
        e.target.setStroke('#ad2e3a');
    }
    Canalada.canvas.renderAll();
};

Canalada.onMouseUp = function(e) {
    if(Canalada.mouseState.down) {
        Canalada.canvas.remove(Canalada.mouseState.marker);
        Canalada.canvas.remove(Canalada.mouseState.line);
        Canalada.mouseState.marker = null;
        Canalada.mouseState.line = null;
        Canalada.mouseState.down = false;
    }
    if(e.target === undefined) {
        return;
    }
    if(e.target.ctype === 'Actor') {
        var p = e.target.getSelectedItem({x:e.e.offsetX, y:e.e.offsetY});
        if(p) p.setStroke('#444');
    } else {
        e.target.setStroke('#30407a');
    }
    Canalada.canvas.renderAll();
};

Canalada.onObjectSelected = function(e) {
    //var activeObject = e.target;
    //if(activeObject.type === 'circle') {
    //Canalada.canvas.deactivateAll();
    //}
    /*
    if (activeObject.name == "p0" || activeObject.name == "p2") {
        activeObject.line2.animate('opacity', '1', {
            duration: 200,
            onChange: Canalada.canvas.renderAll.bind(Canalada.canvas),
        });
        activeObject.line2.selectable = true;
    }
    */
}

Canalada.onObjectMoving = function(e) {
    if(e.target === Canalada.mouseState.marker) {
        var center = Canalada.mouseState.marker.getCenterPoint();
        Canalada.mouseState.line.x2 = center.x;
        Canalada.mouseState.line.y2 = center.y;
        Canalada.mouseState.line._setWidthHeight();
        Canalada.canvas.renderAll();
    }
}

Canalada.onBeforeSlectionCleared = function(e) {
    var activeObject = e.target;
    if (activeObject.name == "p0" || activeObject.name == "p2") {
        activeObject.line2.animate('opacity', '0', {
            duration: 200,
            onChange: Canalada.canvas.renderAll.bind(Canalada.canvas),
        });
        activeObject.line2.selectable = false;
    } else
    if (activeObject.name == "p1") {
        activeObject.animate('opacity', '0', {
            duration: 200,
            onChange: Canalada.canvas.renderAll.bind(Canalada.canvas),
        });
        activeObject.selectable = false;
    }
}


Canalada.textWidth = function(text, fontProp) {
    var tag = document.createElement("div");
    tag.style.position = "absolute";
    //tag.style.left = "-999em";
    tag.style.whiteSpace = "nowrap";
    tag.style.font = fontProp;
    tag.innerHTML = text;

    document.body.appendChild(tag);

    var result = tag.clientWidth;

    document.body.removeChild(tag);

    return result;
}

