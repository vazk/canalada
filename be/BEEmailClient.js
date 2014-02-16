var augment = require("augment");
var core = require('./BECore.js');
var mr = require('./BEModuleRegistry');
var wd = require('./BEWorkDispatcher');

var BEEmailClient = core.BEModuleBase.augment(function() {
    this.constructor = function() {
        core.BEModuleBase.call(this, 'EmailClient');
        this.addInputPort('InMail');
        this.addOutputPort('OutMail');
    }
    this.process = function(inputs, outputs) {
        console.log('BEEmailClient works! input: ', inputs);
        outputs['param'] = 'pampam';
    }
});

mr.register(new BEEmailClient());

var m1 = new BEEmailClient();
var m2 = new BEEmailClient();

var l = new core.BELink();
l.setFromPort(m1.outputPorts[0]);
l.setToPort(m2.inputPorts[0]);

//paaa.push("bpooo");
m1.outputPorts[0].push("popoq");

wd.start();

