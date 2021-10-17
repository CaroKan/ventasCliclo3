import React, { useEffect, useState, useRef } from "react";
import PrivateComponent from 'components/PrivateComponent';
import { ToastContainer, toast } from "react-toastify";
import { nanoid } from "nanoid";
import { Dialog, Tooltip } from "@material-ui/core";
import {
  obtenerProductos,
  crearProducto,
  editarProducto,
  deleteProducto,
} from "utils/api";
import "react-toastify/dist/ReactToastify.css";

const Productos = () => {
    const [mostrarTabla, setMostrarTabla] = useState(true);
    const [productos, setProductos] = useState([]);
    const [textoBoton, setTextoBoton] = useState("Crear Nuevo producto");
    const [colorBoton, setColorBoton] = useState("indigo");
    const [ejecutarConsulta, setEjecutarConsulta] = useState(true);

    useEffect(() => {
      const pfetcProductos = async () => {
        //leeo los usuarios pasandole dos funciones; si hay un response lo setea a la tabla usuarios
        //si hay un error lo muestra en consola ---->esta definida en "utils/api.js"
        await obtenerProductos(
          (response) => {
            setProductos(response.data);
            setEjecutarConsulta(false);
          },
          (error) => {
            console.error(error);
          }
        );
      };
      console.log('consulta', ejecutarConsulta);
      if (ejecutarConsulta) {
        pfetcProductos();
      }
    }, [ejecutarConsulta]);
    
    useEffect(() => {
      if (mostrarTabla) {
        setEjecutarConsulta(true);
      }
    }, [mostrarTabla]);
  
    useEffect(() => {
      if (mostrarTabla) {
        setTextoBoton("Crear Producto");
        setColorBoton("indigo");
      } else {
        setTextoBoton("Mostrar Productos");
        setColorBoton("green");
      }
    }, [mostrarTabla]);
  
    return (
      <div className="flex h-full w-full flex-col items-center justify-start p-8">
        <div className="flex flex-col w-full">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Administración de productos
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
        {mostrarTabla ? (
          <TablaProductos
            listaProductos={productos}
            setEjecutarConsulta={setEjecutarConsulta}
          />
        ) : (
          <FormularioCreacionProductos
            setMostrarTabla={setMostrarTabla}
            listaProductos={productos}
            setProductos={setProductos}
          />
        )}
        <ToastContainer position="bottom-center" autoClose={5000} />
      </div>
    );
  };
  
  const TablaProductos = ({ listaProductos, setEjecutarConsulta }) => {
    const [busqueda, setBusqueda] = useState("");
    const [productosFiltrados, setProductosFiltrados] = useState(listaProductos);
    useEffect(() => {
      setProductosFiltrados(
        listaProductos.filter((elemento) => {
          return JSON.stringify(elemento)
            .toLowerCase()
            .includes(busqueda.toLowerCase());
        })
      );
    }, [busqueda, listaProductos]);
  
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar"
          className="border-2 border-gray-700 px-3 py-1 self-start rounded-md focus:outline-none focus:border-indigo-500"
        />
        <h2 className="text-2xl font-extrabold text-gray-800">
          Todos los Productos
        </h2>
        <div className="hidden md:flex w-full">
          <table className="tabla">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Valor Und</th>
                <th>Estado</th>
                <th>Descripcion</th>
                <PrivateComponent rolesList={['admin']}>
                  <th>Acciones</th>
                </PrivateComponent>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => {
                return (
                  <FilaProducto
                    key={nanoid()}
                    producto={producto}
                    setEjecutarConsulta={setEjecutarConsulta}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col w-full m-2 md:hidden">
          {productosFiltrados.map((el) => {
            return (
              <div className="bg-gray-400 m-2 shadow-xl flex flex-col p-2 rounded-xl">
                <span>{el.nombre}</span>
                <span>{el.valor}</span>
                <span>{el.estado}</span>
                <span>{el.descripcion}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const FilaProducto = ({ producto, setEjecutarConsulta }) => {
    const [edit, setEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [infoNuevoProducto, setInfoNuevoProducto] = useState({
      _id: producto._id,
      nombre: producto.nombre,
      valor: producto.valor,
      estado: producto.estado,
      descripcion: producto.descripcion,
    });
  
    const actualizarProducto = async () => {
      await editarProducto(
        producto._id,
        {
          nombre: infoNuevoProducto.nombre,
          valor: infoNuevoProducto.valor,
          estado: infoNuevoProducto.estado,
          descripcion: infoNuevoProducto.descripcion,
        },
        (response) => {
          console.log(response.data);
          toast.success(" modificado con éxito");
          setEdit(false);
          setEjecutarConsulta(true);
        },
        (error) => {
          toast.error("Error modificando el producto");
          console.error(error);
        }
      );
    };
  
    const eliminarProducto = async () => {
      await deleteProducto(
        producto._id,
        (response) => {
          console.log(response.data);
          toast.success(" eliminado con éxito");
          setEjecutarConsulta(true);
        },
        (error) => {
          console.error(error);
          toast.error("Error eliminando el producto");
        }
      );
      setOpenDialog(false);
    };
  
    return (
      <tr>
        {edit ? (
          <>
            <td>{infoNuevoProducto._id}</td>
            <td>
              <input
                className="bg-gray-50 border border-gray-600 p-2 rounded-lg m-2"
                type="text"
                value={infoNuevoProducto.nombre}
                onChange={(e) =>
                  setInfoNuevoProducto({
                    ...infoNuevoProducto,
                    nombre: e.target.value,
                  })
                }
              />
            </td>
            <td>
              <input
                className="bg-gray-50 border border-gray-600 p-2 rounded-lg m-2"
                type="text"
                value={infoNuevoProducto.valor}
                onChange={(e) =>
                  setInfoNuevoProducto({
                    ...infoNuevoProducto,
                    valor: e.target.value,
                  })
                }
              />
            </td>
            <td>
              <input
                className="bg-gray-50 border border-gray-600 p-2 rounded-lg m-2"
                type="text"
                value={infoNuevoProducto.estado}
                onChange={(e) =>
                  setInfoNuevoProducto({
                    ...infoNuevoProducto,
                    estado: e.target.value,
                  })
                }
              />
            </td>
            <td>
              <input
                className="bg-gray-50 border border-gray-600 p-2 rounded-lg m-2"
                type="text"
                value={infoNuevoProducto.descripcion}
                onChange={(e) =>
                  setInfoNuevoProducto({
                    ...infoNuevoProducto,
                    descripcion: e.target.value,
                  })
                }
              />
            </td>
          </>
        ) : (
          <>
            <td>{producto._id.slice(20)}</td>
            <td>{producto.nombre}</td>
            <td>{producto.valor}</td>
            <td>{producto.estado}</td>
            <td>{producto.descripcion}</td>
          </>
        )}
        <PrivateComponent rolesList={['admin']}> 
          <td>
              <div className="flex w-full justify-around">
                {edit ? (
                  <>
                    <Tooltip title="Confirmar Edición" arrow>
                      <i
                        onClick={() => actualizarProducto()}
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
                    <Tooltip title="Editar " arrow>
                      <i
                        onClick={() => setEdit(!edit)}
                        className="fas fa-pencil-alt text-yellow-700 hover:text-yellow-500"
                      />
                    </Tooltip>
                    <Tooltip title="Eliminar " arrow>
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
                  ¿Está seguro de querer eliminar el producto?
                </h1>
                <div className="flex w-full items-center justify-center my-4">
                  <button
                    onClick={() => eliminarProducto()}
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
        </PrivateComponent>   
      </tr>
    );
  };
  
  const FormularioCreacionProductos = ({
    setMostrarTabla,
    listaProductos,
    setProductos,
  }) => {
    const form = useRef(null);
  
    const submitForm = async (e) => {
      e.preventDefault();
      const fd = new FormData(form.current);
  
      const nuevoProducto = {};
      fd.forEach((value, key) => {
        nuevoProducto[key] = value;
      });
  
      await crearProducto(
        {
          nombre: nuevoProducto.nombre,
          valor: nuevoProducto.valor,
          estado: nuevoProducto.estado,
          descripcion: nuevoProducto.descripcion,
        },
  
        (response) => {
          console.log(response.data);
          toast.success(" agregado con exito");
        },
  
        (error) => {
          console.error(error);
          toast.error("Error creando el producto");
        }
      );
  
      setMostrarTabla(true);
    };
  
    return (
      <div>
        <h2 className="text-2xl font-extrabold text-gray-800 ">
          Crear nuevo producto
        </h2>
        <form ref={form} onSubmit={submitForm} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm grid grid-cols-2 gap-2 " >
            <label htmlFor="nombre">
              Nombre
              <input
                name="nombre"
                type="text"
                required
                autoFocus
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre del producto"
              />
            </label>
            <label htmlFor="valor">
              Valor
              <input
                name="valor"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Valor unitario"
              />
            </label>
            <label htmlFor="estado">
              Estado
              <select
                name="estado"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="" selected disabled>Disponibilidad</option>
                <option value="Disponible">Disponible</option>
                <option value="No Disponible">No disponible</option>
              </select>
            </label>
            <label htmlFor="descripcion">
              Descripcion
              <input
                name="descripcion"
                type="textarea"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Agrege una breve descripcion"
              />
            </label>
          </div>
  
          <button
            type="submit"
            className="col-span-2 bg-green-400 p-2 rounded-full shadow-md hover:bg-green-600 text-white"
          >
            Guardar 
          </button>
        </form>
      </div>
    );
  };
  
  export default Productos;
  