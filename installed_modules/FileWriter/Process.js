var Process = 
{
    process: function(inputs, outputs) {
        console.log('FileWriterprocessor, inputs[', inputs,']');
        outputs['data'] = 'write';
    }
};

if(typeof exports !== 'undefined') exports.Process = Process;

