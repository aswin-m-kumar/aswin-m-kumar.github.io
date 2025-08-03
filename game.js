// game.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const resetBtn = document.getElementById('resetBtn');
    const instructionsBtn = document.getElementById('instructionsBtn');
    const modal = document.getElementById('instructionsModal');
    const closeModalBtn = modal.querySelector('.close-button');

    const GRID_SIZE = 5;
    const TILE_SIZE = canvas.width / GRID_SIZE;

    // Component Types
    const EMPTY = 0;
    const POWER = 1;
    const BULB = 2;
    const WIRE_I = 3; // Straight wire
    const WIRE_L = 4; // Corner wire

    // Directions (bitmask)
    const UP = 1, DOWN = 2, LEFT = 4, RIGHT = 8;

    let level;
    let winState = false;

    // --- UPDATED: This level is now solvable ---
    const initialLevel = [
        // Each tile is an object: { type, initial rotation (0-3) }
        // The player must rotate some tiles to complete the circuit.
        [ { type: POWER, rotation: 3 }, { type: WIRE_I, rotation: 1 }, { type: WIRE_I, rotation: 1 }, { type: WIRE_L, rotation: 0 }, { type: EMPTY } ],
        [ { type: EMPTY }, { type: EMPTY }, { type: EMPTY }, { type: WIRE_I, rotation: 0 }, { type: EMPTY } ],
        [ { type: EMPTY }, { type: WIRE_L, rotation: 1 }, { type: WIRE_I, rotation: 0 }, { type: WIRE_I, rotation: 0 }, { type: EMPTY } ],
        [ { type: EMPTY }, { type: WIRE_L, rotation: 2 }, { type: WIRE_I, rotation: 1 }, { type: WIRE_L, rotation: 3 }, { type: EMPTY } ],
        [ { type: EMPTY }, { type: WIRE_L, rotation: 1 }, { type: WIRE_I, rotation: 0 }, { type: WIRE_I, rotation: 1 }, { type: BULB, rotation: 3 } ],
    ];


    function getConnections(tile) {
        switch (tile.type) {
            case POWER:
                return [UP, DOWN, LEFT, RIGHT][tile.rotation];
            case BULB:
                 return [UP, DOWN, LEFT, RIGHT][tile.rotation];
            case WIRE_I: // Straight
                return tile.rotation % 2 === 0 ? (UP | DOWN) : (LEFT | RIGHT);
            case WIRE_L: // Corner
                return [UP | RIGHT, RIGHT | DOWN, DOWN | LEFT, LEFT | UP][tile.rotation];
            default:
                return 0;
        }
    }

    function init() {
        winState = false;
        level = JSON.parse(JSON.stringify(initialLevel)); // Deep copy
        drawBoard();
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                drawTile(x, y, level[y][x]);
            }
        }
    }

    function drawTile(x, y, tile) {
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;
        const isPowered = tile.powered;

        // Draw base tile
        ctx.fillStyle = isPowered ? '#fde047' : '#334155'; // yellow if powered, dark grey otherwise
        ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        
        ctx.strokeStyle = isPowered ? '#f59e0b' : '#94a3b8'; // orange if powered, light grey otherwise
        ctx.lineWidth = 8;
        ctx.beginPath();

        const connections = getConnections(tile);
        const centerX = px + TILE_SIZE / 2;
        const centerY = py + TILE_SIZE / 2;

        if (connections & UP) { ctx.moveTo(centerX, centerY); ctx.lineTo(centerX, py); }
        if (connections & DOWN) { ctx.moveTo(centerX, centerY); ctx.lineTo(centerX, py + TILE_SIZE); }
        if (connections & LEFT) { ctx.moveTo(centerX, centerY); ctx.lineTo(px, centerY); }
        if (connections & RIGHT) { ctx.moveTo(centerX, centerY); ctx.lineTo(px + TILE_SIZE, centerY); }
        
        ctx.stroke();

        // Draw special components
        if (tile.type === POWER) {
            ctx.font = `${TILE_SIZE * 0.5}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.fillText('🔋', centerX, centerY);
        } else if (tile.type === BULB) {
            ctx.font = `${TILE_SIZE * 0.5}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';
            ctx.fillText(isPowered ? '💡' : '💡', centerX, centerY);
            if(isPowered) {
                 ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
                 ctx.beginPath();
                 ctx.arc(centerX, centerY, TILE_SIZE/2, 0, Math.PI * 2);
                 ctx.fill();
            }
        }
    }

    function checkWinCondition() {
        // Reset power state
        level.forEach(row => row.forEach(tile => tile.powered = false));

        const powerSource = {x: 0, y: 0};
        const q = [powerSource];
        level[powerSource.y][powerSource.x].powered = true;
        const visited = new Set([`${powerSource.x},${powerSource.y}`]);

        while (q.length > 0) {
            const curr = q.shift();
            const connections = getConnections(level[curr.y][curr.x]);

            // Check neighbors
            const neighbors = [
                { x: curr.x, y: curr.y - 1, from: DOWN, to: UP },
                { x: curr.x, y: curr.y + 1, from: UP, to: DOWN },
                { x: curr.x - 1, y: curr.y, from: RIGHT, to: LEFT },
                { x: curr.x + 1, y: curr.y, from: LEFT, to: RIGHT },
            ];

            for (const n of neighbors) {
                if (n.x >= 0 && n.x < GRID_SIZE && n.y >= 0 && n.y < GRID_SIZE && !visited.has(`${n.x},${n.y}`)) {
                    const neighborTile = level[n.y][n.x];
                    const neighborConnections = getConnections(neighborTile);
                    if ((connections & n.to) && (neighborConnections & n.from)) {
                        neighborTile.powered = true;
                        visited.add(`${n.x},${n.y}`);
                        q.push({x: n.x, y: n.y});
                    }
                }
            }
        }

        // Check if the bulb is powered
        const bulbTile = level[GRID_SIZE - 1][GRID_SIZE - 1]; // Bulb is at the end
        if (bulbTile.powered && !winState) {
            winState = true;
            setTimeout(() => alert('Congratulations! You completed the circuit!'), 100);
        }
        drawBoard();
    }


    canvas.addEventListener('click', (e) => {
        if (winState) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
        const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
            const tile = level[y][x];
            if (tile.type === WIRE_I || tile.type === WIRE_L) {
                tile.rotation = (tile.rotation + 1) % 4;
                checkWinCondition();
                drawBoard();
            }
        }
    });

    // Event Listeners
    resetBtn.addEventListener('click', init);
    instructionsBtn.addEventListener('click', () => modal.style.display = 'block');
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Initial setup
    init();
});
