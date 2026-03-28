const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfhO80zgPpOpWITxvgDjnL-vVdkfY6mJYC0ijFt_qJfkmGc1MjKOqKxQs8yLS4mp4x9ZLEDwgQRO1Z/pub?output=csv";

fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const data = csvToJson(text);

    if(!data.length){
      document.body.innerHTML = "<h2>No data loaded</h2>";
      return;
    }

    buildKPI(data);
    buildDonut(data);
    buildRegionTable(data);
  })
  .catch(err => {
    document.body.innerHTML = "<h2>Failed loading spreadsheet</h2>";
    console.error(err);
  });

function csvToJson(csv){
  const rows = csv.trim().split("\n");
  const headers = rows[0].split(",").map(h => h.trim());

  return rows.slice(1).map(row => {
    const cols = row.split(",");
    let obj = {};

    headers.forEach((h,i)=>{
      obj[h] = cols[i] ? cols[i].trim() : "";
    });

    return obj;
  });
}

function buildKPI(data){
  const total = data.length;
  const onAir = data.filter(d => 
    d["Status Request"]?.toUpperCase() === "ON AIR"
  ).length;

  document.getElementById("k1").textContent = total;
  document.getElementById("k2").textContent = onAir;

  const ach = total ? ((onAir/total)*100).toFixed(1) : 0;
  document.getElementById("k3").textContent = ach + "%";
}

function buildDonut(data){
  const order2026 = data.filter(d => 
    d["Proceeding Order"] === "ORDER 2026"
  ).length;

  const carryOver = data.filter(d => 
    d["Proceeding Order"] === "CARRY OVER"
  ).length;

  new Chart(document.getElementById("overallChart"), {
    type: 'doughnut',
    data: {
      labels: ["Order 2026", "Carry Over"],
      datasets: [{
        data: [order2026, carryOver],
        backgroundColor: ["#888", "#d32f2f"]
      }]
    }
  });
}

function buildRegionTable(data){
  const map = {};

  data.forEach(row=>{
    const region = row["Region"] || "UNKNOWN";

    if(!map[region]){
      map[region] = {order:0, onair:0};
    }

    map[region].order++;

    if(row["Status Request"] === "ON AIR"){
      map[region].onair++;
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

  Object.entries(map).forEach(([region,val])=>{
    const ach = val.order ? ((val.onair/val.order)*100).toFixed(1) : 0;

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
