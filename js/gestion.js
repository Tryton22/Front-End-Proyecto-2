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
    <a href='actualizar.html?id=${element.id_gestion}' class='btn btn-warning btn-sm'>Actualizar</a>
    <a href='eliminar.html?id=${element.id_gestion}' class='btn btn-danger btn-sm'>Eliminar</a>
    </td>
    </tr>`
}