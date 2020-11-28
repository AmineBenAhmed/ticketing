import Link from "next/link";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketsList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]"/*url to folder*/ as={`/tickets/${ticket.id}`} /* true url used to view the ticket */>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  })
  return currentUser ? 
  <div>
    <h1>Tickets</h1>
    <table className="table" >
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Link</th>
        </tr>  
      </thead>
      <tbody>
        {ticketsList}
      </tbody>
    </table>
  </div>
  : <h1>You are NOT signed in</h1>
}

//the getServerSideProps method is used instead  of getInitialProps
export async function getServerSideProps(context) { //the getServerSideProps method get data from server before rendering the page
    const client = buildClient(context)
    const { data } = await client.get('/api/tickets');
    return { props: { tickets: data } } //data must be returned in the form { props: { data } } as props for the component
  }

// LandingPage.getInitialProps = async (context) => { //the getServerSideProps method get data from server before rendering the page
//   // Fetch currentuser data from auth service
// console.log(Object.keys(context));
//     const client = buildClient(context)
//     const { data } = await client.get('/api/users/currentuser');
//  //   console.log(data);
    
//     //return { props: { data } } //data must be returned in the form { props: { data } } as props for the component
//   return data
//   }


export default LandingPage;