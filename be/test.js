var mf = require('./BEModuleFactory');
var wd = require('./WorkDispatcher');
var cm = require('./BECanalManager');
var BE = require('./BECore.js').BE;

var fecanal = {};
var acanal = cm.createCanal(fecanal);
var bcanal = cm.createCanal(fecanal);


var m1 = mf.create('EmailClient');
var m2 = mf.create('EmailClient');

var l = new BE.Link();
l.setFromPort(m1.outputPorts[0]);
l.setToPort(m2.inputPorts[0]);

//paaa.push("bpooo");
m1.outputPorts[0].push("popoq");

wd.start();