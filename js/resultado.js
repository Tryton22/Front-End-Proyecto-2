var g_id_resultado = "";

//----------------------------------------
// LISTAR (READ)
//----------------------------------------
function listarResultados() {
    const requestOptions = {
    method: "GET",
    redirect: "follow"
    };

    fetch("http://144.126.136.43/api/resultado", requestOptions)
    .then((response) => response.json())
    .then((json) => {
        json.forEach(completarFila);
        $('#tbl_resultado').DataTable();
    })
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function completarFila(element,index,arr) {
    arr[index] = document.querySelector("#tbl_resultado tbody").innerHTML  +=
    `<tr>
    <td>${element.id_resultado}</td>
    <td>${element.nombre_resultado}</td>
    <td>${element.fecha_registro}</td>
    <td>
    <a href='actualizar_resultado.html?id=${element.id_resultado}' class='btn btn-warning btn-sm'>Actualizar</a>
    <a href='eliminar_resultado.html?id=${element.id_resultado}' class='btn btn-danger btn-sm'>Eliminar</a>
    </td>
    </tr>`
}

//----------------------------------------
// AGREGAR (CREATE) 
//----------------------------------------
function agregarResultado() {
    //Obtenemos el resultado.
    var resultado = document.getElementById("txt_resultado");

    //Alerta que aparece si el resultado no está correctamente ingresado.
    var alerta = document.getElementById("alertaResultado"); 

    //Creamos una variable para guardar los posibles errores.
    var existenErrores = false;

    //Validamos si el campo nombre resultado esta vacío.

    //Nombre resultado, no vacío.
    if (resultado.value === "") {
        marcarInvalido(resultado);
        existenErrores = true;
    } else {
        marcarValido(resultado);
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

    // Mostrar alerta si hay existen errores al ingresar los datos del resultado.
    if (existenErrores) {
        alerta.textContent = "Por favor, ingrese correctamente el campo marcado.";
        alerta.classList.remove("d-none");
        alerta.classList.add("show");
        setTimeout(() => { 
            alerta.classList.add("d-none")
        }, 4000);
        return;
    }

    //Definición de encabezados.
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //Obtenemos la fecha y hora del sistema.
    var fecha_actual = obtenerFechaHora();

    //Datos a enviar
    const raw = JSON.stringify({ // Transforma el string a un formato JSON.
    "nombre_resultado": resultado.value,
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
    fetch("http://144.126.136.43/api/resultado?_size=200", requestOptions)
    .then((response) => {
        if (response.status == 200) {
            window.location.href = "listar_resultado.html";
        }
    })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

//----------------------------------------
// ACTUALIZAR (UPDATE)
//----------------------------------------
function actualizarResultado() {
    // Obtenemos el valor actual en el formulario.
    var nombre_resultado = document.getElementById("txt_nombre_resultado");

    //Alerta que aparece si la actualización no está correctamente ingresado.
    var alertaActualizacion = document.getElementById("alertaActualizacionResultado");
    
    //Creamos una variable local para guardar los posibles errores.
    var existenErrores = false;    

    //Nombre resultado, no vacío.
    if (nombre_resultado.value === "") {
        marcarInvalido(nombre_resultado);
        existenErrores = true;
    } else {
        marcarValido(nombre_resultado);
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

    // Mostrar alerta si hay existen errores al ingresar los nuevos datos del resultado.
    if (existenErrores) {
        alertaActualizacion.textContent = "Por favor, ingrese correctamente el campo marcado.";
        alertaActualizacion.classList.remove("d-none");
        alertaActualizacion.classList.add("show");
        setTimeout(() => { 
            alertaActualizacion.classList.add("d-none")
        }, 4000);
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({    
    "nombre_resultado": nombre_resultado.value
    });

    const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    fetch("http://144.126.136.43/api/resultado/" + g_id_resultado, requestOptions)
        .then((response) => {
            //Verificamos si la respuesta tiene un codigo HTTP 200
            if (response.status == 200) {
                //alert("OK")
                //Rediccionamos a la lista
                location.href = "listar_resultado.html";
            }
        })
}

// Obtenemos el ID del resultado que queremos actualizar.
function obtenerIdActualizacion() {
    const queryString = window.location.search;
    const parametros = new URLSearchParams(queryString);
    const p_id_resultado = parametros.get("id");

    // Asignamos a la variable global el id a actualizar.
    g_id_resultado = p_id_resultado;

    // Invocamos un método para obtener los datos del resultado en particular.
    obtenerDatosActualizacion(p_id_resultado);
}

function obtenerDatosActualizacion(id_resultado) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/resultado/"+id_resultado, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarFormulario))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarFormulario(element,index,arr) {
    var nombreResultado = element.nombre_resultado;
    document.getElementById("txt_nombre_resultado").value = nombreResultado;
}

//----------------------------------------
// ELIMINAR (DELETE)
//----------------------------------------
function eliminarResultado() {
    const requestOptions = {
        method: "DELETE",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/resultado/" + g_id_resultado, requestOptions)
    .then((response) => {
        if (response.status == 200) {
            window.location.href = "listar_resultado.html";
        } else {
            var alertaEliminacion = document.getElementById("alertaEliminacionResultado");
            alertaEliminacion.textContent = "El resultado que desea eliminar se encuentra en uso.";
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
    const p_id_resultado = parametros.get("id");
    // Asignamos la variable global al ID a eliminar.
    g_id_resultado = p_id_resultado;
    // Invocamos un método para obtener los datos del resultado a eliminar.
    obtenerDatosEliminacion(p_id_resultado);
}

function obtenerDatosEliminacion(id_resultado) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://144.126.136.43/api/resultado/"+id_resultado, requestOptions)
        .then((response) => response.json())
        .then((json) => json.forEach(completarEtiquetas))
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

function completarEtiquetas(element,index,arr) {
    //Completamos un etiqueta con la pregunta al usuario.
    var nombreEliminar = element.nombre_resultado
    document.getElementById("lbl_eliminar").innerHTML = "<b>" + nombreEliminar + "</b>";
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
