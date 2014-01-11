
Canalada.Link = fabric.util.createClass(fabric.Path, {
    C : {'pStroke': 'black',
         'pStrokeSelect' : '#ad2e3a',
         'pStrokeWidth':3,
         'pStraight' : 25,
         'pCurve' : 50
        },
    ctype: 'Link',

    initialize: function(porta, portb, options) {
        this.callSuper('initialize', "M 0 0 L 0 0 C 0 0 0 0 0 0 L 0 0", options);
        this.fill = '';
        this.stroke = this.C.pStroke;
        this.strokeWidth = this.C.pStrokeWidth;
        this.perPixelTargetFind = true;
        this.hasBorders = false;
        this.hasControls = false;
        this.lockMovementX = true;
        this.lockMovementY = true;
        this.porta = porta;
        this.portb = portb;
        
        this.setup();
    },

    setup: function() {
        if(!this.porta || !this.portb) {
            return;
        }
        var ac = this.porta.module.getCenterPoint();
        var bc = this.portb.module.getCenterPoint();
        var apc = this.porta.getCenterPoint();
        var bpc = this.portb.getCenterPoint();

        var fromX = ac.x + apc.x;
        var fromY = ac.y + apc.y;
        var toX = bc.x + bpc.x;
        var toY = bc.y + bpc.y;

        var amult = 1;
        var bmult = 1;
        if(this.porta.ctype === 'InPort') {
            amult = -1;
        }
        if(this.portb.ctype === 'InPort') {
            bmult = -1;
        }
        
        this.path[0][1] = fromX;
        this.path[0][2] = fromY;
        
        this.path[1][1] = amult * this.C.pStraight + fromX;
        
        this.path[1][2] = fromY;

        this.path[2][1] = fromX + amult * this.C.pCurve;
        this.path[2][2] = fromY;
        this.path[2][3] = toX + bmult * this.C.pCurve;
        this.path[2][4] = toY;
        this.path[2][5] = toX + bmult * this.C.pStraight;
        this.path[2][6] = toY;

        this.path[3][1] = toX;
        this.path[3][2] = toY;

        this.left = 0;
        this.top = 0;
        var dim = this._parseDimensions();
        this.set(dim);
        this.pathOffset = {x: dim.left - dim.width/2, y: dim.top - dim.height/2};
        this.setCoords();
    },
    select: function(flag) {
        if(flag)
            this.stroke = this.C.pStrokeSelect;
        else 
            this.stroke = this.C.pStroke;
    },
    serialize: function() {
        var data = {};
        data.porta = {"module_id": Canalada.modules.indexOf(this.porta.module), 
                      "name": this.porta.name};
        data.portb = {"module_id": Canalada.modules.indexOf(this.portb.module), 
                      "name": this.portb.name};
        return data;
    },
    deserialize: function(data) {
        var modulea = Canalada.modules[data.porta.module_id];
        var moduleb = Canalada.modules[data.portb.module_id];
        this.porta = modulea.getPortByName(data.porta.name);
        this.portb = moduleb.getPortByName(data.portb.name);
        this.setup();
    }
});

