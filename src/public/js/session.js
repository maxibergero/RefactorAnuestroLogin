

loginForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Evita que el formulario se envíe automáticamente

  const email = document.getElementById("email").value; // Obtén el valor del campo de correo
  const password = document.getElementById("password").value; // Obtén el valor del campo de contraseña

  fetch('/api/sessions/login', 
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }), // Serializa los datos a JSON
  })
  .then((response) => {  
    
    if (response.status === 401) {
      // Manejar la respuesta 401 aquí
      
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Usuario o Contraseña inválido`,
        showConfirmButton: false,
        timer: 3000,
        backdrop: false,})
    }else if (response.status === 200){
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Login Validado`,
        showConfirmButton: false,
        timer: 3000, // Puedes configurar el temporizador si lo deseas
        backdrop: false, // Fondo no interactivo
      });

      setTimeout(() => {
        window.location.href = '/api/products'
      }, 1000);
    }
    return response.json(); // Analizar la respuesta como JSON para otros estados
  })
  .catch((error) => {
    // Manejar errores
    console.log(`Error: ${error}`)
  })
});





















