const audioPlayer = document.getElementById('audio-player');
const playerTitle = document.getElementById('player-title');
const playerImage = document.getElementById('player-image');
const playPauseIcon = document.getElementById('play-pause-icon');
let isPlaying = false;
let currentUrl = ''; // Para almacenar la URL actual
let hlsInstance = null; // Para manejar instancias de HLS.js

// ✅ Reproducir la radio seleccionada
function playRadio(url, title, image) {
  resetPlayer(); // Reinicia el reproductor antes de cargar la nueva emisora

  if (Hls.isSupported() && url.endsWith('.m3u8')) {
    // Crear una nueva instancia de HLS.js para m3u8
    hlsInstance = new Hls();
    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(audioPlayer);
  } else {
    // Soporte nativo para otros formatos
    audioPlayer.src = url;
  }

  currentUrl = url; // Almacena la URL actual
  playerTitle.textContent = title;
  playerImage.src = image; // Actualiza la imagen del reproductor

  audioPlayer.play();
  isPlaying = true;
  updatePlayPauseIcon();
}

// ✅ Cambiar entre play y pause
function togglePlay() {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
  } else {
    if (!audioPlayer.src || currentUrl !== audioPlayer.src || hlsInstance) {
      // Reinicia el flujo completamente si no hay fuente activa o si se usa HLS.js
      playRadio(currentUrl, playerTitle.textContent, playerImage.src);
    } else {
      // Para flujos no-HLS, simplemente reproduce
      audioPlayer.src = currentUrl; // Forzar recarga para otros formatos
      audioPlayer.load(); // Recarga el flujo
      audioPlayer.play();
    }
    isPlaying = true;
  }
  updatePlayPauseIcon();
}

// ✅ Reinicia el reproductor
function resetPlayer() {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
  audioPlayer.src = ''; // Limpia la fuente actual
  audioPlayer.load(); // Reinicia el reproductor
}

// ✅ Actualiza el ícono de play/pause con imagen
function updatePlayPauseIcon() {
  console.log('Actualizando ícono, isPlaying:', isPlaying);
  if (isPlaying) {
    playPauseIcon.src = '/Imagenes/Pausa.png'; // Cambia a pausa cuando se está reproduciendo
  } else {
    playPauseIcon.src = '/Imagenes/Play.png'; // Cambia a play cuando está en pausa
  }
}

// ✅ Cuando finalice la reproducción, reinicia el estado
audioPlayer.addEventListener('ended', () => {
  isPlaying = false;
  updatePlayPauseIcon();
});

// ✅ Buscador Nuevo
function filterRadios() {
  const searchQuery = normalizeText(document.getElementById('search-bar').value.toLowerCase());
  const radios = document.querySelectorAll('.radio');

  radios.forEach(radio => {
    const radioName = normalizeText(radio.querySelector('p').textContent.toLowerCase());
    if (radioName.includes(searchQuery)) {
      radio.style.display = 'flex'; // Mostrar radio si coincide
    } else {
      radio.style.display = 'none'; // Ocultar radio si no coincide
    }
  });
}

// ✅ Función para normalizar texto (quitar acentos/tildes)
function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ⚠️ IMPORTANTE: Exponer las funciones globalmente para que funcionen con "onclick"
window.playRadio = playRadio;
window.togglePlay = togglePlay;
window.filterRadios = filterRadios;
