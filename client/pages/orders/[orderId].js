import Router from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout'; 

import buildClient from "../../api/build-client";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
      },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>
      Order expired !
      </div>
  }

  return (
  <div>
    Time left to pay {timeLeft} seconds
    <StripeCheckout
      token={ ({ id }) => doRequest({ token: id }) }
      stripeKey='pk_test_51HpfM1BZZcOeUTELTD0M7l1YB2NN2fVH9gn3WGVJHVvp1am611yME2E7oGRWJn1Y4CjtVArgkhK6C305BYq6SjXn00GmUKAYSZ'
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
  </div>
  )
}

export async function getServerSideProps(context) { //the getServerSideProps method get data from server before rendering the page
  const client = buildClient(context);
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { props: {order: data} } //data must be returned in the form { props: { data } } as props for the component
}


export default OrderShow;