
Canalada = {};

Canalada.onMouseDown = function(e) {
    if(e.target === undefined) {
        return;
    }
    if(e.target.ctype === 'ActorView') {
        objects = e.target.getObjects();
        var center = e.target.getCenterPoint()
        for(var i = objects.length; i--; ) {
            var pt = {x:e.e.offsetX - center.x, y:e.e.offsetY - center.y};
            if(objects[i] && objects[i].containsPoint(pt)) {
                objects[i].setStroke('#ad2e3a');
                break;
            }
        }
    } else {
        e.target.setStroke('#ad2e3a');
    }
    Canalada.canvas.renderAll();
};


Canalada.onMouseUp = function(e) {
    if(e.target === undefined) {
        return;
    }
    if(e.target.ctype === 'ActorView') {
        objects = e.target.getObjects();
        var center = e.target.getCenterPoint()
        for(var i = objects.length; i--; ) {
            var pt = {x:e.e.offsetX - center.x, y:e.e.offsetY - center.y};
            if(objects[i] && objects[i].containsPoint(pt)) {
                objects[i].setStroke('#30407a');
                break;
            }
        }
    } else {
        e.target.setStroke('#30407a');
    }
    Canalada.canvas.renderAll();
};

Canalada.onObjectSelected = function(e) {
    var activeObject = e.target;
    if (activeObject.name == "p0" || activeObject.name == "p2") {
        activeObject.line2.animate('opacity', '1', {
            duration: 200,
            onChange: Canalada.canvas.renderAll.bind(Canalada.canvas),
        });
        activeObject.line2.selectable = true;
    }
}

Canalada.onObjectMoving = function(e) {
    if (e.target.name == "p0" || e.target.name == "p2") {
        var p = e.target;
        if (p.line1) {
            p.line1.path[0][1] = p.left;
            p.line1.path[0][2] = p.top;
        } else
        if (p.line3) {
            p.line3.path[1][3] = p.left;
            p.line3.path[1][4] = p.top;
        }
  } else if (e.target.name == "p1") {
    var p = e.target;

        if (p.line2) {
            p.line2.path[1][1] = p.left;
            p.line2.path[1][2] = p.top;
        }
    } else
    if (e.target.name == "p0" || e.target.name == "p2") {
        var p = e.target;
        p.line1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
        p.line2 && p.line2.set({ 'x1': p.left, 'y1': p.top });
        p.line3 && p.line3.set({ 'x1': p.left, 'y1': p.top });
        p.line4 && p.line4.set({ 'x1': p.left, 'y1': p.top });
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
    tag.style.left = "-999em";
    tag.style.whiteSpace = "nowrap";
    tag.style.font = fontProp;
    tag.innerHTML = text;

    document.body.appendChild(tag);

    var result = tag.clientWidth;

    document.body.removeChild(tag);

    return result;
}

