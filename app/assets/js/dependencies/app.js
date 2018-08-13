

(function (io){

    var socket = io.connect();

    if(typeof console!== 'undefined'){
        log('connection to sails.js..');
    }       

    socket.on('connect', function socketConnected(){
        console.log('This is from the connect: ', This.socket.sessionid);
        
        socket.on('message', function messageReceived(message){
            log('New comet message received:: ',message);
        });

        socket.get('/user/subscribe');

        log(
            `socket is now connected and globally accessible as 'socket',\n`
            `e.g. to send a GET request ot Sails, try\n`
             `socket.get('/',function(response)`
            `{ console.log(response);})`

        );
    });
})