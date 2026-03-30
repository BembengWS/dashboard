const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfhO80zgPpOpWITxvgDjnL-vVdkfY6mJYC0ijFt_qJfkmGc1MjKOqKxQs8yLS4mp4x9ZLEDwgQRO1Z/pub?output=csv";

fetch(csvUrl)
  .then(response => response.text())
  .then(csv => {
    const rows = csv.trim().split("\n").map(r => r.split(","));

    document.getElementById("status").innerText =
      "Data loaded. Total rows: " + rows.length;

    const tableHead = document.querySelector("#data-table thead");
    const tableBody = document.querySelector("#data-table tbody");

    // header
    const headerRow = document.createElement("tr");
    rows[0].forEach(col => {
      const th = document.createElement("th");
      th.innerText = col;
      headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // data rows (batasi 50 dulu biar ga berat)
    rows.slice(1, 51).forEach(row => {
      const tr = document.createElement("tr");
      row.forEach(cell => {
        const td = document.createElement("td");
        td.innerText = cell;
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  });
