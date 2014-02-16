    
exports.EmailClient = 
{
    input: ['InMail'],
    output: ['OutMail'],
    process: function(inputs, outputs) {
        console.log('EmailClient processor, inputs[', inputs,']');
        outputs['email'] = 'sent';
    }
};
