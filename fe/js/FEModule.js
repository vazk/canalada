FE.Module = fabric.util.createClass(fabric.Group, {

    ctype: 'Module',
  
    C : {'pHeight':10,
         'pWidth': 16,
         'pPadding' : 20,
         'pSpacing' : 12,
         //'pTextMaxWidth' : 50,
         'pMaxPortNameLen' : 15,
         'pFill' : '#98B1C4',
         'pTitleFill' : '#2F4E6F',
         'pStroke' : '#2F4E6F',
         'pStrokeSelect' : '#ad2e3a',
         'pFontColor': '#FFFFFF',
         'pFont' :  'Lato',
         'pTitleFontSize': 14.5,
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
              //fontWeight: 'bold',
              stroke: this.C.pFontColor,
            });
        this.moduleRect = new fabric.Rect({
              left: 100,
              top: 100,
              strokeWidth: 1,
              width: 50, height:50,
              fill: this.C.pFill,
              stroke: this.C.pStroke,
              hasBorders : false,
              hasControls : false,
              rx: 4,
              ry: 4,
            });
        this.moduleRect.hasBorders = this.moduleRect.hasControls = false;
        this.titleRect = new fabric.Rect({
              left: 100,
              top: 100,
              strokeWidth: 1,
              width: 50, height:50,
              fill: this.C.pTitleFill,
              stroke: this.C.pStroke,
              hasBorders : false,
              hasControls : false,
              rx: 4,
              ry: 4,
            });
        this.titleRect.hasBorders = this.titleRect.hasControls = false;
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
        
        this.titleRect.top -= h/2;//this.moduleRect.top;
        this.titleRect.width = w;
        this.titleRect.height = this.titleText.height + 4;
        this.addWithUpdate(this.titleRect);

        this.add(this.titleText);
        this.titleText.left = -this.width/2 + this.titleText.width/2 + 6,
        this.titleText.top = -this.height/2 + this.titleText.height/2 + 2,

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
