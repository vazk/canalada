
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

Canalada.moduleClassRegistry = {};
Canalada.modules = [];
Canalada.links = [];

Canalada.addModule = function(module) {
    this.modules.push(module);
    var shadow = {
        color: 'rgba(0,0,0,0.6)',
        blur: 20,    
        offsetX: 4,
        offsetY: 4,
        opacity: 0.3,
        fillShadow: true, 
        strokeShadow: true 
    };
    //module.moduleRect.setShadow(shadow);
    Canalada.canvas.add(module);
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
    //link.setShadow(shadow);
    Canalada.canvas.add(link);
}

Canalada.removeModule = function(module) {
    var si = Canalada.modules.indexOf(module);
    if(~si) {
        Canalada.modules.splice(si,1);
        Canalada.canvas.remove(module);
        var attachedLinks = [];
        for(var i = 0; i < Canalada.links.length; ++i) {
            var lnk = Canalada.links[i];
            if(lnk.porta.module === module || lnk.portb.module === module) {
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
        if(Canalada.selectState.item.ctype == 'Module') {
            Canalada.removeModule(Canalada.selectState.item);
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
            Canalada.linkState.sport.module.bringToFront();
            Canalada.linkState.sport.select(true);
            Canalada.linkState.down = true;
            Canalada.linkState.marker.bringToFront();
            Canalada.linkState.line.bringToFront();
        } else
        if(e.target.ctype == 'Module') {
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

        modules = Canalada.modules;
        for(var i = 0; i < modules.length; ++i) {
            if(modules[i] === Canalada.linkState.sport.module) {
                continue;
            }
            var acenter = modules[i].getCenterPoint();
            for(var j = 0; j < modules[i].ports.length; ++j) {
                var port = modules[i].ports[j];
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
    if(e.target.ctype && e.target.ctype === 'Module') {
        for(var i = 0; i < Canalada.links.length; ++i) {
            var lnk = Canalada.links[i];
            if(lnk.porta.module === e.target || lnk.portb.module === e.target) {
                lnk.setup();
            }
        }
        Canalada.canvas.renderAll();
    }
    preventLeaving(e);
}

function preventLeaving(e) {
    var activeObject = e.target;
    if(activeObject.left - (activeObject.currentWidth/2) < 0) {
        activeObject.left = activeObject.currentWidth/2; 
    }
    if(activeObject.top - (activeObject.currentHeight/2) < 0) {
        activeObject.top = activeObject.currentHeight/2;
    }
    if(activeObject.left + (activeObject.currentWidth/2) > Canalada.canvas.getWidth()) {
        var positionX = Canalada.canvas.getWidth() - activeObject.currentWidth/2;
        activeObject.left = (positionX > Canalada.canvas.getWidth()/2) ? positionX : Canalada.canvas.getWidth()/2;
    }
    if(activeObject.top + (activeObject.currentHeight/2) > Canalada.canvas.getHeight()) {
        var positionY = Canalada.canvas.getHeight() - (activeObject.currentHeight/2);
        activeObject.top = (positionY > Canalada.canvas.getHeight()/2) ? positionY : Canalada.canvas.getHeight()/2;
    }

    if(activeObject.currentWidth > Canalada.canvas.getWidth()) {
        activeObject.scaleX = Canalada.canvas.getWidth() / activeObject.width;
    }
    if(activeObject.currentHeight > Canalada.canvas.getHeight()) {
        activeObject.scaleY = Canalada.canvas.getHeight() / activeObject.height;
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
    Canalada.modules = [];
    Canalada.links = [];
    Canalada.linkState.down = false;
    Canalada.marker = null;
    Canalada.line = null;
    Canalada.selectState.item = null;
    Canalada.canvas.renderAll();

}

Canalada.serialize = function() {
    var modules = [];
    for(var i = 0; i < Canalada.modules.length; ++i) {
        var moduleData = {};
        moduleData["model"] = Canalada.modules[i].model();
        moduleData["properties"] = Canalada.modules[i].serialize();
        modules.push(moduleData);
    }
    var links = [];
    for(var i = 0; i < Canalada.links.length; ++i) {
        links.push(Canalada.links[i].serialize());
    }
    return {
              "modules" : modules,
              "links"  : links
           };
}


Canalada.deserialize = function(data) {
    var modules = data.modules;
    if(modules) {
        for(var i = 0; i < modules.length; ++i) {
            var modelName = modules[i].model;
            var modelProps = modules[i].properties;
            var model = Canalada.moduleClassRegistry[modelName];
            if(model && modelProps) {
                var inst = new model();
                inst.left = modelProps.left;
                inst.top = modelProps.top;
                Canalada.addModule(inst);
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


Canalada.registerModuleClass = function(moduleModel, moduleClass) {
    moduleClass.model = moduleModel;
    Canalada.moduleClassRegistry[moduleModel] = moduleClass;
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