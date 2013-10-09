var stompit = require('stompit');

var connectParams = {
    host: 'localhost',
    port: 61613,
    connectHeaders:{
        host: 'mybroker'
    }
};

stompit.connect(connectParams, function(error, client){
    
    if(error){
        console.log('Unable to connect: ' + error.message);
        return;
    }
    
    var subscribeParams = {
       'destination': '/queue/test',
       'ack': 'client-individual'
    };
    
    var consuming = false;
    
    client.subscribe(subscribeParams, function(message){
        
        // Don't consume more than one message
        if(consuming){
            return;
        }
        
        consuming = true;
        
        var read = function(){
            var chunk;
            while(null !== (chunk = message.read())){
                process.stdout.write(chunk);
            }
        };
        
        message.on('readable', read);
        
        message.on('end', function(){
            message.ack();
            client.disconnect();
        });
    });
});
