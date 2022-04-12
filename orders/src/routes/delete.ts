import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@shahabazkc-ticket-microservice/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
const router = express.Router();
import { natsWrapper } from '../nats-wrapper';


router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    };

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        },

    });

    res.status(204).send(order);
});

export { router as deleteOrderRouter }; 