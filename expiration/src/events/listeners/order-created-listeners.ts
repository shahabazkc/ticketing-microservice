import { Listener, OrderCreatedEvent, Subjects } from "@shahabazkc-ticket-microservice/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queue/expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log("Waiting this many milliseconds to process the job: ", delay);

        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        }
        );

        msg.ack();
    }
}