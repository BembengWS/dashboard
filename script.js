const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfhO80zgPpOpWITxvgDjnL-vVdkfY6mJYC0ijFt_qJfkmGc1MjKOqKxQs8yLS4mp4x9ZLEDwgQRO1Z/pub?output=csv";

fetch(csvUrl)
  .then(response => response.text())
  .then(csv => {
    console.log("CSV loaded");

    // parser CSV yang lebih aman
    const rows = csv.trim().split("\n").map(row => {
      const result = [];
      let current = '';
      let insideQuotes = false;

      for (let char of row) {
        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current);
      return result;
    });

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

    // data rows (limit 50)
    rows.slice(1, 51).forEach(row => {
      const tr = document.createElement("tr");
      row.forEach(cell => {
        const td = document.createElement("td");
        td.innerText = cell;
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  })
  .catch(error => {
    console.error("Error:", error);
    document.getElementById("status").innerText =
      "Failed to render table";
  });
