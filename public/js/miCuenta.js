let correoInicial;
let contrasenaEditar = false;
$(document).ready(function(){

    $("#contrasena").attr("placeholder", "*******");

    // Editar campos
    $('#usuarioLapiz').on("click", function(){
        var miInput = $("#usuario");
        miInput.prop("readonly", function(i, readonly) {
        return !readonly;
        });
        if (miInput.prop("readonly")) {
            miInput.addClass("noEditable");
        } else {
            miInput.removeClass("noEditable");
        }
        $("#aceptarCambios").removeClass("remover");
    });

    $('#correoLapiz').on("click", function(){
        var miInput = $("#correo");
        miInput.prop("readonly", function(i, readonly) {
        return !readonly;
        });
        if (miInput.prop("readonly")) {
            miInput.addClass("noEditable");
        } else {
            miInput.removeClass("noEditable");
        }
        $("#aceptarCambios").removeClass("remover");
    });

    var miInput = $("#contrasena");
    
    $('#contrasenaLapiz').on("click", function() {
      toggleReadonlyAndClass(miInput);
      $("#aceptarCambios").removeClass("remover");
    });

    // Detectar presión de la tecla Enter en el campo de contraseña
    miInput.on("keydown", function(event) {
      if (event.which === 13) {
        toggleReadonlyAndClass(miInput);
      }
    });

    function toggleReadonlyAndClass(inputElement) {
        inputElement.prop("readonly", function(i, readonly) {
            return !readonly;
        });
        if (inputElement.prop("readonly")) {
            inputElement.addClass("noEditable");
            inputElement.attr("placeholder", "*******");
            contrasenaEditar = false;
        } else {
            inputElement.removeClass("noEditable");
            inputElement.attr("placeholder", "Nueva contraseña");
            contrasenaEditar = true;
        }
    }
    
    $.ajax({
        url: '/cuenta/datos', // Reemplaza con la ruta correcta hacia tu función getUsuarios
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            if (data.Exito) {
                console.log(data);
                desplegarDatos(data.datos);
                desplegarHistorialCompras(data.historial);
                correoInicial = data.datos.correo;
                $("#mensaje").text(data.msg);
            } else {
                $("#mensaje").text(data.msg);
            }
        },
        error: function(error) {
            console.error(error);
        }
    });

    // Aceptar cambios de los campos -2.1vh
    $('#aceptarCambios').on("click", function(){
        let invalido = "";
        let datos = {correoInicial: correoInicial};
        while (true) {
            
            if(contrasenaEditar == true){
                if ($("#contrasena").val() == ""){
                    invalido = "La contraseña no puede estár vacía.";
                    break;
                }
                if(validarContraseña($("#contrasena").val())) {
                    invalido = "La contraseña debe contener al menos 8 carácteres, el uso de mayúsculas y carácteres especiales.";
                    break;
                }else{
                    datos.contrasena = $("#contrasena").val();
                }
            }

            if($("#usuario").val() == ""){
                invalido = "El nombre de usuario no puede estár vacío.";
                break;
            }else{
                datos.nombre_usuario = $("#usuario").val();
            }
    
            if ($("#correo").val() == ""){
                invalido = "El correo no puede estár vacío.";
                break;
            }

            if (validarCorreo($("#correo").val()) == false) {
                console.log(validarCorreo($("#correo").val()));
                invalido = "El correo ingresado es inválido.";
                break;
            }else{
                datos.correo = $("#correo").val();
            }
            break;
        }
        console.log(datos);
        if(invalido == ""){
            console.log("EXITO cambiado");
            $.ajax({
                url: '/cuenta',
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify(datos),
                contentType: 'application/json',
                success: function(data) {
                    if(data.Exito){
                        console.log("exito");
                    }else{
                        console.error("Solicitud POST DENEGADA");
                    }
                    console.log(data);
                    $(".mensaje").removeClass("ocultar");
                    $(".mensaje").css("margin-top", "-2.1vh")
                    $(".mensaje").text(data.msg);
                },
                error: function(error) {
                    console.error(error);
                }
            });
        }else{
            $(".mensaje").removeClass("ocultar");
            $(".mensaje").css("margin-top", "-2.1vh")
            $(".mensaje").text(invalido);
        }
    });
});

function desplegarHistorialCompras(datos) {
    if (datos.length == 0) {
        $("#mensaje").text("Por el momento no tienes compras.");
    } else {
        $("#mensaje").remove();
        for (let i = 0; i < datos.length; i++) {
            let compras = '';
            compras += '<div class="compraElemento">';
            compras += '    <div class="casilla">';
            compras += '        <span class="spanTitulo">Producto</span>';
            compras += '        <span>' + datos[i].nombre_producto + '</span>';
            compras += '    </div>';
            compras += '    <div class="casilla">';
            compras += '        <span class="spanTitulo">Fecha de compra</span>';
            compras += '        <span>' + formatearFecha(datos[i].fecha_compra) + '</span>';
            compras += '    </div>';
            compras += '    <div class="casilla">';
            compras += '        <span class="spanTitulo">Valor sin IVA</span>';
            compras += '        <span>$ ' + agregarSeparadorMiles((datos[i].precio / (1 + 19/100)).toFixed(2).replace(/\./g, ',')) + '</span>';
            compras += '    </div>';
            compras += '    <div class="casilla">';
            compras += '        <span class="spanTitulo">IVA del producto</span>';
            compras += '        <span>19% IVA $ ' + agregarSeparadorMiles((datos[i].precio - (datos[i].precio / (1 + 19/100))).toFixed(2).replace(/\./g, ',')) + '</span>';
            compras += '    </div>';
            compras += '    <div class="casilla">';
            compras += '        <span class="spanTitulo">Total</span>';
            compras += '        <span>$ ' +  agregarSeparadorMiles(datos[i].precio) + '</span>';
            compras += '    </div>';
            compras += '</div>';
            $("#historialCompras").append(compras);
        }
    }

}
function formatearFecha(fecha) {
    const d = new Date(fecha);
    return `${(d.getDate() + '').padStart(2, '0')}/${(d.getMonth() + 1 + '').padStart(2, '0')}/${d.getFullYear()} ${(d.getHours() + '').padStart(2, '0')}:${(d.getMinutes() + '').padStart(2, '0')}`;
}

function agregarSeparadorMiles(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function desplegarDatos(datos){
    $('#usuario').val(datos.nombre_usuario);
    $('#correo').val(datos.correo);
    //if(datos.tipo_usuario ==)
    switch(datos.id_tipo){
        case 1:
            $('#membresia').val("Gratis");
            break;
        case 2:
            $('#membresia').val("VIP");
            break;
        case 3:
            $('#membresia').val("Super VIP");
            break;
        case 4:
            $('#membresia').val("Admin");
            break;
    }
}

function validarCorreo(email) {
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function validarContraseña(contrasena) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{8,}$/;
    return regex.test(contrasena);
}