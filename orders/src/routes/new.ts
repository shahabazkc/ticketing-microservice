import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@shahabazkc-ticket-microservice/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
const router = express.Router();
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post
    (
        '/api/orders',
        requireAuth,
        [
            body('ticketId')
                .not()
                .isEmpty()
                .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
                .withMessage('TicketId must be valid')
        ],
        async (req: Request, res: Response) => {
            // Find the ticket the user is trying to order in the database
            const { ticketId } = req.body;
            const ticket = await Ticket.findById(ticketId);
            if (!ticket) throw new NotFoundError();

            // Make sure that ticket is not already reserved
            // Run query to look at all orders. Find an order where the ticket
            // is the ticket we just found and the order status is not cancelled
            // If we find an order form that emans the ticket is reserved
            const isReserved = await ticket.isReserved();
            if (isReserved) {
                throw new BadRequestError('Ticket is already reserved')
            }

            // Calculate an expiration date for this order
            const expiration = new Date();
            expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

            // Build the order and save it to the database
            const order = Order.build({
                userId: req.currentUser!.id,
                status: OrderStatus.Created,
                expiresAt: expiration,
                ticket
            });
            await order.save();

            // Publish an event saying that an order was created
            new OrderCreatedPublisher(natsWrapper.client).publish({
                id: order.id,
                version: order.version,
                status: order.status,
                userId: order.userId,
                expiresAt: order.expiresAt.toISOString(),
                ticket: {
                    id: ticket.id,
                    price: ticket.price
                }
            })

            res.status(201).send(order);
        }
    );

export { router as newOrderRouter }; 