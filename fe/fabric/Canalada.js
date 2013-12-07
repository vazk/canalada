
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

Canalada.selectState = {
    item: null
};

Canalada.actorClassRegistry = {};
Canalada.actors = [];
Canalada.links = [];

Canalada.addActor = function(actor) {
    this.actors.push(actor);
    var shadow = {
        color: 'rgba(0,0,0,0.6)',
        blur: 20,    
        offsetX: 4,
        offsetY: 4,
        opacity: 0.3,
        fillShadow: true, 
        strokeShadow: true 
    };
    actor.actorRect.setShadow(shadow);
    Canalada.canvas.add(actor);
}

Canalada.addLink = function(link) {
    this.links.push(link);
    var shadow = {
        color: 'rgba(0,0,0,0.6)',
        blur: 20,    
        offsetX: 4,
        offsetY: 4,
        opacity: 0.3,
        fillShadow: true, 
        strokeShadow: true 
    };
    link.setShadow(shadow);
    Canalada.canvas.add(link);
}

Canalada.removeActor = function(actor) {
    var si = Canalada.actors.indexOf(actor);
    if(~si) {
        Canalada.actors.splice(si,1);
        Canalada.canvas.remove(actor);
        var attachedLinks = [];
        for(var i = 0; i < Canalada.links.length; ++i) {
            var lnk = Canalada.links[i];
            if(lnk.porta.actor === actor || lnk.portb.actor === actor) {
                attachedLinks.push(lnk);
            }
        }
        for(var i = 0; i < attachedLinks.length; ++i) {
            Canalada.removeLink(attachedLinks[i]);
        }
    }
}

Canalada.removeLink = function(link) {
    var si = Canalada.links.indexOf(link);
    if(~si) {
        Canalada.links.splice(si,1);
        Canalada.canvas.remove(link);
        link.porta.select(false);
        link.portb.select(false);
    }
}




Canalada.onKeyDown = function(e) {
    if((e.keyCode == 8 || e.keyCode == 46) && Canalada.selectState.item) {
        if(Canalada.selectState.item.ctype == 'Actor') {
            Canalada.removeActor(Canalada.selectState.item);
        } else
        if(Canalada.selectState.item.ctype == 'Link') {
            Canalada.removeLink(Canalada.selectState.item);
        }
        Canalada.canvas.remove(Canalada.selectState.item);
        Canalada.selectState.item = null;
        Canalada.canvas.renderAll();
    }
}

Canalada.onMouseDown = function(e) {
    if(Canalada.selectState.item) {
        Canalada.selectState.item.select(false);
        Canalada.selectState.item = null;
    }
    if(e.target) {
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
            Canalada.selectState.item = e.target;
        } else
        if(e.target.ctype == 'Link') {
            e.target.select(true);
            e.target.bringToFront();
            Canalada.selectState.item = e.target;
        }
    }
    Canalada.canvas.renderAll();
};

Canalada.onMouseUp = function(e) {
    if(e.target === undefined) {
        return;
    }
    if(Canalada.linkState.down) {
        if(Canalada.linkState.tport) {
            var lnk = new Canalada.Link(Canalada.linkState.sport, Canalada.linkState.tport);
            Canalada.addLink(lnk);
        } else {
            Canalada.linkState.sport.select(false);
        }
        Canalada.canvas.remove(Canalada.linkState.line);
        Canalada.canvas.remove(Canalada.linkState.marker);
        Canalada.linkState.marker = null;
        Canalada.linkState.line = null;
        Canalada.linkState.down = false;
        Canalada.linkState.sport = null;
        Canalada.linkState.tport = null;
    }

    Canalada.canvas.renderAll();
};

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
    } else 
    if(e.target.ctype && e.target.ctype === 'Actor') {
        for(var i = 0; i < Canalada.links.length; ++i) {
            var lnk = Canalada.links[i];
            if(lnk.porta.actor === e.target || lnk.portb.actor === e.target) {
                lnk.setup();
            }
        }
        Canalada.canvas.renderAll();
    }
}

Canalada.textWidth = function(text, fontProp) {
    var tag = document.createElement("div");
    tag.style.position = "absolute";
    tag.style.whiteSpace = "nowrap";
    tag.style.font = fontProp;
    tag.innerHTML = text;

    document.body.appendChild(tag);

    var result = tag.clientWidth;

    document.body.removeChild(tag);
    
    return result;
}

Canalada.reset = function() {
    Canalada.canvas.clear();
    Canalada.actors = [];
    Canalada.links = [];
    Canalada.linkState.down = false;
    Canalada.marker = null;
    Canalada.line = null;
    Canalada.selectState.item = null;
    Canalada.canvas.renderAll();

}

Canalada.serialize = function() {
    var actors = [];
    for(var i = 0; i < Canalada.actors.length; ++i) {
        var actorData = {};
        actorData["model"] = Canalada.actors[i].model();
        actorData["properties"] = Canalada.actors[i].serialize();
        actors.push(actorData);
    }
    var links = [];
    for(var i = 0; i < Canalada.links.length; ++i) {
        links.push(Canalada.links[i].serialize());
    }
    return {
              "actors" : actors,
              "links"  : links
           };
}


Canalada.deserialize = function(data) {
    var actors = data.actors;
    if(actors) {
        for(var i = 0; i < actors.length; ++i) {
            var modelName = actors[i].model;
            var modelProps = actors[i].properties;
            var model = Canalada.actorClassRegistry[modelName];
            if(model && modelProps) {
                var inst = new model();
                inst.left = modelProps.left;
                inst.top = modelProps.top;
                Canalada.addActor(inst);
            }
        }
    }
    var links = data.links;
    if(links) {
        for(var i = 0; i < links.length; ++i) {
            var lnk = new Canalada.Link();
            lnk.deserialize(links[i]);
            Canalada.addLink(lnk);  
        }
    }
}


Canalada.registerActorClass = function(actorModel, actorClass) {
    actorClass.model = actorModel;
    Canalada.actorClassRegistry[actorModel] = actorClass;
}

Canalada.save = function() {
    Canalada.socket.emit('requestSaveCanal', {name: 'trololo', canal: Canalada.serialize()}); 
    console.log("save function is called");
}

Canalada.open = function() {
    Canalada.reset();
    Canalada.socket.emit('requestReadCanal', {name: 'trololo'}); 
    console.log("open function is called");
}

Canalada.onOpenData = function(cdata) {
    console.log("open function is called, data: " + JSON.stringify(cdata.canal));
    Canalada.canvas.loadFromJSON(Canalada.deserialize(cdata.canal));
}