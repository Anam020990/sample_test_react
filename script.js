// Utility to parse CSV/TSV string to array of objects
function parseCSV(str, delimiter = ',') {
  const lines = str.trim().split('\\n');
  const headers = lines[0].split(delimiter);
  return lines.slice(1).map(line => {
    const values = line.split(delimiter);
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i];
      return obj;
    }, {});
  });
}

// Load and render CSV/TSV Kanban data
fetch('./Final-Project-Backlog.csv')  // Change filename if needed
  .then(response => response.text())
  .then(text => {
    // Detect if tab-separated or comma-separated
    const delimiter = text.includes('\\t') ? '\\t' : ',';
    const data = parseCSV(text, delimiter);

    const board = document.getElementById('board');
    board.innerHTML = ''; // Clear previous content if any

    // Group cards by Status column to create Kanban columns
    const columns = {};
    data.forEach(item => {
      const status = item.Status || 'No Status';
      if (!columns[status]) columns[status] = [];
      columns[status].push(item);
    });

    // Create columns
    Object.keys(columns).forEach(status => {
      const colDiv = document.createElement('div');
      colDiv.style.margin = '10px';
      colDiv.style.border = '1px solid #ccc';
      colDiv.style.padding = '10px';
      colDiv.style.width = '250px';
      colDiv.style.display = 'inline-block';
      colDiv.style.verticalAlign = 'top';
      colDiv.innerHTML = `<h3>${status}</h3>`;

      // Add cards
      columns[status].forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.style.border = '1px solid #999';
        cardDiv.style.borderRadius = '4px';
        cardDiv.style.margin = '5px 0';
        cardDiv.style.padding = '6px';
        cardDiv.style.backgroundColor = '#f9f9f9';
        cardDiv.style.cursor = 'default';

        // Show Title and optionally URL if present
        let content = `<strong>${card.Title || 'No Title'}</strong>`;
        if (card.URL) {
          content += `<br/><a href="${card.URL}" target="_blank" rel="noopener noreferrer">${card.URL}</a>`;
        }
        cardDiv.innerHTML = content;

        colDiv.appendChild(cardDiv);
      });

      board.appendChild(colDiv);
    });
  })
  .catch(err => {
    console.error('Failed to load or parse data:', err);
    const board = document.getElementById('board');
    board.textContent = 'Error loading Kanban data.';
  });
