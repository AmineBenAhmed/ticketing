const LandingPage = (props) => {
  return props.currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
}

// export async function getServerSideProps(context) { //the getServerSideProps method get data from server before rendering the page
//   // Fetch currentuser data from auth service
//  // console.log(context);
//     const client = buildClient(context)
//     const { data } = await client.get('/api/users/currentuser');
//     return { props: { data } } //data must be returned in the form { props: { data } } as props for the component
//   }

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