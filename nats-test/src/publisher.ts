import nats from 'node-nats-streaming';

'use-strict'

console.clear();

const stan = nats.connect('ticketing', 'test', {
    url: "http://localhost:4222"
});

stan.on('connect', () => {
    console.log("Publisher connected to NATS");

    const data = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    });

    stan.publish('ticket:created', data, () => {
        console.log("Event Published");
    }); 

});