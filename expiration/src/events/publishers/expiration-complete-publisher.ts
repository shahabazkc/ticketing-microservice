import { Publisher, Subjects, ExpirationCompleteEvent } from "@shahabazkc-ticket-microservice/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{

    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}