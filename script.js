const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfhO80zgPpOpWITxvgDjnL-vVdkfY6mJYC0ijFt_qJfkmGc1MjKOqKxQs8yLS4mp4x9ZLEDwgQRO1Z/pub?output=csv";

fetch(csvUrl)
  .then(response => response.text())
  .then(csv => {
    console.log("CSV loaded");

    const rows = csv.split("\n");
    console.log("Total rows:", rows.length);

    document.getElementById("status").innerText =
      "Data loaded. Total rows: " + rows.length;
  })
  .catch(error => {
    console.error("Error loading CSV:", error);
    document.getElementById("status").innerText =
      "Failed to load data";
  });
