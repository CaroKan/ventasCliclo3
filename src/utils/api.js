import axios from 'axios';


//funcion para consultar los usuarios, se usa export para poderla usar en otros componentes
export const obtenerUsuarios = async (sucessCallback, errorCallback) => {
  const options = { method: 'GET', url: 'http://localhost:5000/usuarios/' };
  await axios.request(options).then(sucessCallback).catch(errorCallback);
};

//funcion para crear usuarios
export const crearUsuario= async (data,sucessCallback, errorCallback) =>{
  const options = { 
    method: 'POST',
    url: 'http://localhost:5000/usuarios/',
    headers: { 'Content-Type': 'application/json' },
    data,
  };
    await axios.request(options).then(sucessCallback).catch(errorCallback);
};

//funcion para editar usuarios
export const editarUsuario= async (id, data, sucessCallback, errorCallback) =>{
   //enviar la info al backend
   const options = {
    method: 'PATCH',
    url: `http://localhost:5000/usuarios/${id}/`,
    headers: { 'Content-Type': 'application/json' },
    data,
  };
    await axios.request(options).then(sucessCallback).catch(errorCallback);
};

//funcion para eliminar el usuario
export const deleteUsuario= async (id,sucessCallback, errorCallback) =>{
  //enviar la info al backend
  const options = {
    method: 'DELETE',
    url: `http://localhost:5000/usuarios/${id}/`,
    headers: { 'Content-Type': 'application/json' },
 };
   await axios.request(options).then(sucessCallback).catch(errorCallback);
};