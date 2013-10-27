function Actor() {
    return {
        ctype: 'Actor',
        
        params: {},
        
        inPorts: [],
        
        outPorts: [],
        
        initialize: function(options) {
            this.params = options || { };
        },
        
        addInPort : function(portName) {
            this.inPorts.push(portName);
        },
        
        addOutPort : function(portName) {
            this.outPorts.push(portName);
        }
    };
};

var PortView = fabric.util.createClass(fabric.Rect, {
    C : {'pHeight':10,
         'pWidth': 16,
         'pPadding' : 24,
         'pSpacing' : 6,
         'pTextWidth' : 40,
         'pFill' : '#fff',
         'pStroke' : '#30407a',
         'pStrokeSelect' : '#ad2e3a'
         },
    rx: 3,
    ry: 3,
    strokeWidth: 1,
    initialize: function(options) {
        this.options || (options = {});
        this.width = this.C.pWidth,
        this.height = this.C.pHeight,
        this.fill = this.C.fill,
        this.stroke = this.C.pStroke
    }
});

var OutPortView = fabric.util.createClass(PortView, {
    
    ctype : 'OutPortView',
    
    initialize: function(actorView, i, options) {
        this.callSuper('initialize', options);
        var w = actorView.width;
        var h = actorView.height;
        this.left = w/2 - this.C.pWidth/2 + 4;
        this.top = -h/2 + this.C.pPadding + i * (this.C.pHeight + this.C.pSpacing) + this.C.pHeight/2;
        this.setCoords();
    }
});

var InPortView = fabric.util.createClass(PortView, {
    
    ctype : 'InPortView',
    
    initialize: function(actorView, i, options) {
        this.callSuper('initialize', options);
        var w = actorView.width;
        var h = actorView.height;
        this.left = -w/2 + this.C.pWidth/2 - 4;
        this.top = -h/2 + this.C.pPadding + i * (this.C.pHeight + this.C.pSpacing) + this.C.pHeight/2;
        this.setCoords();
    }
});


var ActorView = fabric.util.createClass(fabric.Group, {

    ctype: 'ActorView',
  
    C : {'pHeight':10,
         'pWidth': 16,
         'pPadding' : 24,
         'pSpacing' : 6,
         'pTextWidth' : 40
         },
    
    options : {},
    
    initialize: function(actor, options) {
        this.actor = actor;
        this.options || (options = {});
        this.callSuper('initialize', options);
        
        this.hasBorders = false;
        this.hasControls = false;
        
        //this.set('label', options.label || '');
        if(this.actor === undefined)
            return;

        var inPorts = this.actor.inPorts;
        var outPorts = this.actor.outPorts;
        var numPorts = Math.max(inPorts.length, outPorts.length);
        var w = 2 * this.C.pWidth + 2 * this.C.pTextWidth + 30;
        var h = outPorts.length * (this.C.pHeight + this.C.pSpacing) + this.C.pPadding;
        
        var actorRect = new fabric.Rect({
              left: 100,
              top: 100,
              strokeWidth: 5,
              width: w, height: h,
              fill: '#fff',
              stroke: '#666',
              hasBorders : false,
              hasControls : false
            });
        actorRect.hasBorders = actorRect.hasControls = false;
        this.addWithUpdate(actorRect);

        for(var i = 0; i < inPorts.length; i++) {
            var port = new InPortView(this, i);
            //port.setCoords();
            this.add(port);
        }
          
        for(var i = 0; i < outPorts.length; i++) {
            var port = new OutPortView(this, i);
            //port.setCoords();
            this.add(port);        }
        
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            Actor: this.get('Actor')
        });
    },

});

Canalada = {};
Canalada.Actor = Actor;
Canalada.ActorView = ActorView;