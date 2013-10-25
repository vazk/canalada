/*! JointJS v0.6.4 - JavaScript diagramming library  2013-10-15 


This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
joint.shapes.devs = {};

joint.shapes.devs.Model = joint.shapes.basic.Generic.extend({

    markup: [
        '<g class="rotatable">',
            '<g class="scalable">',
                '<rect/>',
            '</g>',
            '<text class="label"/>',
            '<g class="inPorts"/>',
            '<g class="outPorts"/>',
        '</g>'].join(''),

    portMarkup: '<g class="port<%= id %>"><rect class="xport"/><text/></g>',

    defaults: joint.util.deepSupplement({
        type: 'devs.Model',
        size: { width: 80, height: 80 },
        inPorts: [],
        outPorts: [],
        attrs: {
            '.': { magnet: false },
            rect: {
                width: 150, height: 250,
                stroke: 'black'
            },
            text: {
                fill: 'black',
                'pointer-events': 'none'
            },
            '.xport': { 'magnet' : true, 'stroke': 'black', 'stroke-width': 2, 'fill': '#3498db', 
                        'width' : 20, 'height' : 10 },
            '.label': { text: 'Model', 'ref-x': .3, 'ref-y': .2 },
            '.inPorts text': { x:-15, dy: 4, 'text-anchor': 'end' },
            '.outPorts text':{ x: 15, dy: 4 }
        }

    }, joint.shapes.basic.Generic.prototype.defaults),

    getPortSelector: function(name) {

        var selector = '.inPorts';
        var index = this.get('inPorts').indexOf(name);

        if (index < 0) {
            selector = '.outPorts';
            index = this.get('outPorts').indexOf(name);

            if (index < 0) throw new Error("getPortSelector(): Port doesn't exist.");
        }

        return selector + '>g:nth-child(' + (index + 1) + ')>.xport';
    }

});


joint.shapes.devs.Link = joint.dia.Link.extend({

    defaults: {
        type: 'devs.Link',
        attrs: { '.connection' : { 'stroke-width' :  2 }}
    }
});

joint.shapes.devs.ModelView = joint.dia.ElementView.extend({

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);

        _.bindAll(this,'addInPorts','addOutPorts','updatePorts');

        this.model.on({
            'change:inPorts':  this.addInPorts,
            'change:outPorts': this.addOutPorts,
            'change:size':     this.updatePorts
        });

        this.portsAttrs = { '.inPorts': {}, '.outPorts': {} };
    },

    render: function() {

        joint.dia.ElementView.prototype.render.apply(this, arguments);

        this.addPorts(this.model.get('inPorts'), '.inPorts');
        this.addPorts(this.model.get('outPorts'), '.outPorts');
    },

    addInPorts: function(cell, ports) {  return this.addPorts(ports, '.inPorts'); },
    addOutPorts: function(cell, ports) { return this.addPorts(ports, '.outPorts'); },

    addPorts: function(ports, selector) {
        var $ports = this.$(selector).empty();

        var moduleHeight = 15 + ports.length * (10 + 15);
        if(moduleHeight < this.model.attributes.size.height) {
            moduleHeight = this.model.attributes.size.height;            
        }
        var moduleWidth = this.model.attributes.size.width;
        this.model.resize(moduleWidth, moduleHeight);

        var attributes = this.portsAttrs[selector] = {};
        if (!ports || ports.length == 0) 
            return;
        var portTemplate = _.template(this.model.portMarkup);
        var portCount = ports.length;

        _.each(ports, function(portName, index) {
            var portClass = 'port' + index;
            var portSelector = selector + '>.' + portClass;
            attributes[portSelector + '>text'] = { text: portName };
            attributes[portSelector] = {}
            attributes[portSelector]['ref'] = this.model;
            attributes[portSelector]['ref-y'] = 15 + index*(10 + 15);
            if (selector === '.outPorts') { 
                attributes[portSelector]['ref-dx'] = -20;
            }
            $ports.append(V(portTemplate({ id: index })).node);

        });

        this.update(this.model, _.extend({}, attributes, this.model.get('attrs')));
    },

    updatePorts: function(cell, transform) {
        this.update(this.model, _.extend(this.portsAttrs['.inPorts'], this.portsAttrs['.outPorts']));
    }

});

joint.shapes.devs.AtomicView = joint.shapes.devs.ModelView;
joint.shapes.devs.CoupledView = joint.shapes.devs.ModelView;
