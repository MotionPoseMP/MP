$(document).ready(function(){
    $(".comprar").on("click", function(){
        let datos = {membresia: 1}; // Cambiar por el tipo de compra dependiendo del usuario a lo que escoja

        $.ajax({
            url: '/tienda/comprar',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(datos),
            contentType: 'application/json',
            success: function(data) {
                if(data.Exito){
                    $(".modalTitulo").text("Muchas gracias");
                    $(".modalTexto").text(data.msg);
                    $(".modalIcono").html('<i class="fa-solid fa-heart" style="color: #16161a;"></i>');
                    console.log("exito");
                }else{
                    console.error("Solicitud POST DENEGADA");
                    $(".modalTitulo").text("Ha ocurrido un error :(");
                    $(".modalTexto").text(data.msg);
                    $(".modalIcono").html('<i class="fa-solid fa-heart-crack" style="color: #16161a;"></i>');
                }
                console.log(data);
            },
            error: function(error) {
                console.error(error);
            }
        });
    });
});