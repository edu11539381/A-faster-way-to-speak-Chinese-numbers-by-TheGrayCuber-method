let currentData = [];
const FILES = {
    fast: 'data/口快數A_Normal-Day_Fast.csv',
    strict: 'data/口快數B_Strict-Way.csv'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMode('fast');
    
    // Attach event listeners
    document.getElementById('searchInput').addEventListener('input', renderTable);
    document.getElementById('mathOnly').addEventListener('change', renderTable);
});

function loadMode(mode) {
    // Update Buttons
    document.getElementById('btnFast').classList.toggle('active', mode === 'fast');
    document.getElementById('btnStrict').classList.toggle('active', mode === 'strict');
    
    document.getElementById('status').innerText = "Loading CSV data...";
    document.getElementById('resultsBody').innerHTML = "";

    // Parse CSV
    Papa.parse(FILES[mode], {
        download: true,
        header: true,
        dynamicTyping: true, // Converts "100" string to 100 number
        complete: function(results) {
            currentData = results.data;
            document.getElementById('status').innerText = `Loaded ${currentData.length} records.`;
            renderTable();
        },
        error: function(err) {
            document.getElementById('status').innerText = "Error loading CSV. Make sure files are in /data folder.";
            console.error(err);
        }
    });
}

function renderTable() {
    const tbody = document.getElementById('resultsBody');
    const searchVal = document.getElementById('searchInput').value;
    const showMathOnly = document.getElementById('mathOnly').checked;
    
    tbody.innerHTML = '';

    // Filter Logic
    let count = 0;
    const maxRows = 100; // Limit rendering for performance

    for (let row of currentData) {
        if (!row.Num && row.Num !== 0) continue; // Skip empty rows

        // Filter 1: Math Only
        if (showMathOnly && row.IsMath !== true && row.IsMath !== "TRUE") continue;

        // Filter 2: Search Input
        if (searchVal !== "") {
            // If searching, look for number match OR roughly close numbers
            const strNum = row.Num.toString();
            if (!strNum.startsWith(searchVal)) continue;
        }

        // Render Row
        const tr = document.createElement('tr');
        if (row.IsMath === true || row.IsMath === "TRUE") {
            tr.classList.add('is-math');
        }

        tr.innerHTML = `
            <td>${row.Num}</td>
            <td>${row.Cn || ''}</td>
            <td>${row.Syllables}</td>
            <td>${row.Equation}</td>
        `;
        tbody.appendChild(tr);

        count++;
        if (count >= maxRows) break; // Stop loop to prevent browser freeze
    }

    if (count === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">No results found</td></tr>';
    }
}