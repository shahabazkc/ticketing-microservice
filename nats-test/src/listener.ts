import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: "http://localhost:4222"
});

stan.on('connect', () => {
    console.log("Listener connected to NATS");

    new TicketCreatedListener(stan).listen();

});



