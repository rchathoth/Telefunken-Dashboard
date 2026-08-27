const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTM85KCSeO4fNnmQvVRlBjgl1aGACSw56kxMQyxAjm95YgUwC8wnEunSMndZZR8WWcMvYw_Yn2v_V-e/pub?output=csv";

let games = [];
const players = ["Annie", "Brayden", "Kyle", "Rohit"];
const categories = [
    "2/3",
    "1/4",
    "2/4",
    "1/5",
    "2/5",
    "1/6",
    "escalera"
];

function parseCSV(csvData) {
    const rows = csvData
        .trim()
        .split(/\r?\n/)
        .map(row => row.trim())
        .filter(row => row.length > 0);

    if (rows.length <= 1) return [];

    const data = rows.slice(1).map(row => {
        const values = row.split(",").map(v => v.trim());

        return {
            game: Number(values[0]) || 0,
            player: values[1] || "",
            "2/3": Number(values[2]) || 0,
            "1/4": Number(values[3]) || 0,
            "2/4": Number(values[4]) || 0,
            "1/5": Number(values[5]) || 0,
            "2/5": Number(values[6]) || 0,
            "1/6": Number(values[7]) || 0,
            escalera: Number(values[8]) || 0,
            total: Number(values[9]) || 0,
            perfectShuffles: Number(values[10]) || 0
        };
    }).filter(item => item.player.length > 0);

    return data;
}

async function getSpreadsheetData() {
    try {
        const response = await fetch(CSV_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const csvData = await response.text();
        return parseCSV(csvData);

    } catch (error) {
        console.error("Failed to fetch spreadsheet:", error);
        return [];
    }
}

// Stat analysis functions

function getGamesForPlayer(player) {
    return games.filter(game => game.player === player);
}

function getGame(gameNumber) {
    return games.filter(game => game.game === gameNumber);
}

function getGamesPlayed(player) {
    return getGamesForPlayer(player).length;
}

function getTotalScore(player) {
    const playerGames = getGamesForPlayer(player);

    return playerGames.reduce((sum, game) => {
        return sum + game.total;
    }, 0);
}

function getAverageScore(player) {
    const played = getGamesPlayed(player);
    return played === 0 ? 0 : getTotalScore(player) / played;
}

function getWinner(gameNumber) {
    const game = getGame(gameNumber);
    if (game.length === 0) return null;

    return game.reduce((winner, currentPlayer) => {
        return currentPlayer.total < winner.total
            ? currentPlayer
            : winner;
    });
}

function getWins(player) {
    const playerGames = getGamesForPlayer(player);
    let wins = 0;

    playerGames.forEach(game => {
        const winner = getWinner(game.game);
        if (winner && winner.player === player) {
            wins++;
        }
    });

    return wins;
}

function getCategoryAverage(player, category) {
    const playerGames = getGamesForPlayer(player);
    if (playerGames.length === 0) return 0;

    const total = playerGames.reduce((sum, game) => {
        return sum + (game[category] || 0);
    }, 0);

    return total / playerGames.length;
}

function getWinPercentage(player) {
    const played = getGamesPlayed(player);
    return played === 0 ? 0 : (getWins(player) / played) * 100;
}

function getLowestScore(player) {
    const playerGames = getGamesForPlayer(player);
    if (playerGames.length === 0) return 0;

    return Math.min(...playerGames.map(game => game.total));
}

function getHighestScore(player) {
    const playerGames = getGamesForPlayer(player);
    if (playerGames.length === 0) return 0;

    return Math.max(...playerGames.map(game => game.total));
}

function getPlayerSummary(player) {
    return {
        player: player,
        gamesPlayed: getGamesPlayed(player),
        wins: getWins(player),
        winPercentage: getWinPercentage(player),
        totalScore: getTotalScore(player),
        averageScore: getAverageScore(player),
        lowestScore: getLowestScore(player),
        highestScore: getHighestScore(player)
    };
}

function getAllPlayerSummaries() {
    return players.map(player => getPlayerSummary(player));
}

function getLeaderboard() {
    return getAllPlayerSummaries()
        .sort((a, b) => b.wins - a.wins);
}

function getAverageScoreLeaderboard() {
    return getAllPlayerSummaries()
        .sort((a, b) => a.averageScore - b.averageScore);
}

function getOverallBestScore() {
    if (games.length === 0) return { total: "-", player: "-", game: "-" };

    return games.reduce((best, game) => {
        return game.total < best.total
            ? game
            : best;
    });
}

function getOverallWorstScore() {
    if (games.length === 0) return { total: "-", player: "-", game: "-" };

    return games.reduce((worst, game) => {
        return game.total > worst.total
            ? game
            : worst;
    });
}

// Display functions

function displayOverallStats() {
    const numberOfGames = new Set(
        games.map(game => game.game)
    ).size;

    const best = getOverallBestScore();
    const worst = getOverallWorstScore();

    const totalGamesElem = document.getElementById("total-games");
    const bestScoreElem = document.getElementById("best-score");
    const bestScorePlayerElem = document.getElementById("best-score-player");
    const worstScoreElem = document.getElementById("worst-score");
    const worstScorePlayerElem = document.getElementById("worst-score-player");

    if (totalGamesElem) totalGamesElem.textContent = numberOfGames;
    if (bestScoreElem) bestScoreElem.textContent = best.total;
    if (bestScorePlayerElem) bestScorePlayerElem.textContent = `${best.player} — Game ${best.game}`;
    if (worstScoreElem) worstScoreElem.textContent = worst.total;
    if (worstScorePlayerElem) worstScorePlayerElem.textContent = `${worst.player} — Game ${worst.game}`;
}

function displayLeaderboard() {
    const leaderboard = getLeaderboard();
    const tableBody = document.getElementById("leaderboard-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    leaderboard.forEach((player, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${player.player}</strong></td>
            <td>${player.wins}</td>
            <td>${player.gamesPlayed}</td>
            <td>${player.winPercentage.toFixed(1)}%</td>
            <td>${player.averageScore.toFixed(1)}</td>
        `;

        tableBody.appendChild(row);
    });
}

function displayPlayerCards() {
    const container = document.getElementById("player-cards");
    if (!container) return;

    container.innerHTML = "";
    const summaries = getAllPlayerSummaries();

    summaries.forEach(player => {
        const card = document.createElement("div");
        card.classList.add("player-card");

        card.innerHTML = `
            <h3>${player.player}</h3>

            <div class="player-stats">
                <div class="player-stat">
                    <span class="label">Games Played</span>
                    <span class="value">${player.gamesPlayed}</span>
                </div>

                <div class="player-stat">
                    <span class="label">Wins</span>
                    <span class="value">${player.wins}</span>
                </div>

                <div class="player-stat">
                    <span class="label">Win Percentage</span>
                    <span class="value">${player.winPercentage.toFixed(1)}%</span>
                </div>

                <div class="player-stat">
                    <span class="label">Average Score</span>
                    <span class="value">${player.averageScore.toFixed(1)}</span>
                </div>

                <div class="player-stat">
                    <span class="label">Best Score</span>
                    <span class="value">${player.lowestScore}</span>
                </div>

                <div class="player-stat">
                    <span class="label">Worst Score</span>
                    <span class="value">${player.highestScore}</span>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

function displayCategoryAverages() {
    const head = document.getElementById("category-head");
    const body = document.getElementById("category-body");
    if (!head || !body) return;

    // Create header
    head.innerHTML = `
        <tr>
            <th>Player</th>
            ${categories.map(category => `<th>${category === "escalera" ? "Escalera" : category}</th>`).join("")}
        </tr>
    `;

    // Create one row for each player
    body.innerHTML = "";
    players.forEach(player => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><strong>${player}</strong></td>
            ${categories.map(category => {
            const average = getCategoryAverage(player, category);
            return `<td>${average.toFixed(1)}</td>`;
        }).join("")}
        `;

        body.appendChild(row);
    });
}

// Initialize and populate dashboard
async function init() {
    games = await getSpreadsheetData();
    console.log("Fetched games:", games);

    displayOverallStats();
    displayLeaderboard();
    displayPlayerCards();
    displayCategoryAverages();
}

init();