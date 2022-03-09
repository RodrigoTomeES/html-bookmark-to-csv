import { HTMLToCSV } from './HTMLToCSV.js';

const download = (file, filename) => {
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(file);
  downloadLink.download = `${filename}.csv`;
  downloadLink.click();
};

export const readFile = (event) => {
  const html = event.target.result;
  const fileName = event.target.fileName;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const file = HTMLToCSV.parser(doc);

  download(file, fileName);
};

export const removeExtension = (x) => x.replace(/\.[^/.]+$/, '');
