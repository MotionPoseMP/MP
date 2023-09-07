$(document).ready(function(){
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

    $("#continuarBoton").on("click", function(){
        var formData = new FormData();
        formData.append("nombre", "Julio");
        formData.append("contrasena", "1234");
        $.ajax({
            url: '/login', // Reemplaza con la ruta correcta hacia tu función getUsuarios
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(formData),
            processData: false,
            contentType: false,
            success: function(data) {
                console.log("Hola");
                console.log(data);
                if(data.Exito){
                    console.log("Solicitud POST exitosa");
                }else{
                    console.error("Solicitud POST DENEGADA");
                }
                
            },
            error: function(error) {
                console.error(error);
            }
        });
    });
});
