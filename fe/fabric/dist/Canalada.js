
Canalada = {};

Canalada.mouseState = {
    x:0,
    y:0,
    down:false,
    port: null,
    marker:null,
    line:null
};





Canalada.onMouseDown = function(e) {
    if(e.target === undefined || e.target.ctype === undefined) {
        return;
    }
    if(e.target.ctype === 'OutPort' || e.target.ctype === 'InPort') {
        Canalada.mouseState.port = e.target;
        Canalada.mouseState.port.actor.bringToFront();
        Canalada.mouseState.port.select(true);
        Canalada.mouseState.down = true;
        var marker = new fabric.Circle({
                                    radius: 3,
                                    left: Canalada.mouseState.x,
                                    top: Canalada.mouseState.y,
                                    stroke: '#444',
                                    hasBorders : false,
                                    hasControls : false});
        var ln = new fabric.Line([Canalada.mouseState.x,
                                  Canalada.mouseState.y,
                                  Canalada.mouseState.x,
                                  Canalada.mouseState.y],
                                  {
                                     strokeDashArray: [5, 5],
                                     stroke: '#444',
                                     strokeWidth: 2,
                                     hasBorders: false,
                                     hasControls: false
                                  });
        Canalada.canvas.add(marker);
        Canalada.canvas.add(ln);
        Canalada.mouseState.marker = marker;
        Canalada.mouseState.line = ln;

        Canalada.mouseState.port.bringToFront();
    } else
    if(e.target.ctype == 'Actor') {
        e.target.stroke = '#ad2e3a';
        e.target.bringToFront();
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
        Canalada.mouseState.port.select(false);
        Canalada.mouseState.port = null;
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

