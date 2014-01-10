
Canalada.Port = fabric.util.createClass(fabric.Rect, {
    C : {'pHeight':10,
         'pWidth': 12,
         'pPadding' : 24,
         'pSpacing' : 6,
         'pFill' : '#ffffff',
         'pFillSelect' : '#ad2e3a',
         'pStroke' : '#30407a',
         'pStrokeWidth' : 2,
         'pStrokeSelect' : '#ad2e3a',
         'pFont' :  '11.5px Lato'
,        },
    rx: 3,
    ry: 3,
    initialize: function(name, actor, options) {
        this.options || (options = {});
        this.width = this.C.pWidth;
        this.height = this.C.pHeight;
        this.fill = this.C.pFill;
        this.stroke = this.C.pStroke;
        this.strokeWidth = this.C.pStrokeWidth;
        this.name =  name;
        this.actor = actor;
        this.links = [];
        this.textWidth = Canalada.textWidth(this.name, this.C.pFont);
        this.selectCnt = 0;
    },
    select: function(flag) {
        if(flag) {
            this.fill = this.C.pFillSelect;
            this.selectCnt++;
        } else {
            this.selectCnt--;
            if(this.selectCnt == 0) {
                this.fill = this.C.pFill;
            }
        }
    }
});

Canalada.OutPort = fabric.util.createClass(Canalada.Port, {
    ctype : 'OutPort',
    setup: function(index) {
        var w = this.actor.actorRect.width;
        var h = this.actor.actorRect.height;
        this.left = w/2 - this.C.pWidth/2 + 4;
        this.top = -h/2 + this.C.pPadding + index * (this.C.pHeight + this.C.pSpacing) + this.C.pHeight/2;
    },
    _render: function(ctx) {
        this.callSuper('_render', ctx);
        ctx.font = this.C.pFont
        ctx.fillStyle = 'black';
        ctx.fillText(this.name,
                     -this.width/2 - 3 - Math.min(this.actor.C.pTextMaxWidth, this.textWidth),
                     -this.height/2 + 9,
                     this.actor.C.pTextMaxWidth);
    }
});

Canalada.InPort = fabric.util.createClass(Canalada.Port, {
    ctype : 'InPort',
    setup: function(index) {
        var w = this.actor.actorRect.width;
        var h = this.actor.actorRect.height;
        this.left = -w/2 + this.C.pWidth/2 - 4;
        this.top = -h/2 + this.C.pPadding + index * (this.C.pHeight + this.C.pSpacing) + this.C.pHeight/2;
    },
    _render: function(ctx) {
        this.callSuper('_render', ctx);
        ctx.font = this.C.pFont;
        ctx.fillStyle = 'black';
        ctx.fillText(this.name,
                     this.width/2 + 3,
                     -this.height/2 + 9,
                     this.actor.C.pTextMaxWidth);

    }
});

