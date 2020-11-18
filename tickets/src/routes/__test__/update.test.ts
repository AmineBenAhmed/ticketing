import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';


it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .post(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'gbgbd',
      price: 20
    })
    .expect(404)
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
  .post(`/api/tickets/${id}`)  
  .send({
    title: 'gbgbd',
    price: 20
  })
  .expect(404)
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())//the id is stored in the cookie it can be reused
    .send({
      title: 'sometitle',
      price: 20
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'ghedhzugh1',
      price: 1222
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'someticket',
      price: 120
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'someTicket',
      price: -85
    })
    .expect(400)



});

it('updates the ticket if provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'someticket',
      price: 120
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 50
    })
    .expect(200);

  const ticketResp = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResp.body.title).toEqual('new title');
  expect(ticketResp.body.price).toEqual(50);
});


it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'someticket',
      price: 120
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 50
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
