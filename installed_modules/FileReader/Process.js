var Process = 
{
    process: function(inputs, outputs) {
        console.log('FileReader processor, inputs[', inputs,']');
        outputs['data'] = 'read';
    }
};

if(typeof exports !== 'undefined') exports.Process = Process;

