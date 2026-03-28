const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfhO80zgPpOpWITxvgDjnL-vVdkfY6mJYC0ijFt_qJfkmGc1MjKOqKxQs8yLS4mp4x9ZLEDwgQRO1Z/pub?output=csv";

fetch(url)
  .then(res => res.text())
  .then(csv => {
    const data = parseCSV(csv);

    if (!data || data.length === 0) {
      document.getElementById("k1").textContent = "No Data";
      return;
    }

    buildKPI(data);
    buildDonut(data);
    buildRegionTable(data);
  });

function parseCSV(text){
  const rows = text.trim().split("\n");
  const headers = rows[0].split(",");

  return rows.slice(1).map(row => {
    const values = row.split(",");
    let obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i];
    });
    return obj;
  });
}

function buildKPI(data){
  const total = data.length;
  const onAir = data.filter(d => d["Status Request"] === "ON AIR").length;

  document.getElementById("k1").textContent = total;
  document.getElementById("k4").textContent = onAir;

  const ach = total ? ((onAir / total) * 100).toFixed(1) : 0;
  document.getElementById("k5").textContent = ach + "%";
}

function buildDonut(data){
  const order2026 = data.filter(d => d["Proceeding Order"] === "ORDER 2026").length;
  const carryOver = data.filter(d => d["Proceeding Order"] === "CARRY OVER").length;

  new Chart(document.getElementById("overallChart"), {
    type: 'doughnut',
    data: {
      labels: ['Order 2026', 'Carry Over'],
      datasets: [{
        data: [order2026, carryOver],
        backgroundColor: ['#9e9e9e', '#d32f2f']
      }]
    }
  });
}

function buildRegionTable(data){
  const regionMap = {};

  data.forEach(d => {
    const region = d["Region"] || "Unknown";

    if(!regionMap[region]){
      regionMap[region] = {order:0, onair:0};
    }

    regionMap[region].order++;

    if(d["Status Request"] === "ON AIR"){
      regionMap[region].onair++;
    }
  });

  const table = document.getElementById("regionTable");

  table.innerHTML = `
    <tr>
      <th>Region</th>
      <th>Order</th>
      <th>On Air</th>
      <th>Achievement</th>
    </tr>
  `;

  Object.entries(regionMap).forEach(([region, val]) => {
    const ach = val.order
      ? ((val.onair / val.order) * 100).toFixed(1)
      : 0;

    table.innerHTML += `
      <tr>
        <td>${region}</td>
        <td>${val.order}</td>
        <td>${val.onair}</td>
        <td>${ach}%</td>
      </tr>
    `;
  });
}
