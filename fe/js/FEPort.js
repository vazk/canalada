
FE.Port = fabric.util.createClass(fabric.Rect, {
    C : {'pHeight': 10,
         'pWidth': 12,
         'pPadding' : 30,
         'pSpacing' : 12,
         'pFill' : '#ffffff',
         'pFillSelect' : '#ad2e3a',
         'pStroke' : '#30407a',
         'pStrokeWidth' : 1,
         'pStrokeSelect' : '#ad2e3a',
         'pFont' :  '10.5px Lato'
,        },
    rx: 3,
    ry: 3,
    initialize: function(name, module, options) {
        this.options || (options = {});
        this.width = this.C.pWidth;
        this.height = this.C.pHeight;
        this.fill = this.C.pFill;
        this.stroke = this.C.pStroke;
        this.strokeWidth = this.C.pStrokeWidth;
        //this.name =  name;
        var maxNameLen = module.C.pMaxPortNameLen;
        this.name = name.length > maxNameLen ? name.substr(0,maxNameLen-3) + '...' : name;
        this.module = module;
        this.links = [];
        this.textWidth = FE.textWidth(this.name, this.C.pFont);
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

FE.OutPort = fabric.util.createClass(FE.Port, {
    ctype : 'OutPort',
    setup: function(index) {
        var w = this.module.moduleRect.width;
        var h = this.module.moduleRect.height;
        this.left = w/2 - this.C.pWidth/2 + 4;
        this.top = -h/2 + this.C.pPadding + index * (this.C.pHeight + this.C.pSpacing) + this.C.pHeight/2;
    },
    _render: function(ctx) {
        this.callSuper('_render', ctx);
        ctx.font = this.C.pFont
        ctx.fillStyle = 'black';
        ctx.fillText(this.name,
                     -this.width/2 - 7 - this.textWidth,//Math.min(this.module.C.pTextMaxWidth, this.textWidth),
                     -this.height/2 + 9,
                     this.textWidth);
                     //this.module.C.pTextMaxWidth);
    }
});

FE.InPort = fabric.util.createClass(FE.Port, {
    ctype : 'InPort',
    setup: function(index) {
        var w = this.module.moduleRect.width;
        var h = this.module.moduleRect.height;
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
                     this.textWidth);
                     //this.module.C.pTextMaxWidth);

    }
});

