Canalada.Actor = new fabric.util.createClass(fabric.Group, {

    ctype: 'Actor',
  
    C : {'pHeight':10,
         'pWidth': 16,
         'pPadding' : 24,
         'pSpacing' : 6,
         'pTextMaxWidth' : 40
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

    setup: function() {
        var inMaxWidth = 0;
        var outMaxWidth = 0;
        for(var i = 0; i < this.inPorts.length; ++i) {
            var p = this.inPorts[i];
            inMaxWidth = Math.max(inMaxWidth, p.textWidth);
        }
       
        for(var i = 0; i < this.outPorts.length; ++i) {
            var p = this.outPorts[i];
            outMaxWidth = Math.max(outMaxWidth, p.textWidth);
        }
        
        var numPorts = Math.max(this.inPorts.length, this.outPorts.length);
        var w = 2 * this.C.pWidth + inMaxWidth + outMaxWidth;
        var h = numPorts * (this.C.pHeight + this.C.pSpacing) + this.C.pPadding;
        this.actorRect.width = w;
        this.actorRect.height = h;
        this.addWithUpdate(this.actorRect);
        for(var i = 0; i < this.inPorts.length; ++i) {
            this.inPorts[i].refresh();
            this.add(this.inPorts[i]);
            this.inPorts[i].setCoords();
        }
        for(var i = 0; i < this.outPorts.length; ++i) {
            this.outPorts[i].refresh();
            this.add(this.outPorts[i]);
            this.outPorts[i].setCoords();
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


Canalada.FileWriterActor = new fabric.util.createClass(Canalada.Actor, {
    initialize: function(options) {
        this.callSuper('initialize', '', 'FileWriter', options);
        this.addInPort('file_name');
        this.addInPort('file_data');
        this.addOutPort('result');
        this.setup();
    }
});

