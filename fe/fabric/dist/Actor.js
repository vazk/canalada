Canalada.Actor = fabric.util.createClass(fabric.Object, {
    ctype: 'Actor',
    model: '',
    name: '',

    params: {},

    inPorts: [],

    outPorts: [],

    initialize: function(options) {
        this.params = options || { };
    },

    addInPort : function(portName) {
        var port = new Canalada.Port('OutPort', portName, this);
        this.inPorts.push(port);
    },

    addOutPort : function(portName) {
        var port = new Canalada.Port('OutPort', portName, this);
        this.outPorts.push(port);
    }
});
 



Canalada.ActorView = fabric.util.createClass(fabric.Group, {

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
            var port = new Canalada.InPortView(this, i, inPorts[i]);
            //port.setCoords();
            this.add(port);
        }
          
        for(var i = 0; i < outPorts.length; i++) {
            var port = new Canalada.OutPortView(this, i, outPorts[i]);
            //port.setCoords();
            this.add(port);        }
        
    },

    toObject: function() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            Actor: this.get('Actor')
        });
    },

});
