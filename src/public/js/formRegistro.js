formRegistro.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente
    
    const email = document.getElementById("email").value; // Obtén el valor del campo de correo
    const password = document.getElementById("password").value; // Obtén el valor del campo de contraseña
    const nombre = document.getElementById("nombre").value; // Obtén el valor del campo de correo
    const apellido = document.getElementById("apellido").value; // Obtén el valor del campo de correo
    const edad = document.getElementById("edad").value; // Obtén el valor del campo de correo

    fetch('/api/sessions/register', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, nombre, apellido, edad }), // Serializa los datos a JSON
    })
    .then((response) => {  

      if(response.status === 200){
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Registro Ok`,
          showConfirmButton: false,
          timer: 3000, // Puedes configurar el temporizador si lo deseas
          backdrop: false, // Fondo no interactivo
        });

        setTimeout(() => {
          window.location.href = '/api/sessions'
        }, 1000);
      }else if(response.status === 401){
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Usuario ya existe`,
          showConfirmButton: false,
          timer: 3000, // Puedes configurar el temporizador si lo deseas
          backdrop: false, // Fondo no interactivo
        });
      }

      return response.json(); // Analizar la respuesta como JSON
    })
    .catch((error) => {
      // Manejar errores
      console.error(`Error: ${error}`);
    })
  });