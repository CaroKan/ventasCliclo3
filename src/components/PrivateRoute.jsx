import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ReactLoading from 'react-loading';
//import { obtenerDatosUsuario } from 'utils/api';
//import { useUser } from 'context/userContext';
import { obtenerDatosUsuario } from 'utils/api';
import { useUser } from 'context/userContext';

const PrivateRoute = ({ children }) => {

  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const {setUserData}=useUser();
  useEffect(() => {

    const fetchAuth0Token = async () => {

      //1. pedir token a auth0
      const accessToken= await getAccessTokenSilently({
        audience: 'apiVentas',
      });
      //2. recibir token de auth0
      localStorage.setItem('token', accessToken);
      console.log(accessToken);
      //3. enviarle el token al backen
      await obtenerDatosUsuario(
        (response)=>{
          console.log('response', response);
          setUserData(response.data);
          
        },
        (err)=>{
          console.log('err', err);
        }
      );
    };
    if (isAuthenticated) {
      fetchAuth0Token();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) return <ReactLoading type='cylon' color='#abc123' height={667} width={375} />;

  if (!isAuthenticated) {
  return loginWithRedirect();
  }

  return <>{children}</>;


};
export default PrivateRoute;
/********************************************************* */
// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
//   const { setUserData } = useUser();

//   useEffect(() => {
//     const fetchAuth0Token = async () => {
//       // si se quieren hacer validaciones con el token:
//       // if (localStorage.getItem('token')) {
//       //   // validar fecha de expiracion del token
//       // } else {
//       //   // pedir token
//       // }

//       // 1. pedir token a auth0
//       const accessToken = await getAccessTokenSilently({
//        audience: `apiVentas`,
//       });
//       // 2. recibir token de auth0
//       localStorage.setItem('token', accessToken);
//       console.log(accessToken);
//       // 3. enviarle el token a el backend
//       await obtenerDatosUsuario(
//         (response) => {
//           console.log('response con datos del usuario', response);
//           setUserData(response.data);
//         },
//         (err) => {
//           console.log('err', err);
//         }
//       );
//     };
//     if (isAuthenticated) {
//       fetchAuth0Token();
//     }
//   }, [isAuthenticated, getAccessTokenSilently]);

//   if (isLoading) return <ReactLoading type='cylon' color='#abc123' height={667} width={375} />;

//   if (!isAuthenticated) {
//     return loginWithRedirect();
//   }

//   return <>{children}</>;
// };

/********************************************* */
// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated, isLoading} = useAuth0();

//   if (isLoading) return <ReactLoading type='spinningBubbles' color='#abc123' height={667} width={375} />;

//   return isAuthenticated ? (
//     <>{children}</>
//   ) : (
//     <div>
//       <div className='text-9xl text-red-500 '>No estas autorizado para ver este sitio.</div>
//       <Link to='/'>
//         <span className='text-blue-500 font-bold'>Llévame al home</span>
//       </Link>
//     </div>
//   );
// };


