import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { nanoid } from "nanoid";
import { Dialog, Tooltip } from "@material-ui/core";
import {obtenerUsuarios,crearUsuario, editarUsuario,deleteUsuario} from "utils/api";
import "react-toastify/dist/ReactToastify.css";

const Usuarios = () => {
  //declaracion de funciones para mostrar los datos en la tabla
  //ejecutar consultas y cambiar las vistas
  const [mostrarTabla, setMostrarTabla] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [textoBoton, setTextoBoton] = useState("Crear Nuevo usuario");
  const [colorBoton, setColorBoton] = useState("indigo");
  const [ejecutarConsulta, setEjecutarConsulta] = useState(true);

  //uso el hook useEffct para leer la informacion de la base de datos
  useEffect(() => {
    const fetcUsuarios = async () => {
      //leeo los usuarios pasandole dos funciones; si hay un response lo setea a la tabla usuarios
      //si hay un error lo muestra en consola ---->esta definida en "utils/api.js"
      await obtenerUsuarios(
        (response) => {
          setUsuarios(response.data);
          setEjecutarConsulta(false);
        },
        (error) => {
          console.error(error);
        }
      );
    };
    console.log('consulta', ejecutarConsulta);
    if (ejecutarConsulta) {
      fetcUsuarios();
    }
  }, [ejecutarConsulta]);

  //useEffect para verificar que se muestra en la carga inicial de la pagina.
  useEffect(() => {
    //obtener lista de usuarios desde el backend
    if (mostrarTabla) {
      setEjecutarConsulta(true);
    }
  }, [mostrarTabla]);

  useEffect(() => {
    if (mostrarTabla) {
      setTextoBoton("Crear Nuevo Usuario");
      setColorBoton("indigo");
    } else {
      setTextoBoton("Mostrar Todos los usuarios");
      setColorBoton("green");
    }
  }, [mostrarTabla]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start p-8">
      <div className="flex flex-col w-full">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Administración de usuarios
        </h2>
        <button
          onClick={() => {
            setMostrarTabla(!mostrarTabla);
          }}
          className={`text-white bg-${colorBoton}-500 p-5 rounded-xl m-6 w-25 self-end`}
        >
          {textoBoton}
        </button>
      </div>
      {/*verifico el estado de la variable tabla para si muestro la tabla o el formulario*/}
      {mostrarTabla ? (
        <TablaUsuarios
          listaUsuarios={usuarios}
          setEjecutarConsulta={setEjecutarConsulta}
        />
      ) : (
        <FormularioCreacionUsuarios
          setMostrarTabla={setMostrarTabla}
          listaUsuarios={usuarios}
          setUsuarios={setUsuarios}
        />
      )}
      <ToastContainer position="bottom-center" autoClose={5000} />
    </div>
  );
};

//se crea la tabla y se llena con la informacion de la consulta a la base de datos
const TablaUsuarios = ({ listaUsuarios, setEjecutarConsulta }) => {
  const [busqueda, setBusqueda] = useState('');
  const [usuariosFiltrados, setUsuariosFiltrados] = useState(listaUsuarios);
  //este hook se usa para escuchar cualquier cambio que se haga en el recuadro de busqueda
  useEffect(() => {
    setUsuariosFiltrados(
      listaUsuarios.filter((elemento) => {
        return JSON.stringify(elemento)
          .toLowerCase()
          .includes(busqueda.toLowerCase());
      })
    );
  }, [busqueda, listaUsuarios]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar"
        className="border-2 border-gray-700 px-3 py-1 self-start rounded-md focus:outline-none focus:border-indigo-500"
      />
      <h2 className="text-2xl font-extrabold text-gray-800">
        Todos los Usuarios
      </h2>
      <div className="hidden md:flex w-full">
        <table className="tabla">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Correo electrónico</th>
              <th>clave</th>
              <th>Estado</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/*se usa key para poner un identificador único a cada fila de la tabla*/}
            {usuariosFiltrados.map((usuario) => {
              return (
                <FilaUsuario
                  key={nanoid()}
                  usuario={usuario}
                  setEjecutarConsulta={setEjecutarConsulta}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col w-full m-2 md:hidden">
        {usuariosFiltrados.map((el) => {
          return (
            <div className="bg-gray-400 m-2 shadow-xl flex flex-col p-2 rounded-xl">
              <span>{el.nombre}</span>
              <span>{el.correo}</span>
              <span>{el.contraseña}</span>
              <span>{el.estado}</span>
              <span>{el.rol}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FilaUsuario = ({ usuario, setEjecutarConsulta }) => {
  const [edit, setEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [infoNuevoUsuario, setInfoNuevoUsuario] = useState({
    _id: usuario._id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    contraseña: usuario.contraseña,
    estado: usuario.estado,
    rol: usuario.rol,
  });

  const actualizarUsuario = async () => {
    await editarUsuario(
      usuario._id,
      {
        nombre: infoNuevoUsuario.nombre,
        correo: infoNuevoUsuario.correo,
        contraseña: infoNuevoUsuario.contraseña,
        estado: infoNuevoUsuario.estado,
        rol: infoNuevoUsuario.rol,
      },
      (response) => {
        console.log(response.data);
        toast.success("Usuario modificado con éxito");
        setEdit(false);
        setEjecutarConsulta(true);
      },
      (error) => {
        toast.error("Error modificando el usuario");
        console.error(error);
      }
    );
  };

  const eliminarUsuario = async () => {
    await deleteUsuario(
      usuario._id,
      (response) => {
        console.log(response.data);
        toast.success("Usuario eliminado con éxito");
        setEjecutarConsulta(true);
      },
      (error) => {
        console.error(error);
        toast.error("Error eliminando el Usuario");
      }
    );
    setOpenDialog(false);
  };

  return (
    <tr>
      {edit ? (
        <>
          <td>{infoNuevoUsuario._id}</td>
          <td>
            <input
              className="bg-gray-50 border border-gray-600 p-2 rounded-lg m-2"
              type="text"
              value={infoNuevoUsuario.nombre}
              onChange={(e) =>
                setInfoNuevoUsuario({
                  ...infoNuevoUsuario,
                  nombre: e.target.value,
                })
              }
            />
          </td>
          <td>
            <input
              className="bg-gray-50 border border-gray-600 p-2 rounded-lg m-2"
              type="text"
              value={infoNuevoUsuario.correo}
              onChange={(e) =>
                setInfoNuevoUsuario({
                  ...infoNuevoUsuario,
                  correo: e.target.value,
                })
              }
            />
          </td>
          <td>
            <input
              className="bg-gray-50 border border-gray-600 p-2 rounded-lg m-2"
              type="text"
              value={infoNuevoUsuario.contraseña}
              onChange={(e) =>
                setInfoNuevoUsuario({
                  ...infoNuevoUsuario,
                  contraseña: e.target.value,
                })
              }
            />
          </td>
          <td>
          <input
              className="bg-gray-50 border border-gray-600 p-2 rounded-lg m-2"
              type="text"
              value={infoNuevoUsuario.estado}
              onChange={(e) =>
                setInfoNuevoUsuario({
                  ...infoNuevoUsuario,
                  estado: e.target.value,
                })
              }
            />
          </td>
          <td>
          <input
              className="bg-gray-50 border border-gray-600 p-2 rounded-lg m-2"
              type="text"
              value={infoNuevoUsuario.rol}
              onChange={(e) =>
                setInfoNuevoUsuario({
                  ...infoNuevoUsuario,
                  rol: e.target.value,
                })
              }
            />
          </td>
        </>
      ) : (
        <>
          <td>{usuario._id.slice(20)}</td>
          <td>{usuario.nombre}</td>
          <td>{usuario.correo}</td>
          <td>{usuario.contraseña}</td>
          <td>{usuario.estado}</td>
          <td>{usuario.rol}</td>
        </>
      )}
      <td>
        <div className="flex w-full justify-around">
          {edit ? (
            <>
              <Tooltip title="Confirmar Edición" arrow>
                <i
                  onClick={() => actualizarUsuario()}
                  className="fas fa-check text-green-700 hover:text-green-500"
                />
              </Tooltip>
              <Tooltip title="Cancelar edición" arrow>
                <i
                  onClick={() => setEdit(!edit)}
                  className="fas fa-ban text-yellow-700 hover:text-yellow-500"
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="Editar Usuario" arrow>
                <i
                  onClick={() => setEdit(!edit)}
                  className="fas fa-pencil-alt text-yellow-700 hover:text-yellow-500"
                />
              </Tooltip>
              <Tooltip title="Eliminar Usuario" arrow>
                <i
                  onClick={() => setOpenDialog(true)}
                  className="fas fa-trash text-red-700 hover:text-red-500"
                />
              </Tooltip>
            </>
          )}
        </div>
        <Dialog open={openDialog}>
          <div className="p-8 flex flex-col">
            <h1 className="text-gray-900 text-2xl font-bold">
              ¿Está seguro de querer eliminar el usuario?
            </h1>
            <div className="flex w-full items-center justify-center my-4">
              <button
                onClick={() => eliminarUsuario()}
                className="mx-2 px-4 py-2 bg-green-500 text-white hover:bg-green-700 rounded-md shadow-md"
              >
                Sí
              </button>
              <button
                onClick={() => setOpenDialog(false)}
                className="mx-2 px-4 py-2 bg-red-500 text-white hover:bg-red-700 rounded-md shadow-md"
              >
                No
              </button>
            </div>
          </div>
        </Dialog>
      </td>
    </tr>
  );
};

const FormularioCreacionUsuarios = ({
  setMostrarTabla,
  listaUsuarios,
  setUsuarios,
}) => {
  const form = useRef(null);

  const submitForm = async (e) => {
    e.preventDefault();
    const fd = new FormData(form.current);

    const nuevoUsuario = {};
    fd.forEach((value, key) => {
      nuevoUsuario[key] = value;
    });

    await crearUsuario(
      {
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        contraseña: nuevoUsuario.contraseña,
        estado: nuevoUsuario.estado,
      },
      (response) => {
        console.log(response.data);
        toast.success("Usuario agregado con exito");
      },

      (error) => {
        console.error(error);
        toast.error("Error creando el usuario");
      }
    );
    
    setMostrarTabla(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-800">
        Crear nuevo usuario
      </h2>
      <form ref={form} onSubmit={submitForm} className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm grid grid-cols-2 gap-2">
          <label htmlFor="nombre">
            Nombre
            <input
              name="nombre"
              type="text"
              autoComplete="Nombre"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Fabio"
            />
          </label>
          <label htmlFor="correo">
            Correo electrónico
            <input
              name="correo"
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </label>
          <label htmlFor="contraseña">
            Contraseña
            <input
              name="contraseña"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </label>
          <label htmlFor="estado">
            Estado del Usuario
            <input
              name="estado"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </label>
          <label htmlFor="rol">
            Rol del Usuario
            <select
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            name='rol'
            required
            defaultValue={0}
          >
            <option>
              Seleccione una opción
            </option>
            <option>Administrador</option>
            <option>Vendedor</option>
          </select>
          </label>
        </div>

        <button
          type="submit"
          className="col-span-2 bg-green-400 p-2 rounded-full shadow-md hover:bg-green-600 text-white"
        >
          Guardar Usuario
        </button>
      </form>
    </div>
  );
};

export default Usuarios;
