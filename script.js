let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'circle'; // Startspieler ist 'circle'
let gameOver = false; // Flag für Spielende

function init() {
    render();
}

function render() {
    let content = document.getElementById('content');
    content.innerHTML = '';

    let tableHTML = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            tableHTML += `<td id="cell-${index}" onclick="handleClick(${index})">`;
            
            // Wenn das Feld "circle" ist, zeige den SVG-Kreis
            if (fields[index] === 'circle') {
                tableHTML += generateCircleSVG(); // Hier wird die Funktion aufgerufen
            } 
            // Wenn das Feld "cross" ist, zeige das SVG-Kreuz
            else if (fields[index] === 'cross') {
                tableHTML += generateCrossSVG();
            }

            tableHTML += '</td>';
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    content.innerHTML = tableHTML;
}
function restartGame() {
    // Reset des Spielfelds
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];

    // Reset des Startspielers und der gameOver-Flag
    currentPlayer = 'circle';
    gameOver = false;

    // Inhalt neu rendern und die Klick-Handler neu setzen
    render();
}

function handleClick(index) {
    // Wenn das Spiel vorbei ist oder das Feld bereits belegt ist, nichts tun
    if (gameOver || fields[index]) return;

    // Den aktuellen Spieler in das Feld setzen
    fields[index] = currentPlayer;

    // Das angeklickte Feld mit der passenden SVG füllen
    let cell = document.getElementById(`cell-${index}`);
    if (currentPlayer === 'circle') {
        cell.innerHTML = generateCircleSVG();
    } else {
        cell.innerHTML = generateCrossSVG();
    }

    // Die onclick-Funktion für das Feld entfernen
    cell.onclick = null;

    // Prüfen, ob das Spiel gewonnen wurde
    if (checkWinner()) {
        gameOver = true;
        drawWinningLine(checkWinner());
        return;
    }

    // Den Spieler wechseln
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
}

// Funktion zur Überprüfung, ob jemand gewonnen hat
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], // obere Zeile
        [3, 4, 5], // mittlere Zeile
        [6, 7, 8], // untere Zeile
        [0, 3, 6], // linke Spalte
        [1, 4, 7], // mittlere Spalte
        [2, 5, 8], // rechte Spalte
        [0, 4, 8], // diagonale von links oben nach rechts unten
        [2, 4, 6], // diagonale von rechts oben nach links unten
    ];

    // Überprüfe alle Gewinnkombinationen
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return combination; // Rückgabe der Gewinnkombination
        }
    }
    return null;
}


function drawWinningLine(winningCombination) {
    const [a, b, c] = winningCombination;

    const cellA = document.getElementById(`cell-${a}`);
    const cellB = document.getElementById(`cell-${b}`);
    const cellC = document.getElementById(`cell-${c}`);

    const table = document.querySelector('table');

    const line = document.createElement('div');
    line.classList.add('winning-line');

    // Berechne die Positionen der Zellen innerhalb der Tabelle
    const rectA = cellA.getBoundingClientRect();
    const rectC = cellC.getBoundingClientRect();
    const tableRect = table.getBoundingClientRect();

    // Berechne die Start- und Endpunkte der Linie relativ zur Tabelle
    const startX = rectA.left - tableRect.left + rectA.width / 2;
    const startY = rectA.top - tableRect.top + rectA.height / 2;
    const endX = rectC.left - tableRect.left + rectC.width / 2;
    const endY = rectC.top - tableRect.top + rectC.height / 2;

    // Berechne die Breite und den Winkel der Linie
    const width = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

    // Setze die Breite, Position und Rotation der Linie
    line.style.width = `${width}px`;
    line.style.height = '5px';
    line.style.backgroundColor = 'white';
    line.style.position = 'absolute';
    line.style.top = `${startY}px`;
    line.style.left = `${startX}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 50%';  // Drehpunkt an der linken Seite

    // Füge die Linie zur Tabelle hinzu
    table.style.position = 'relative'; // Stelle sicher, dass die Tabelle positioniert ist
    table.appendChild(line);
}


function generateCircleSVG() {
    const svgHTML = `
      <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="#00B0EF" stroke-width="10" fill="none" stroke-dasharray="283" stroke-dashoffset="283">
          <animate attributeName="stroke-dashoffset" from="283" to="0" dur="0.25s" fill="freeze" />
        </circle>
      </svg>
    `;
    
    return svgHTML;
}

function generateCrossSVG() {
    const svgHTML = `
      <svg width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <line x1="15" y1="15" x2="85" y2="85" stroke="#FFC000" stroke-width="10" stroke-dasharray="100" stroke-dashoffset="100">
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.25s" fill="freeze" />
        </line>
        <line x1="85" y1="15" x2="15" y2="85" stroke="#FFC000" stroke-width="10" stroke-dasharray="100" stroke-dashoffset="100">
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.25s" fill="freeze" />
        </line>
      </svg>
    `;
    return svgHTML;
}
