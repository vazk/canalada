
FE = {};

FE.linkState = {
    x:0,
    y:0,
    down:false,
    sport: null,
    tport: null,
    marker:null,
    line:null
};

FE.selectState = {
    item: null
};

FE.moduleClassRegistry = {};
FE.modulePropPageRegistry = {};
FE.modules = [];
FE.links = [];





////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////     Canal-Canvas Editing API                               ////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
FE.addModule = function(module) {
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
    FE.canvas.add(module);
};

FE.addLink = function(link) {
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
    FE.canvas.add(link);
};

FE.removeModule = function(module) {
    var si = FE.modules.indexOf(module);
    if(~si) {
        FE.modules.splice(si,1);
        FE.canvas.remove(module);
        var attachedLinks = [];
        for(var i = 0; i < FE.links.length; ++i) {
            var lnk = FE.links[i];
            if(lnk.porta.module === module || lnk.portb.module === module) {
                attachedLinks.push(lnk);
            }
        }
        for(var i = 0; i < attachedLinks.length; ++i) {
            FE.removeLink(attachedLinks[i]);
        }
    }
};

FE.removeLink = function(link) {
    var si = FE.links.indexOf(link);
    if(~si) {
        FE.links.splice(si,1);
        FE.canvas.remove(link);
        link.porta.select(false);
        link.portb.select(false);
    }
};




////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////        Canvas Slots                                        ////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
FE.onKeyDown = function(e) {
    if((e.keyCode == 8 || e.keyCode == 46) && FE.selectState.item) {
        if(FE.selectState.item.ctype == 'Module') {
            FE.removeModule(FE.selectState.item);
        } else
        if(FE.selectState.item.ctype == 'Link') {
            FE.removeLink(FE.selectState.item);
        }
        FE.canvas.remove(FE.selectState.item);
        FE.selectState.item = null;
        FE.canvas.renderAll();
    }
};

FE.onMouseDown = function(e) {
    if(FE.selectState.item) {
        FE.selectState.item.select(false);
        FE.selectState.item = null;
    }
    if(e.target) {
        if(FE.linkState.sport) {
            FE.linkState.sport.module.bringToFront();
            FE.linkState.sport.select(true);
            FE.linkState.down = true;
            FE.linkState.marker.bringToFront();
            FE.linkState.line.bringToFront();
        } else
        if(e.target.ctype == 'Module') {
            e.target.select(true);
            e.target.bringToFront();
            FE.selectState.item = e.target;
            FE.onModuleSelected(e.target);
        } else
        if(e.target.ctype == 'Link') {
            e.target.select(true);
            e.target.bringToFront();
            FE.selectState.item = e.target;
        }
    }
    FE.canvas.renderAll();
};

FE.onMouseUp = function(e) {
    if(e.target === undefined) {
        return;
    }
    if(FE.linkState.down) {
        if(FE.linkState.tport) {
            var lnk = new FE.Link(FE.linkState.sport, FE.linkState.tport);
            FE.addLink(lnk);
        } else {
            FE.linkState.sport.select(false);
        }
        FE.canvas.remove(FE.linkState.line);
        FE.canvas.remove(FE.linkState.marker);
        FE.linkState.marker = null;
        FE.linkState.line = null;
        FE.linkState.down = false;
        FE.linkState.sport = null;
        FE.linkState.tport = null;
    }

    FE.canvas.renderAll();
};

FE.onObjectMoving = function(e) {
    if(e.target === FE.linkState.marker) {
        var mouse = FE.linkState.marker.getCenterPoint();
        FE.linkState.line.x2 = mouse.x;
        FE.linkState.line.y2 = mouse.y;

        var mindist = 20;
        var candidate = null;
        var candidatept = null;

        modules = FE.modules;
        for(var i = 0; i < modules.length; ++i) {
            if(modules[i] === FE.linkState.sport.module) {
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
        
        if(FE.linkState.tport) {
            FE.linkState.tport.select(false);
        }
        FE.linkState.tport = null;

        if(candidate) {
            FE.linkState.tport = candidate;
            FE.linkState.tport.select(true);
            FE.linkState.line.x2 = candidatept.x;
            FE.linkState.line.y2 = candidatept.y;
            FE.linkState.marker.setLeft(candidatept.x);
            FE.linkState.marker.setTop(candidatept.y);
        }

        FE.linkState.line._setWidthHeight();
        FE.canvas.renderAll();
    } else 
    if(e.target.ctype && e.target.ctype === 'Module') {
        for(var i = 0; i < FE.links.length; ++i) {
            var lnk = FE.links[i];
            if(lnk.porta.module === e.target || lnk.portb.module === e.target) {
                lnk.setup();
            }
        }
        FE.canvas.renderAll();
    }
    preventLeaving(e);
};

function preventLeaving(e) {
    var activeObject = e.target;
    if(activeObject.left - (activeObject.currentWidth/2) < 0) {
        activeObject.left = activeObject.currentWidth/2; 
    }
    if(activeObject.top - (activeObject.currentHeight/2) < 0) {
        activeObject.top = activeObject.currentHeight/2;
    }
    if(activeObject.left + (activeObject.currentWidth/2) > FE.canvas.getWidth()) {
        var positionX = FE.canvas.getWidth() - activeObject.currentWidth/2;
        activeObject.left = (positionX > FE.canvas.getWidth()/2) ? positionX : FE.canvas.getWidth()/2;
    }
    if(activeObject.top + (activeObject.currentHeight/2) > FE.canvas.getHeight()) {
        var positionY = FE.canvas.getHeight() - (activeObject.currentHeight/2);
        activeObject.top = (positionY > FE.canvas.getHeight()/2) ? positionY : FE.canvas.getHeight()/2;
    }

    if(activeObject.currentWidth > FE.canvas.getWidth()) {
        activeObject.scaleX = FE.canvas.getWidth() / activeObject.width;
    }
    if(activeObject.currentHeight > FE.canvas.getHeight()) {
        activeObject.scaleY = FE.canvas.getHeight() / activeObject.height;
    }
};

FE.textWidth = function(text, fontProp) {
    var tag = document.createElement("div");
    tag.style.position = "absolute";
    tag.style.whiteSpace = "nowrap";
    tag.style.font = fontProp;
    tag.innerHTML = text;

    document.body.appendChild(tag);

    var result = tag.clientWidth;

    document.body.removeChild(tag);
    
    return result;
};

FE.reset = function() {
    FE.canvas.clear();
    FE.modules = [];
    FE.links = [];
    FE.linkState.down = false;
    FE.marker = null;
    FE.line = null;
    FE.selectState.item = null;
    FE.canvas.renderAll();

};



////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////     Module and Property Registration                       ////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
FE.registerModuleClass = function(moduleName, moduleIO) {
    var moduleClass =  new fabric.util.createClass(FE.Module, {
        initialize: function() {
            this.callSuper('initialize', {'mname': moduleName});
            if(moduleIO.input !== undefined) {
                for(var i = 0, total = moduleIO.input.length; i < total; ++i) 
                    this.addInputPort(moduleIO.input[i]);
            }
            if(moduleIO.output !== undefined) {
                for(var i = 0, total = moduleIO.output.length; i < total; ++i) 
                    this.addOutputPort(moduleIO.output[i]); 
            }
            this.setup();
        }
    });

    moduleClass.model = moduleName;
    FE.moduleClassRegistry[moduleName] = moduleClass;
};

FE.registerModulePropertyPage = function(moduleName, modulePropPage) {
    var content = jQuery("<div>").append(modulePropPage);
    FE.modulePropPageRegistry[moduleName] = content;
}



////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////     Serialization / Deserialization                        ////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
FE.serialize = function() {
    var modules = [];
    for(var i = 0; i < FE.modules.length; ++i) {
        var moduleData = {};
        moduleData["model"] = FE.modules[i].model();
        moduleData["properties"] = FE.modules[i].serialize();
        modules.push(moduleData);
    }
    var links = [];
    for(var i = 0; i < FE.links.length; ++i) {
        links.push(FE.links[i].serialize());
    }
    return {
              "modules" : modules,
              "links"  : links
           };
};

FE.deserialize = function(data) {
    var modules = data.modules;
    if(modules) {
        for(var i = 0; i < modules.length; ++i) {
            var modelName = modules[i].model;
            var modelProps = modules[i].properties;
            var model = FE.moduleClassRegistry[modelName];
            if(model && modelProps) {
                var inst = new model();
                inst.left = modelProps.left;
                inst.top = modelProps.top;
                FE.addModule(inst);
            }
        }
    }
    var links = data.links;
    if(links) {
        for(var i = 0; i < links.length; ++i) {
            var lnk = new FE.Link();
            lnk.deserialize(links[i]);
            FE.addLink(lnk);  
        }
    }
};

FE.save = function() {
    FE.socket.emit('requestSaveCanal', {name: 'trololo', canal: FE.serialize()}); 
    console.log("save function is called");
};

FE.open = function() {
    FE.reset();
    FE.socket.emit('requestReadCanal', {name: 'trololo'}); 
    console.log("open function is called");
};

FE.onOpenData = function(cdata) {
    console.log("open function is called, data: " + JSON.stringify(cdata.canal));
    FE.canvas.loadFromJSON(FE.deserialize(cdata.canal));
};



////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////     Other Signals and Slots                                ////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
FE.onModuleSelected = function(module) {
    FE.CanalManager.getContextCanal().onModuleSelected(module)
};

