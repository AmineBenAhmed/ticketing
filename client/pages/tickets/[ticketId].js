import Router from "next/router";
import buildClient from "../../api/build-client";
import useRequest from "../../hooks/use-request";

const TicketShow = ({ticket}) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`) //first param is the path to the file displaying order and the second is the real used url
  });
  return (
    <div>
      <h1>Title:  {ticket.title}</h1>
      <h4>Price:{ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">Purshace </button>
    </div>
  )
};

export async function getServerSideProps(context) { //the getServerSideProps method get data from server before rendering the page
  const client = buildClient(context);
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { props: {ticket: data} } //data must be returned in the form { props: { data } } as props for the component
}


export default TicketShow;