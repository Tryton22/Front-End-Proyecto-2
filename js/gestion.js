var g_id_gestion = "";

//----------------------------------------
// LISTAR (READ)
//----------------------------------------
function listarGestiones() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "query": "select g.id_gestion,u.id_usuario as rut_usuario,CONCAT(u.nombres,' ',u.apellidos) as nombre_usuario,c.id_cliente as rut_cliente,CONCAT(c.nombres,' ',c.apellidos) as nombre_cliente,tg.nombre_tipo_gestion,r.nombre_resultado,g.comentarios,g.fecha_registro from gestion g,usuario u,cliente c,resultado r,tipo_gestion tg where g.id_usuario = u.id_usuario and g.id_cliente = c.id_cliente and g.id_resultado = r.id_resultado and g.id_tipo_gestion = tg.id_tipo_gestion"
    })

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    }   

    fetch("http://144.126.136.43/dynamic", requestOptions)
    .then((response) => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_gestion').DataTable();
    })
}

function completarFila(element,index,arr) {
    arr[index] = document.querySelector("#tbl_gestion tbody").innerHTML  +=
    `<tr>
    <td>${element.id_gestion}</td>
    <td>${element.rut_usuario}</td>
    <td>${element.nombre_usuario}</td>
    <td>${element.rut_cliente}</td>
    <td>${element.nombre_cliente}</td>
    <td>${element.nombre_tipo_gestion}</td>
    <td>${element.nombre_resultado}</td>
    <td>${element.comentarios}</td>
    <td>${element.fecha_registro}</td>
    <td>
    <a href='actualizar_gestion.html?id=${element.id_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
    <a href='eliminar_gestion.html?id=${element.id_gestion}' class='btn btn-danger btn-sm'>Eliminar</a>
    </td>
    </tr>`
}

//----------------------------------------
// AGREGAR (CREATE)
//----------------------------------------
function cargarListasDesplegables() {
    //Ejecutamos función para cargar clientes, usuarios, tipo_gestion y resultados desde la API.
    cargarListaClientes();
    cargarListaUsuarios();
    cargarListaTipoGestion();
    cargarListaResultados();
}

//Funcion que carga la lista de clientes.
function cargarListaClientes() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/cliente", requestOptions)
    .then((response) => response.json())
    .then((json) => {
        json.forEach(completarOptionCliente);
    })
    .catch((error) => console.error(error));
}

function completarOptionCliente(element, index, arr) {
    arr[index] = document.querySelector("#sel_cliente").innerHTML +=
    `<option value='${element.id_cliente}'>${element.id_cliente}-${element.dv} ${element.apellidos} ${element.nombres}</option>`
}

//Funcion que carga la lista de usuarios.
function cargarListaUsuarios() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/usuario", requestOptions)
    .then((response) => response.json())
    .then((json) => {
        json.forEach(completarOptionUsuario);
    })
    .catch((error) => console.error(error));
}

function completarOptionUsuario(element, index, arr) {
    arr[index] = document.querySelector("#sel_usuario").innerHTML +=
    `<option value='${element.id_usuario}'>${element.id_usuario}-${element.dv} ${element.apellidos} ${element.nombres}</option>`
}

//Funcion que carga la lista de resultados.
function cargarListaResultados() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/resultado", requestOptions)
    .then((response) => response.json())
    .then((json) => {
        json.forEach(completarOptionResultado);
    })
    .catch((error) => console.error(error));
}

function completarOptionResultado(element, index, arr) {
    arr[index] = document.querySelector("#sel_resultado").innerHTML +=
    `<option value='${element.id_resultado}'>${element.id_resultado} ${element.nombre_resultado}</option>`
}

//Funcion que carga la lista de tipo de gestiones.
function cargarListaTipoGestion() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/tipo_gestion", requestOptions)
    .then((response) => response.json())
    .then((json) => {
        json.forEach(completarOptionTipoGestion);
    })
    .catch((error) => console.error(error));
}

function completarOptionTipoGestion(element, index, arr) {
    arr[index] = document.querySelector("#sel_tipo_gestion").innerHTML +=
    `<option value='${element.id_tipo_gestion}'>${element.id_tipo_gestion} ${element.nombre_tipo_gestion}</option>`
}

function agregarGestion() {
    //Obtenemos todos los campos necesarios para agregar una gestion.
    var usuario = document.getElementById("sel_usuario");
    var cliente = document.getElementById("sel_cliente");
    var tipo = document.getElementById("sel_tipo_gestion");
    var resultado = document.getElementById("sel_resultado");
    var comentario = document.getElementById("txa_comentario");

    //Alerta para comprobar que el comentario se ingreso correctamente
    var alerta = document.getElementById("alertaGestion");

    //Creamos una variable local para guardar los posibles errores.
    var existenErrores = false;

    //Validamos el campo comentario.

    //Comentario, no vacío.
    if (comentario.value === "") {
        marcarInvalido(comentario);
        existenErrores = true;
    } else {
        marcarValido(comentario);
    }

    // Mostrar alerta si hay existen errores al ingresar los datos de la gestion.
    if (existenErrores) {
        alerta.textContent = "Por favor, ingrese correctamente el campo marcado.";
        alerta.classList.remove("d-none");
        alerta.classList.add("show");
        setTimeout(() => { 
            alerta.classList.add("d-none")
        }, 4000);
        return;
    }

    // Función para marcar si lo ingresado es válido o no.
    function marcarInvalido(campo) {
        campo.classList.add("is-invalid");
        campo.classList.remove("is-valid");
    }

    function marcarValido(campo) {
        campo.classList.add("is-valid");
        campo.classList.remove("is-invalid");
    }

    //Definición de encabezados.
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Obtenemos la fecha y hora del sistema.
    var fecha_actual = obtenerFechaHora();

    //Datos a enviar
    const raw = JSON.stringify({ // Transforma el string a un formato JSON.
    "id_usuario": usuario.value,
    "id_cliente": cliente.value,
    "id_tipo_gestion": tipo.value,
    "id_resultado": resultado.value,
    "comentarios": comentario.value,
    "fecha_registro": fecha_actual
    });

    //Configuración de la solicitud
    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    //Ejecutamos la solicitud HTTP a la API
    fetch("http://144.126.136.43/api/gestion?_size=200", requestOptions)
    .then((response) => {
        if (response.status == 200) {
            window.location.href = "listar_gestion.html";
        }
    })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

//----------------------------------------
// ACTUALIZAR (UPDATE)
//----------------------------------------
function cargarListasDesplegablesActualizacion() {
    //Ejecutamos función para cargar clientes, usuarios, tipo_gestion y resultados desde la API.
    cargarListaClientesActualizar();
    cargarListaUsuariosActualizar();
    cargarListaTipoGestionActualizar();
    cargarListaResultadosActualizar();
}

//Funcion que carga la lista de clientes.
function cargarListaClientesActualizar() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/cliente", requestOptions)
    .then((response) => response.json())
    .then((json) => {
        json.forEach(completarOptionClienteActualizar);
    })
    .catch((error) => console.error(error));
}

function completarOptionClienteActualizar(element, index, arr) {
    arr[index] = document.querySelector("#sel_nuevo_cliente").innerHTML +=
    `<option value='${element.id_cliente}'>${element.id_cliente}-${element.dv} ${element.apellidos} ${element.nombres}</option>`
}

//Funcion que carga la lista de usuarios.
function cargarListaUsuariosActualizar() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/usuario", requestOptions)
    .then((response) => response.json())
    .then((json) => {
        json.forEach(completarOptionUsuarioActualizar);
    })
    .catch((error) => console.error(error));
}

function completarOptionUsuarioActualizar(element, index, arr) {
    arr[index] = document.querySelector("#sel_nuevo_usuario").innerHTML +=
    `<option value='${element.id_usuario}'>${element.id_usuario}-${element.dv} ${element.apellidos} ${element.nombres}</option>`
}

//Funcion que carga la lista de resultados.
function cargarListaResultadosActualizar() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/resultado", requestOptions)
    .then((response) => response.json())
    .then((json) => {
        json.forEach(completarOptionResultadoActualizar);
    })
    .catch((error) => console.error(error));
}

function completarOptionResultadoActualizar(element, index, arr) {
    arr[index] = document.querySelector("#sel_nuevo_resultado").innerHTML +=
    `<option value='${element.id_resultado}'>${element.id_resultado} ${element.nombre_resultado}</option>`
}

//Funcion que carga la lista de tipo de gestiones.
function cargarListaTipoGestionActualizar() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/tipo_gestion", requestOptions)
    .then((response) => response.json())
    .then((json) => {
        json.forEach(completarOptionTipoGestionActualizar);
    })
    .catch((error) => console.error(error));
}

function completarOptionTipoGestionActualizar(element, index, arr) {
    arr[index] = document.querySelector("#sel_nuevo_tipo_gestion").innerHTML +=
    `<option value='${element.id_tipo_gestion}'>${element.id_tipo_gestion} ${element.nombre_tipo_gestion}</option>`
}

function actualizarGestion() {
    //Obtenemos todos los campos necesarios para actualizar una gestion.
    var usuario = document.getElementById("sel_nuevo_usuario");
    var cliente = document.getElementById("sel_nuevo_cliente");
    var tipo = document.getElementById("sel_nuevo_tipo_gestion");
    var resultado = document.getElementById("sel_nuevo_resultado");
    var comentario = document.getElementById("txa_nuevo_comentario");

    //Alerta para comprobar que el comentario se ingreso correctamente
    var alerta = document.getElementById("alertaGestionActualizacion");

    //Creamos una variable local para guardar los posibles errores.
    var existenErrores = false;

    //Validamos el campo comentario.

    //Comentario, no vacío.
    if (comentario.value === "") {
        marcarInvalido(comentario);
        existenErrores = true;
    } else {
        marcarValido(comentario);
    }

    //Mostrar alerta si hay existen errores al ingresar los datos de la nueva gestion.
    if (existenErrores) {
        alerta.textContent = "Por favor, ingrese correctamente el campo marcado.";
        alerta.classList.remove("d-none");
        alerta.classList.add("show");
        setTimeout(() => { 
            alerta.classList.add("d-none")
        }, 4000);
        return;
    }

    //Función para marcar si lo ingresado es válido o no.
    function marcarInvalido(campo) {
        campo.classList.add("is-invalid");
        campo.classList.remove("is-valid");
    }

    function marcarValido(campo) {
        campo.classList.add("is-valid");
        campo.classList.remove("is-invalid");
    }

    //Definición de encabezados.
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Obtenemos la fecha y hora del sistema.
    var fecha_actual = obtenerFechaHora();

    //Datos a enviar
    const raw = JSON.stringify({ // Transforma el string a un formato JSON.
    "id_usuario": usuario.value,
    "id_cliente": cliente.value,
    "id_tipo_gestion": tipo.value,
    "id_resultado": resultado.value,
    "comentarios": comentario.value,
    "fecha_registro": fecha_actual
    });

    const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    fetch("http://144.126.136.43/api/gestion/" + g_id_gestion, requestOptions)
        .then((response) => {
            //Verificamos si la respuesta tiene un codigo HTTP 200
            if (response.status == 200) {
                //alert("OK")
                //Rediccionamos a la lista
                location.href = "listar_gestion.html";
            }
        })
}

// Obtenemos el ID de la gestion que queremos actualizar.
function obtenerIdActualizacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_gestion = parametros.get("id");

    // Asignamos a la variable global el id a actualizar.
    g_id_gestion = p_id_gestion;

    cargarListasDesplegablesActualizacion();
    // Invocamos un método para obtener los datos de la gestion en particular.
    obtenerDatosActualizacion(p_id_gestion);
}

function obtenerDatosActualizacion(id_gestion) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/gestion/"+id_gestion, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarFormulario))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarFormulario(element,index,arr) {
    var idUsuario = element.id_usuario;
    var idCliente = element.id_cliente;
    var idTipoGestion = element.id_tipo_gestion;
    var idResultado = element.id_resultado;
    var comentarios = element.comentarios;

    document.getElementById("sel_nuevo_usuario").value = idUsuario;
    document.getElementById("sel_nuevo_cliente").value = idCliente;
    document.getElementById("sel_nuevo_tipo_gestion").value = idTipoGestion;
    document.getElementById("sel_nuevo_resultado").value = idResultado;
    document.getElementById("txa_nuevo_comentario").value = comentarios;
}

//----------------------------------------
// ELIMINAR (DELETE)
//----------------------------------------
function eliminarGestion() {
    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/gestion/" + g_id_gestion, requestOptions)
    .then((response) => {
        if (response.status == 200) {
            window.location.href = "listar_gestion.html";
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function obtenerIdEliminacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_gestion = parametros.get("id");
    // Asignamos la variable global al ID a eliminar.
    g_id_gestion = p_id_gestion;
    // Invocamos un método para obtener los datos de la gestion a eliminar.
    obtenerDatosEliminacion(p_id_gestion);
}

function obtenerDatosEliminacion(id_gestion) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/gestion/"+id_gestion, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarEtiquetas))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarEtiquetas(element,index,arr) {
    //Completamos un etiqueta con la pregunta al usuario que va a eliminar.
    var idEliminar = element.id_gestion;
    var rutEliminar = element.id_usuario;
    document.getElementById("lbl_eliminar").innerHTML = "<b>" + idEliminar + ",      " + rutEliminar + "</b>";
}

//----------------------------------------
// FORMATO HORA REGISTRO
//----------------------------------------
function obtenerFechaHora(){
  var fechaHoraActual = new Date();
  var fechaFormateada = fechaHoraActual.toLocaleString('es-ES',{
    hour12:false,
    year:'numeric',
    month:'2-digit', 
    day:'2-digit',
    hour:'2-digit',
    minute:'2-digit', 
    second:'2-digit'
  }).replace(/(\d+)\/(\d+)\/(\d+)\,\s*(\d+):(\d+):(\d+)/,'$3-$2-$1 $4:$5:$6');

 return fechaFormateada;
}
