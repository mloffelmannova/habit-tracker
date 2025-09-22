const ctx = document.getElementById('taskChart').getContext('2d');
let taskChart;

function updateChart() {
    const today = new Date();
    const last30days = Array.from({length: 30}, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const completedCounts = last30days.map(day => tasks.filter(t => t.date === day && t.completed).length);

    if(taskChart) taskChart.destroy();

    taskChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last30days,
            datasets: [{
                label: 'Dokončené úkoly',
                data: completedCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}
