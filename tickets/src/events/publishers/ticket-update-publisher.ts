import { Publisher, Subjects, TicketUpdatedEvent } from '@shahabazkc-ticket-microservice/common';

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
};