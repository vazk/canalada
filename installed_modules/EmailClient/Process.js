exports.Process = 
{
    process: function(inputs, outputs) {
        console.log('EmailClient processor, inputs[', inputs,']');
        outputs['email'] = 'sent';
    }
};
