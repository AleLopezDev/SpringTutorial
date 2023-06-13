// Tiempo de espera antes de reintentar el minitest en milisegundos
let minitestTiempo = 300000; 

// Timer para el examen en segundos
let examenTiempo = 15; 

// Tiempo de espera antes de reintentar el examen en milisegundos
let tiempoEsperaExamen =15000;



// Getters y setters
export const getTiempoMinitest = () => minitestTiempo;

export const getTiempoExamen = () => examenTiempo;

export const getTiempoEsperaExamen = () => tiempoEsperaExamen;

