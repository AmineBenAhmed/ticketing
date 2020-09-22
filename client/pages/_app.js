import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent =  ({Component, pageProps }) => {
  return (
    <div>
      <Header currentUser={pageProps.currentUser} />
      <Component {...pageProps} />
    </div>
  )
}

//to use bootstarp we import it in this component after he import all pages inside of it
//nextjs automatically import all components
//nextjs wrpas all components inside this custom default component and show it inside the screen

AppComponent.getInitialProps = async (context) => { //the getServerSideProps method get data from server before rendering the page
  // Fetch currentuser data from auth service
  const pageProps = {};
  const client = buildClient(context.ctx)
  const { data } = await client.get('/api/users/currentuser');
  pageProps.currentUser = data.currentUser;

  return {pageProps};
  }

  export default AppComponent;
