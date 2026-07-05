const qrjs = require('./qrcode-lib/index');

export interface QRMatrix {
  size: number;
  data: boolean[][];
}

export function generateQR(text: string): QRMatrix {
  const qr = qrjs(text, { typeNumber: -1, errorCorrectLevel: qrjs.ErrorCorrectLevel.M });
  const size = qr.getModuleCount();
  const data: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      row.push(qr.isDark(r, c));
    }
    data.push(row);
  }
  return { size, data };
}
