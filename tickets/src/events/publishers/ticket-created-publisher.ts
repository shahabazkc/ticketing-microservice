import { Publisher, Subjects, TicketCreatedEvent } from '@shahabazkc-ticket-microservice/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
};