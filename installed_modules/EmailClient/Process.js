var Process = 
{
    process: function(inputs, outputs) {
        console.log('EmailClient processor, inputs[', inputs,']');
        outputs['email'] = 'sent';
    }
};

if(typeof exports !== 'undefined') exports.Process = Process;

