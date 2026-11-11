(function(){
  const c = document.createElement('canvas');
  c.width = c.height = 180;
  const x = c.getContext('2d');
  x.fillStyle = '#0e7c86';
  x.fillRect(0, 0, 180, 180);
  x.fillStyle = '#e6f7f5';
  x.font = 'bold 130px Helvetica, Arial, sans-serif';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText('?', 90, 98);
  const l = document.createElement('link');
  l.rel = 'apple-touch-icon';
  l.href = c.toDataURL('image/png');
  document.head.appendChild(l);
})();
const $ = id => document.getElementById(id);
const mostrar = id => ['intro','registro','juego','fin'].forEach(s => $(s).hidden = s !== id);
const DURACION = 300000; // 5 minutos
let jugadores = [], turno = 0, secreto, intentos, reloj;

function nuevoCampo(){
  const i = document.createElement('input');
  i.placeholder = 'Nombre del jugador';
  i.maxLength = 20;
  $('lista').appendChild(i);
  $('agregar').hidden = $('lista').children.length >= 5;
}
function reiniciarRegistro(){
  $('lista').innerHTML = '';
  nuevoCampo(); nuevoCampo();
  $('error').textContent = '';
  mostrar('registro');
}
function ponerTurno(){ $('turno').textContent = 'Turno de ' + jugadores[turno]; }
function terminar(t, x){
  clearInterval(reloj);
  $('finTitulo').textContent = t;
  $('finTexto').textContent = x;
  mostrar('fin');
}
function iniciar(){
  secreto = Math.floor(Math.random()*100) + 1;
  intentos = 0; turno = 0;
  $('msg').textContent = 'Adiviné un número del 1 al 100';
  $('intentos').textContent = 'Intentos: 0';
  $('n').value = '';
  $('tiempo').textContent = '05:00';
  $('relleno').style.width = '100%';
  ponerTurno();
  mostrar('juego');
  const limite = Date.now() + DURACION;
  clearInterval(reloj);
  reloj = setInterval(() => {
    const resta = Math.max(0, limite - Date.now());
    const s = Math.ceil(resta/1000);
    $('tiempo').textContent = String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
    $('relleno').style.width = (resta/DURACION*100) + '%';
    if(resta === 0) terminar('¡Game Over!', 'Se acabó el tiempo. El número era ' + secreto + '.');
  }, 200);
}

$('agregar').onclick = nuevoCampo;
$('empezar').onclick = () => {
  jugadores = [...$('lista').children].map(i => i.value.trim()).filter(Boolean);
  if(jugadores.length < 2){ $('error').textContent = 'Registra mínimo 2 jugadores'; return; }
  iniciar();
};
$('probar').onclick = () => {
  const g = Number($('n').value);
  if(!g || g < 1 || g > 100){ $('msg').textContent = 'Escribe un número del 1 al 100'; return; }
  intentos++;
  $('intentos').textContent = 'Intentos: ' + intentos;
  if(g === secreto){
    terminar('¡Ganó ' + jugadores[turno] + '!', 'Adivinó el ' + secreto + ' en ' + intentos + ' intentos.');
    return;
  }
  $('msg').textContent = g > secreto ? '▼ Más bajo' : '▲ Más alto';
  turno = (turno + 1) % jugadores.length;
  ponerTurno();
  $('n').value = '';
};
$('again').onclick = reiniciarRegistro;

setTimeout(reiniciarRegistro, 3800); // después de la animación de entrada
