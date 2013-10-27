
Canalada.Port = fabric.util.createClass(fabric.Object, {
    
    ctype: 'Port',
    name:  '',
    actor: undefined,
    links: [],
    
    initialize : function(ctype, name, actor) {
        this.ctype = ctype;
        this.name = name;
        this.actor = actor;
    }
});

Canalada.PortView = fabric.util.createClass(fabric.Rect, {
    C : {'pHeight':10,
         'pWidth': 16,
         'pPadding' : 24,
         'pSpacing' : 6,
         'pTextWidth' : 40,
         'pFill' : '#fffff',
         'pStroke' : '#30407a',
         'pStrokeSelect' : '#ad2e3a'
         },
    rx: 3,
    ry: 3,
    strokeWidth: 1,
    port: undefined,
    initialize: function(port, options) {
        this.port = port
        this.options || (options = {});
        this.width = this.C.pWidth,
        this.height = this.C.pHeight,
        this.fill = this.C.fill,
        this.stroke = this.C.pStroke
    }
});

Canalada.OutPortView = fabric.util.createClass(Canalada.PortView, {
    
    ctype : 'OutPortView',
    
    initialize: function(actorView, i, port, options) {
        this.callSuper('initialize', port, options);
        var w = actorView.width;
        var h = actorView.height;
        this.left = w/2 - this.C.pWidth/2 + 4;
        this.top = -h/2 + this.C.pPadding + i * (this.C.pHeight + this.C.pSpacing) + this.C.pHeight/2;
        this.setCoords();
    }
});

Canalada.InPortView = fabric.util.createClass(Canalada.PortView, {
    
    ctype : 'InPortView',
    
    initialize: function(actorView, i, port, options) {
        this.callSuper('initialize', port, options);
        var w = actorView.width;
        var h = actorView.height;
        this.left = -w/2 + this.C.pWidth/2 - 4;
        this.top = -h/2 + this.C.pPadding + i * (this.C.pHeight + this.C.pSpacing) + this.C.pHeight/2;
        this.setCoords();
    }
});

