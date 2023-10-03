
const socket = io(); //lO PUEDO INSTANCIAR POR QUE PREVIAMENTE POR CDN LO ESTABLECÍ EN MAIN.HANDLEBARSA

//PAra poder establecer conexión el cliente primero debe enviar mensaje al servidor socket.io
//Se hace de la siguiente manera:


const btnAgregar = document.getElementById("btnAgregar")
const btnEliminar = document.getElementById("btnEliminar")

btnAgregar.addEventListener('click', () => {
   
    const prod = {title: title.value, description: description.value, code: code.value, price: price.value, stock: stock.value, category: category.value, thumbnail: thumbnail.value, status: true}

    socket.emit('agregarProducto', prod);


   
});

socket.on('mostrarProducto', (mensaje)=>{
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${mensaje}`,
            showConfirmButton: false,
            timer: 1500
          })

          console.log("Eliminado finalmente")
          
          //window.alert(`${mensaje}`);

    
})


btnEliminar.addEventListener('click', () => {
    
    const codeInput = document.getElementById('code').value

    //console.log(`Entra por acá en eliminar: ${codeInput}`)
    socket.emit('eliminarProducto', codeInput);
    
  


});

socket.on("mostrarEliminado", (mensaje)=>{
    
        setTimeout(()=>{
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `${mensaje}`,
                showConfirmButton: false,
                timer: 3000 // Aumentar a 3000 milisegundos (3 segundos) o más
            });
        }),
        1500

})


