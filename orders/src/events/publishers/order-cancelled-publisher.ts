import { Publisher, OrderCancelledEvent, Subjects } from "@shahabazkc-ticket-microservice/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
};

