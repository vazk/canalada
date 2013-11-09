Canalada.Actor = new fabric.util.createClass(fabric.Group, {

    ctype: 'Actor',
  
    C : {'pHeight':10,
         'pWidth': 16,
         'pPadding' : 24,
         'pSpacing' : 6,
         'pTextWidth' : 40
         },
    
    options : {},
    
    initialize: function(model, name, options) {
        this.options || (options = {});
        this.model = model;
        this.name = name;
        this.callSuper('initialize', options);
        this.hasBorders = false;
        this.hasControls = false;
        this.inPorts = [];
        this.outPorts = [];
        this.actorRect = new fabric.Rect({
              left: 100,
              top: 100,
              strokeWidth: 5,
              width: 50, height:50,
              fill: '#fff',
              stroke: '#666',
              hasBorders : false,
              hasControls : false
            });
        this.actorRect.hasBorders = this.actorRect.hasControls = false;
    },

    refresh: function() {
        var numPorts = Math.max(this.inPorts.length, this.outPorts.length);
        var w = 2 * this.C.pWidth + 2 * this.C.pTextWidth + 30;
        var h = numPorts * (this.C.pHeight + this.C.pSpacing) + this.C.pPadding;
        this.actorRect.width = w;
        this.actorRect.height = h;
        this.addWithUpdate(this.actorRect);
        //.this.actorRect.setCoords();
        for(var i = 0; i < this.inPorts.length; ++i) {
            this.inPorts[i].refresh();
            this.add(this.inPorts[i]);
        }
        for(var i = 0; i < this.outPorts.length; ++i) {
            this.outPorts[i].refresh();
            this.add(this.outPorts[i]);
        }
        Canalada.canvas.renderAll();
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            Actor: this.get('Actor')
        });
    },

    addInPort : function(portName) {
        var port = new Canalada.InPort(portName, this, this.inPorts.length);
        this.inPorts.push(port);
    },

    addOutPort : function(portName) {
        var port = new Canalada.OutPort(portName, this, this.outPorts.length);
        this.outPorts.push(port);
    }

});

