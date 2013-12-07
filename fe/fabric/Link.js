
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
        var ac = this.porta.actor.getCenterPoint();
        var bc = this.portb.actor.getCenterPoint();
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
        data.porta = {"actor_id": Canalada.actors.indexOf(this.porta.actor), 
                      "name": this.porta.name};
        data.portb = {"actor_id": Canalada.actors.indexOf(this.portb.actor), 
                      "name": this.portb.name};
        return data;
    },
    deserialize: function(data) {
        var actora = Canalada.actors[data.porta.actor_id];
        var actorb = Canalada.actors[data.portb.actor_id];
        this.porta = actora.getPortByName(data.porta.name);
        this.portb = actorb.getPortByName(data.portb.name);
        this.setup();
    }
});
