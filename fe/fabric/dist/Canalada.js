
Canalada = {};

Canalada.linkState = {
    x:0,
    y:0,
    down:false,
    sport: null,
    tport: null,
    marker:null,
    line:null
};


Canalada.actors = [];

Canalada.addActor = function(actor) {
    this.actors.push(actor);
    Canalada.canvas.add(actor);
}

Canalada.onMouseDown = function(e) {
    if(e.target === undefined) {
        return;
    }
    if(Canalada.linkState.sport) {
        Canalada.linkState.sport.actor.bringToFront();
        Canalada.linkState.sport.select(true);
        Canalada.linkState.down = true;
        Canalada.linkState.marker.bringToFront();
        Canalada.linkState.line.bringToFront();
    } else
    if(e.target.ctype == 'Actor') {

        e.target.select(true);
        e.target.bringToFront();
    }
    Canalada.canvas.renderAll();
};

Canalada.onMouseUp = function(e) {
    if(e.target === undefined) {
        return;
    }
    if(Canalada.linkState.down) {
        if(Canalada.linkState.tport == null) {
            Canalada.canvas.remove(Canalada.linkState.line);
            Canalada.linkState.sport.select(false);
        }
        Canalada.canvas.remove(Canalada.linkState.marker);
        Canalada.linkState.marker = null;
        Canalada.linkState.line = null;
        Canalada.linkState.down = false;
        Canalada.linkState.sport = null;
        Canalada.linkState.tport = null;
    }
    if(e.target.select) {
        e.target.select(false);
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
    if(e.target === Canalada.linkState.marker) {
        var mouse = Canalada.linkState.marker.getCenterPoint();
        Canalada.linkState.line.x2 = mouse.x;
        Canalada.linkState.line.y2 = mouse.y;

        var mindist = 20;
        var candidate = null;
        var candidatept = null;

        actors = Canalada.actors;
        for(var i = 0; i < actors.length; ++i) {
            if(actors[i] === Canalada.linkState.sport.actor) {
                continue;
            }
            var acenter = actors[i].getCenterPoint();
            for(var j = 0; j < actors[i].ports.length; ++j) {
                var port = actors[i].ports[j];
                var pcenter = port.getCenterPoint();
                pcenter.x += acenter.x;
                pcenter.y += acenter.y;
                
                var dx = mouse.x - pcenter.x;
                var dy = mouse.y - pcenter.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                //if(objects[i] && objects[i].containsPoint(pt)) {
                //    pos.x = aobjects[i].x;
                //}
                if(dist < mindist) {
                    mindist = dist;
                    candidate = port;
                    candidatept = pcenter;
                }
            }

        }
        
        if(Canalada.linkState.tport) {
            Canalada.linkState.tport.select(false);
        }
        Canalada.linkState.tport = null;

        if(candidate) {
            Canalada.linkState.tport = candidate;
            Canalada.linkState.tport.select(true);
            Canalada.linkState.line.x2 = candidatept.x;
            Canalada.linkState.line.y2 = candidatept.y;
            Canalada.linkState.marker.setLeft(candidatept.x);
            Canalada.linkState.marker.setTop(candidatept.y);
        }

        Canalada.linkState.line._setWidthHeight();
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

