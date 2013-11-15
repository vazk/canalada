
Canalada.Link = fabric.util.createClass(fabric.Path, {
    C : {'pStroke': 'black',
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
        this.hasBorders = false;
        this.hasControls = false;

        this.porta = porta;
        this.portb = portb;
        
        this.setup();
    },

    setup: function() {
        var ac = this.porta.actor.getCenterPoint();
        var bc = this.portb.actor.getCenterPoint();
        var apc = this.porta.getCenterPoint();
        var bpc = this.portb.getCenterPoint();

        var fromX = ac.x + apc.x;
        var fromY = ac.y + apc.y;
        var toX = bc.x + bpc.x;
        var toY = bc.y + bpc.y;

        this.path[0][1] = fromX;
        this.path[0][2] = fromY;

        this.path[1][1] = this.C.pStraight + fromX;
        this.path[1][2] = fromY;

        this.path[2][1] = fromX + this.C.pCurve;
        this.path[2][2] = fromY;
        this.path[2][3] = toX - this.C.pCurve;
        this.path[2][4] = toY;
        this.path[2][5] = toX-this.C.pStraight;
        this.path[2][6] = toY;

        this.path[3][1] = toX;
        this.path[3][2] = toY;
    }
});

