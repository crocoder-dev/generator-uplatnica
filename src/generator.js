const { createCanvas } = require('canvas');
const PDF417 = require("pdf417-generator")

function normalize(text) {
  if (typeof text === 'string') return text.trim().toUpperCase();
  return '';
}

function normalizeAmount(amount) {
  amount = normalize(amount).replace(',', '');
  return `${'000000000000000'.slice(0, 15 - amount.length)}${amount}`;
}

module.exports = function (query = {}) {

  const iznos = normalizeAmount(query.iznos);
  const platitelj = normalize(query.platitelj);
  const adresaPlatitelja = normalize(query.adresaplatitelja);
  const sjedistePlatitelja = normalize(query.sjedisteplatitelja);
  const primatelj = normalize(query.primatelj);
  const adresaPrimatelja = normalize(query.adresaprimatelja);
  const sjedistePrimatelja = normalize(query.sjedisteprimatelja);
  const iban = normalize(query.iban);
  const modelPlacanja = normalize(query.modelplacanja);
  const pozivNaBroj = normalize(query.pozivnabroj);
  const sifraNamjene = normalize(query.sifranamjene);
  const opisPlacanja = normalize(query.opisplacanja);

  /**
   * iznos (use comma - 10,50)
   * naziv platitelja
   * adresa platitelja
   * gradi platitelja
   * naziv primatelja
   * adresa primatelja
   * grad primatelja
   * iban 
   * model plaćanja
   * poziv na broj primatelja
   * šifra namjene
   * opis plaćanja
   */

  const code =
  `HRVHUB30
  HRK
  ${iznos}
  ${platitelj}
  ${adresaPlatitelja}
  ${sjedistePlatitelja}
  ${primatelj}
  ${adresaPrimatelja}
  ${sjedistePrimatelja}
  ${iban}
  ${modelPlacanja}
  ${pozivNaBroj}
  ${sifraNamjene}
  ${opisPlacanja}`
  
  const canvas = createCanvas();
  PDF417.draw(code, canvas);

  // Convert transparent pixels to white pixels
  const context = canvas.getContext('2d');
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;

  for(let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha === 0) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas.toDataURL('image/jpeg').replace(/^data:image\/\w+;base64,/, "");
}