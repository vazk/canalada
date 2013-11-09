
Canalada.Port = fabric.util.createClass(fabric.Rect, {
    C : {'pHeight':10,
         'pWidth': 16,
         'pPadding' : 24,
         'pSpacing' : 6,
         'pTextWidth' : 40,
         'pFill' : '#ffffff',
         'pStroke' : '#30407a',
         'pStrokeWidth' : 2,
         'pStrokeSelect' : '#ad2e3a'
        },
    rx: 3,
    ry: 3,
    initialize: function(name, actor, options) {
        this.options || (options = {});
        this.width = this.C.pWidth;
        this.height = this.C.pHeight;
        this.fill = this.C.pFill;
        this.stroke = this.C.pStroke;
        this.strokeWidth = this.C.pStrokeWidth;
        this.name =  '';
        this.actor = actor;
        this.links = [];
    }
});

Canalada.OutPort = fabric.util.createClass(Canalada.Port, {
    
    ctype : 'OutPort',
    
    initialize: function(name, actor, i, options) {
        this.callSuper('initialize', name, actor, options);
        var w = actor.width;
        var h = actor.height;
        this.left = w/2 - this.C.pWidth/2 + 4;
        this.top = -h/2 + this.C.pPadding + i * (this.C.pHeight + this.C.pSpacing) + this.C.pHeight/2;
        this.setCoords();
    }
});

Canalada.InPort = fabric.util.createClass(Canalada.Port, {
    
    ctype : 'InPort',
    
    initialize: function(name, actor, i, options) {
        this.callSuper('initialize', name, actor, options);
        var w = actor.width;
        var h = actor.height;
        this.left = -w/2 + this.C.pWidth/2 - 4;
        this.top = -h/2 + this.C.pPadding + i * (this.C.pHeight + this.C.pSpacing) + this.C.pHeight/2;
        this.setCoords();
    }
});

