import React from 'react';
import ImagenLogo from './ImagenLogo';
import { Link } from 'react-router-dom';
//se usa para mostrar la ruta activa
import useActiveRoute from 'hooks/useActiveRoute';
import { useAuth0 } from '@auth0/auth0-react';

const Sidebar = () => {
  const { user, logout } = useAuth0();

  const cerrarSesion = () => {
    logout({ returnTo: 'http://localhost:3000/admin' });
    localStorage.setItem('token', null);
  };

  return (
    <nav className='hidden lg:flex lg:w-72 border border-gray-300 h-full flex-col bg-gray-500 p-4 sidebar'>
      <Link to='/admin'>
        <ImagenLogo />
      </Link>

      <div className='my-4'>
        <Ruta icono='fas fa-user' ruta='/admin/perfil' nombre='Perfil' usuario={user} />
        <Ruta icono='fas fa-car' ruta='/admin/productos' nombre='Productos' />
        <Ruta icono='fas fa-cash-register' ruta='/admin/ventas' nombre='Ventas' />
        <Ruta icono='fas fa-users' ruta='/admin/usuarios' nombre='Usuarios' />
      </div>
      <button onClick={() => cerrarSesion()}>Cerrar Sesión</button>
    </nav>
  );
};

//mostramos la ruta activa y cambiamos el color del boton
const Ruta = ({ icono, ruta, nombre, usuario}) => {
  const isActive = useActiveRoute(ruta);
  return (
    <Link to={ruta}>
      <button
        className={`p-1 my-2  bg-${
          isActive ? 'indigo' : 'gray'
        }-700 hover:bg-indigo-900 flex w-full items-center text-white rounded-md`}
      >
        {usuario ? (
          <>
            <img src={usuario.picture} className='h-5 w-5 rounded-full' />
            {usuario.name}
          </>
        ) : (
          <>
        <i className={`${icono} w-10`} />
        {nombre}
        </>
        )} 
      </button>
    </Link>
  );
};

export default Sidebar;
