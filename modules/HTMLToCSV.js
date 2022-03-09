export class HTMLToCSV {
  // escape quotes and commas in contents to be comma-separated
  static #wrapCsvContents = (content) => {
    if (typeof content === 'string') {
      if (content.replace(/ /g, '').match(/[\s,"]/)) {
        return `"${content.replace(/"/g, '""')}"`;
      }
    }
    return content;
  };

  static parser = (dom) => {
    // filter bookmarks
    const nodeList = dom.querySelectorAll('dt a, dt h3');
    const contents = Array.from(nodeList);

    // extract basic info from FF bookmarks - name, url, date added - and sort them by name ASC
    // category MUST be a let var for maintain the folder name in subelements
    let category = '';
    const output = contents
      .map((a) => {
        if (!a.getAttribute('href')) category = a.innerHTML;
        const date = new Date(parseInt(a.getAttribute('add_date')) * 1000);

        return {
          name: this.#wrapCsvContents(a.innerHTML),
          url: this.#wrapCsvContents(a.getAttribute('href')),
          category: this.#wrapCsvContents(category),
          tags: a.getAttribute('tags'),
          added: date.toISOString(),
        };
      })
      .filter((obj) => obj.url)
      .sort((a, b) => a.name.localeCompare(b.name));

    // pour the bookmark contents into CSV format with UTF8 BOM
    const getRow = (obj) =>
      `${obj.name},${obj.url},${obj.category},"${obj.tags ?? ''}",${
        obj.added
      }\r\n`;

    const headers = '\ufeffname,url,category,tags,date added\r\n';
    const csvContent = output.map((obj) => getRow(obj));
    csvContent.unshift(headers);

    // put CSV contents into a CSV file reusing the original HTML file's date
    return new Blob(csvContent, { type: 'text/csv;charset=utf-8;' });
  };
}
