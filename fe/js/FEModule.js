FE.Module = fabric.util.createClass(fabric.Group, {

    ctype: 'Module',
  
    C : {'pHeight':8,
         'pWidth': 14,
         'pPadding' : 20,
         'pSpacing' : 5,
         'pTextMaxWidth' : 40,
         'pStroke' : '#444',
         'pStrokeSelect' : '#ad2e3a',
         'pFont' :  'Lato',
         'pTitleFontSize': 10.5
         },
    
    title: '',
    
    initialize: function(options) {
        this.mname = options.mname;
        this.callSuper('initialize');
        this.hasBorders = false;
        this.hasControls = false;
        this.ports = [];
        this.titleText = new fabric.Text(this.mname, {
              fontFamily: this.C.pFont,
              fontSize: this.C.pTitleFontSize,
              fontWeight: 'bold',
            });
        this.moduleRect = new fabric.Rect({
              left: 100,
              top: 100,
              strokeWidth: 1,
              width: 50, height:50,
              fill: '#fff',
              stroke: '#444',
              hasBorders : false,
              hasControls : false
            });
        this.moduleRect.hasBorders = this.moduleRect.hasControls = false;
    },

    setup: function() {
        var inMaxWidth = 0;
        var outCount = 0;
        var outMaxWidth = 0;
        var inCount = 0;
        for(var i = 0; i < this.ports.length; ++i) {
            var p = this.ports[i];
            if(p.ctype === 'InPort') {
                inMaxWidth = Math.max(inMaxWidth, p.textWidth);
                inCount++;
            } else {
                outMaxWidth = Math.max(outMaxWidth, p.textWidth);
                outCount++;
            }
        }
        
        var numPorts = Math.max(inCount, outCount);
        var w = 2 * this.C.pWidth + inMaxWidth + outMaxWidth;
        var h = numPorts * (this.C.pHeight + this.C.pSpacing) + this.C.pPadding;
        this.moduleRect.width = w;
        this.moduleRect.height = h;
        this.addWithUpdate(this.moduleRect);
        this.add(this.titleText);
        this.titleText.left = -this.width/2 + this.titleText.width/2 + 2,
        this.titleText.top = -this.height/2 + this.titleText.height/2,

        inCount = 0; outCount = 0;
        for(var i = 0; i < this.ports.length; ++i) {
            var p = this.ports[i];
            var index;
            if(p.ctype === 'InPort') {
                index = inCount++;
            } else {
                index = outCount++;
            }
            p.setup(index);
            this.add(p);
            p.setCoords();
        }
        FE.canvas.renderAll();
    },

    getPortByName: function(name) {
        for(var i = 0; i < this.ports.length; ++i) {
            var p = this.ports[i];
            if(p.name == name) {
                return p;
            }
        }
        return null;
    },

    getSelectedItem: function(offset) {
        var objects = this.getObjects();
        var center = this.getCenterPoint();
        for(var i = objects.length; i--; ) {
            var pt = {x:offset.x - center.x, y:offset.y - center.y};
            if(objects[i] && objects[i].containsPoint(pt)) {
                return objects[i];
            }
        }
        return null;
    },

    //toObject: function() {
    //    return fabric.util.object.extend(this.callSuper('toObject'), {
    //        Module: this.get('Module')
    //    });
    //},

    addInputPort : function(portName) {
        var port = new FE.InPort(portName, this);
        this.ports.push(port);
    },

    addOutputPort : function(portName) {
        var port = new FE.OutPort(portName, this);
        this.ports.push(port);
    },

    select: function(flag) {
        if(flag)
            this.getObjects()[0].setStroke(this.C.pStrokeSelect);
        else 
            this.getObjects()[0].setStroke(this.C.pStroke);
    },

    model: function() {
        return this.__proto__.constructor.model;
    },

    serialize: function() {
        var data = {};
        data.top = this.top;
        data.left = this.left;
        return data;   
    }
});
