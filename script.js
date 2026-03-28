const dummy = [
  { Region: "JAKARTA", "Status Request": "ON AIR", "Proceeding Order": "ORDER 2026" },
  { Region: "JABAR", "Status Request": "NOT YET", "Proceeding Order": "CARRY OVER" },
  { Region: "JAKARTA", "Status Request": "ON AIR", "Proceeding Order": "ORDER 2026" }
];

buildKPI(dummy);
buildDonut(dummy);
buildRegionTable(dummy);

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
        data: [order2026, carryOver]
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
