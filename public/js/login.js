$(document).ready(function(){
    $.ajax({
        url: '/api/obtenerUsuarios', // Reemplaza con la ruta correcta hacia tu función getUsuarios
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if(data.Exito){
                console.log(data.usuarios);
                $("#parrafoTest").html("<p>Hola " + JSON.stringify(data.usuarios) + "</p>");
            }else{
                console.error("No hubo exito en el if: " + data.Exito);
                $("#parrafoTest").html("<p>Hola " + JSON.stringify(data.usuarios) + "</p>");

            }
            
        },
        error: function(error) {
            console.error(error);
        }
    });
    //$("#parrafoTest").html("<p>Hola " + JSON.stringify(usuarios) + "</p>"); // Muestra los datos en el HTML
    
    // Estetica label login
    $("#correo").on("focus", function(){
        $("#correoLabel").css("bottom", "-8px");
        $("#correoLabel").css("background-color", "white");
    })
    $("#correo").on("blur", function(){
        if($("#correo").val() == ""){        
            $("#correoLabel").css("bottom", "-31px");
            $("#correoLabel").css("background-color", "transparent");
        }
    });

    $("#contrasena").on("focus", function(){
        $("#contrasenaLabel").css("bottom", "-8px");
        $("#contrasenaLabel").css("background-color", "white");
    })
    $("#contrasena").on("blur", function(){
        if($("#contrasena").val() == ""){        
            $("#contrasenaLabel").css("bottom", "-31px");
            $("#contrasenaLabel").css("background-color", "transparent");
        }
    });

    // Titulo y contenedor animación

    $(".contenedorTitulo").css({
        'opacity' : '1',
        'margin-left' : '100px'
    });

    $(".contenedorLogin").css({
        'width' : '28%',
        'height' : '60%'
    });
    $("#volver").css({
        'left': '0',
        'opacity': '1'
    });
    $("#noCuenta").on("click", function(){
        window.location.href = 'registro'; 
    });
});
