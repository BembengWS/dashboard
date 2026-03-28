const ctx = document.getElementById('overallChart');

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Order 2026', 'Carry Over'],
    datasets: [{
      data: [5309, 5210],
      backgroundColor: ['#999', '#d32f2f']
    }]
  }
});

document.getElementById("k1").textContent = "8428";
document.getElementById("k2").textContent = "4,112";
document.getElementById("k3").textContent = "4,316";
document.getElementById("k4").textContent = "1,256";
document.getElementById("k5").textContent = "30.5%";
