import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticker-created-publisher';

'use-strict'

console.clear();

const stan = nats.connect('ticketing', 'test', {
    url: "http://localhost:4222"
});

stan.on('connect', async () => {
    console.log("Publisher connected to NATS");
    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: "1122",
            title: "fun                                                                                                                                                                                                                                                                                                  ",
            price: 234
        });
    }
    catch (err) {
        console.log(err);
    }

    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // });

    // stan.publish('ticket:created', data, () => {
    //     console.log("Event Published");
    // }); 

});