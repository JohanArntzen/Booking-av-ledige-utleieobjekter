let alleHytter = [];
let container, templateKort;
let aktivPeriode = null;

document.addEventListener('DOMContentLoaded', () => {
  container = document.getElementById('utleieobjekt');
  if (!container) return;

  templateKort = container.querySelector('.objekt-kort');
  if (!templateKort) return;

  const julBtn = document.querySelector('.Jul');
  const påskeBtn = document.querySelector('.Påske');
  const vinterBtn = document.querySelector('.Vinter');

  if (julBtn) julBtn.addEventListener('click', () => filtrerHytter('jul', julBtn));
  if (påskeBtn) påskeBtn.addEventListener('click', () => filtrerHytter('påske', påskeBtn));
  if (vinterBtn) vinterBtn.addEventListener('click', () => filtrerHytter('vinter', vinterBtn));

  fetch('hytter.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Klarte ikke å laste hytter.json');
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !Array.isArray(data.hytter)) return;
      alleHytter = data.hytter;
      renderHytter(alleHytter, container, templateKort);
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
    const bookBtn = card.querySelector('.objekt-book-btn');

    if (navn) navn.textContent = hytte.navn || '';
    if (standard) standard.textContent = `Standard: ${hytte.standard}`;
    if (senger) senger.textContent = `Sengeplasser: ${hytte.sengeplasser}`;
    if (badstue) badstue.textContent = `Badstue: ${hytte.badstue ? 'Ja' : 'Nei'}`;
    if (pris) pris.textContent = `${hytte.ukepris} kr / uke`;
    if (bilde) {
      if (Array.isArray(hytte.bilder) && hytte.bilder.length > 0) {
        const img = document.createElement('img');
        img.src = hytte.bilder[0];
        img.alt = hytte.navn || 'Hyttebilde';
        bilde.innerHTML = '';
        bilde.appendChild(img);
      } else {
        bilde.textContent = 'Bilde kommer';
      }
    }
    if (bookBtn) {
      if (!aktivPeriode) {
        bookBtn.disabled = true;
        bookBtn.textContent = 'Velg ferie først';
      } else {
        bookBtn.disabled = false;
        bookBtn.textContent = 'Book';
        bookBtn.addEventListener('click', () => bookHytte(hytte, card, bookBtn));
      }
    }
    container.appendChild(card);
  });
}

function filtrerHytter(periode, knapp) {
  document.querySelectorAll('.ferier button').forEach(btn => btn.classList.remove('aktiv'));

  if (aktivPeriode === periode) {
    aktivPeriode = null;
    renderHytter(alleHytter, container, templateKort);
  } else {
    aktivPeriode = periode;
    knapp.classList.add('aktiv');
    const filtrerte = alleHytter.filter((hytte) => {
      return hytte.utleie && hytte.utleie[periode] === false;
    });
    renderHytter(filtrerte, container, templateKort);
  }
}

function bookHytte(hytte, card, button) {
  const bekreftet = window.confirm(
    `Vil du booke ${hytte.navn} for ${hytte.ukepris} kr / uke?`
  );
  if (!bekreftet) return;

  button.disabled = true;
  button.textContent = 'Booket';
  card.classList.add('booket');

  alert(`Du har booket ${hytte.navn}!`);
}

