import { Publisher, Subjects, TicketUpdatedEvent } from '@shahabazkc-ticket-microservice/common';
import { natsWrapper } from '../../nats-wrapper';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
};


