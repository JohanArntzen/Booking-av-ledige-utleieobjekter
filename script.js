document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('utleieobjekt');
  if (!container) return;

  const templateKort = container.querySelector('.objekt-kort');
  if (!templateKort) return;

  fetch('hytter.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Klarte ikke å laste hytter.json');
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !Array.isArray(data.hytter)) return;
      renderHytter(data.hytter, container, templateKort);
    })
    .catch((error) => {
      console.error(error);
    });
});

function renderHytter(hytter, container, templateKort) {
  container.innerHTML = '';

  hytter.forEach((hytte) => {
    const card = templateKort.cloneNode(true);

    const navn = card.querySelector('.objekt-navn');
    const standard = card.querySelector('.objekt-standard');
    const senger = card.querySelector('.objekt-antall-senger');
    const badstue = card.querySelector('.objekt-badstue');
    const pris = card.querySelector('.objekt-pris');
    const bilde = card.querySelector('.objekt-bilde');

    if (navn) navn.textContent = hytte.navn || '';
    if (standard) standard.textContent = `Standard: ${hytte.standard}`;
    if (senger) senger.textContent = `Sengeplasser: ${hytte.sengeplasser}`;
    if (badstue) badstue.textContent = `Badstue: ${hytte.badstue ? 'Ja' : 'Nei'}`;
    if (pris) pris.textContent = `${hytte.ukepris} kr / uke`;
    if (bilde) {
      if (Array.isArray(hytte.bilder) && hytte.bilder.length > 0 && hytte.bilder[0] !== 'URL') {
        const img = document.createElement('img');
        img.src = hytte.bilder[0];
        img.alt = hytte.navn || 'Hyttebilde';
        bilde.innerHTML = '';
        bilde.appendChild(img);
      } else {
        bilde.textContent = 'Bilde kommer';
      }
    }

    container.appendChild(card);
  });
}

