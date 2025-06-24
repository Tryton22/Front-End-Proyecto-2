var g_id_cliente = "";

//----------------------------------------
// LISTAR (READ)
//----------------------------------------
function listarCliente() {
    const requestOptions = {
    method: "GET",
    redirect: "follow"
    };

    fetch("http://144.126.136.43/api/cliente", requestOptions)
    .then((response) => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_cliente').DataTable();
    })
}

function completarFila(element,index,arr) {
    arr[index] = document.querySelector("#tbl_cliente tbody").innerHTML  +=
    `<tr>
    <td>${element.id_cliente}</td>
    <td>${element.dv}</td>
    <td>${element.nombres}</td>
    <td>${element.apellidos}</td>
    <td>${element.email}</td>
    <td>${element.celular}</td>
    <td>${element.fecha_registro}</td>
    <td>
    <a href='actualizar_cliente.html?id=${element.id_cliente}' class='btn btn-warning btn-sm'>Actualizar</a>
    <a href='eliminar_cliente.html?id=${element.id_cliente}' class='btn btn-danger btn-sm'>Eliminar</a>
    </td>
    </tr>`
}

//----------------------------------------
// AGREGAR (CREATE)
//----------------------------------------
function agregarCliente() {
    //Obtenemos todos los campos necesarios para agregar un cliente.
    var id = document.getElementById("txt_id");
    var dv = document.getElementById("txt_dv");
    var primer_nombre = document.getElementById("txt_nombre_1");
    var segundo_nombre = document.getElementById("txt_nombre_2");
    var primer_apellido = document.getElementById("txt_apellido_1");
    var segundo_apellido = document.getElementById("txt_apellido_2");
    var email = document.getElementById("txt_email");
    var celular = document.getElementById("txt_celular");

    //Alerta para comprobar que los campos se ingresaron correctamente.
    var alerta = document.getElementById("alertaCliente");

    //Creamos una variable local para guardar los posibles errores.
    var existenErrores = false;

    //Validamos los campos de a uno.
        
    // ID, no vacío y entre 7-8 números.
    if (!/^\d{7,8}$/.test(id.value)) {
        marcarInvalido(id);
        existenErrores= true;
    } else {
        marcarValido(id);
    }

    // DV, un solo dígito (1-9 o K)
    if (!/^[0-9Kk]{1}$/.test(dv.value)) {
        marcarInvalido(dv);
        existenErrores = true;
    } else {
        marcarValido(dv);
    }

    // Nombres y apellidos, no vacío y solo letras. 
    var soloLetras = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/;

    [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido].forEach(campo => {
        if (campo.value === "" || !soloLetras.test(campo.value)) {
            marcarInvalido(campo);
            existenErrores = true;
        } else {
            marcarValido(campo);
        }
    });

    // Email, formato correcto.
    var validar_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validar_email.test(email.value)) {
        marcarInvalido(email);
        existenErrores = true;
    } else {
        marcarValido(email);
    }

    // Celular, 8 números de longitud.
    if (!/^\d{8}$/.test(celular.value)) {
        marcarInvalido(celular);
        existenErrores = true;
    } else {
        marcarValido(celular);
    }

    // Mostrar alerta si hay existen errores al ingresar los datos del cliente.
    if (existenErrores) {
        alerta.textContent = "Por favor, ingrese correctamente los campos marcados.";
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
    "id_cliente": id.value,
    "dv": dv.value,
    "nombres": primer_nombre.value + " " + segundo_nombre.value,
    "apellidos": primer_apellido.value + " " + segundo_apellido.value,
    "email": email.value,
    "celular": celular.value,
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
    fetch("http://144.126.136.43/api/cliente?_size=200", requestOptions)
    .then((response) => {
        if (response.status == 200) {
            window.location.href = "listar_cliente.html";
        }
    })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function actualizarCliente() {
    //Obtenemos todos los campos actuales del formulario.
    var nuevo_primer_nombre = document.getElementById("txt_nuevo_nombre_1");
    var nuevo_segundo_nombre = document.getElementById("txt_nuevo_nombre_2");
    var nuevo_primer_apellido = document.getElementById("txt_nuevo_apellido_1");
    var nuevo_segundo_apellido = document.getElementById("txt_nuevo_apellido_2");
    var nuevo_email = document.getElementById("txt_nuevo_email");
    var nuevo_celular = document.getElementById("txt_nuevo_celular");
    var nuevo_username = document.getElementById("txt_nuevo_username");
    var nueva_clave = document.getElementById("txt_nuevo_password");

    //Alerta para comprobar que los campos se ingresaron correctamente.
    var alertaActualizacion = document.getElementById("alertaClienteActualizacion");

    //Creamos una variable local para guardar los posibles errores.
    var existenErrores = false;

    //Validamos los campos para actualizar de a uno.
        
    // Nombres y apellidos, no vacío y solo letras. 
    var soloLetras = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/;

    [nuevo_primer_nombre, nuevo_segundo_nombre, nuevo_primer_apellido, nuevo_segundo_apellido].forEach(campo => {
        if (campo.value === "" || !soloLetras.test(campo.value)) {
            marcarInvalido(campo);
            existenErrores = true;
        } else {
            marcarValido(campo);
        }
    });

    // Email, formato correcto.
    var validar_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validar_email.test(nuevo_email.value)) {
        marcarInvalido(nuevo_email);
        existenErrores = true;
    } else {
        marcarValido(nuevo_email);
    }

    // Celular, 8 números de longitud.
    if (!/^\d{8}$/.test(nuevo_celular.value)) {
        marcarInvalido(nuevo_celular);
        hayErrores = true;
    } else {
        marcarValido(nuevo_celular);
    }

    //Mostrar alerta si hay existen errores al ingresar los datos actualizados del cliente.
    if (existenErrores) {
        alertaActualizacion.textContent = "Por favor, ingrese correctamente los campos marcados para actualizar.";
        alertaActualizacion.classList.remove("d-none");
        alertaActualizacion.classList.add("show");
        setTimeout(() => { 
            alertaActualizacion.classList.add("d-none")
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

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Obtenemos la fecha y hora del sistema.
    var fecha_actual = obtenerFechaHora();

    const raw = JSON.stringify({
    "nombres": nuevo_primer_nombre.value + " " + nuevo_segundo_nombre.value,
    "apellidos": nuevo_primer_apellido.value + " " + nuevo_segundo_apellido.value,
    "email": nuevo_email.value,
    "celular": nuevo_celular.value,
    "fecha_registro": fecha_actual
    });

    const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    fetch("http://144.126.136.43/api/cliente/" + g_id_cliente, requestOptions)
        .then((response) => {
            //Verificamos si la respuesta tiene un codigo HTTP 200
            if (response.status == 200) {
                //alert("OK")
                //Rediccionamos a la lista
                location.href = "listar_cliente.html";
            }
        })
}

// Obtenemos el ID del cliente que queremos actualizar.
function obtenerIdActualizacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_cliente = parametros.get("id");

    // Asignamos a la variable global el id a actualizar.
    g_id_cliente = p_id_cliente;

    // Invocamos un método para obtener los datos del cliente en particular.
    obtenerDatosActualizacion(p_id_cliente);
}

function obtenerDatosActualizacion(id_cliente) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/cliente/"+id_cliente, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarFormulario))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarFormulario(element,index,arr) {
    var [nombre1Cliente, nombre2Cliente = ""] = element.nombres.split(" ");
    var [apellido1Cliente, apellido2Cliente = ""] = element.apellidos.split(" ");
    var emailCliente = element.email;
    var celularCliente = element.celular;

    document.getElementById("txt_nuevo_nombre_1").value = nombre1Cliente;
    document.getElementById("txt_nuevo_nombre_2").value = nombre2Cliente;
    document.getElementById("txt_nuevo_apellido_1").value = apellido1Cliente;
    document.getElementById("txt_nuevo_apellido_2").value = apellido2Cliente;
    document.getElementById("txt_nuevo_email").value = emailCliente;
    document.getElementById("txt_nuevo_celular").value = celularCliente;
}

//----------------------------------------
// ELIMINAR (DELETE)
//----------------------------------------
function eliminarCliente() {
    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/cliente/" + g_id_cliente, requestOptions)
    .then((response) => {
        if (response.status == 200) {
            window.location.href = "listar_cliente.html";
        } else {
            var alertaEliminacion = document.getElementById("alertaClienteEliminacion");
            alertaEliminacion.textContent = "El cliente que desea eliminar se encuentra en uso.";
            alertaEliminacion.classList.remove("d-none");
            alertaEliminacion.classList.add("show"); // Se muestra la alerta.
            setTimeout(() => {
                alertaEliminacion.classList.add("d-none");
            }, 3000) // Se oculta después de 3 segundos.
        }
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function obtenerIdEliminacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_cliente = parametros.get("id");

    // Asignamos la variable global al ID a eliminar.
    g_id_cliente = p_id_cliente;

    // Invocamos un método para obtener los datos del cliente a eliminar.
    obtenerDatosEliminacion(p_id_cliente);
}

function obtenerDatosEliminacion(id_cliente) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/cliente/"+id_cliente, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarEtiquetas))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarEtiquetas(element,index,arr) {
    //Completamos un etiqueta con la pregunta al usuario que va a eliminar.
    var rutEliminar = element.id_cliente;
    var dvEliminar = element.dv;
    document.getElementById("lbl_eliminar").innerHTML = "<b>" + rutEliminar + "-" + dvEliminar + "</b>";
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
