# Telefunken Dashboard

A simple web dashboard for tracking and analyzing Telefunken game results.

## Features

* Overall game statistics
* Player leaderboard
* Win rates and average scores
* Best and worst scores
* Individual player breakdowns
* Average scores by round/category
* Live data loaded from Google Sheets

## Tech Stack

* HTML
* CSS
* JavaScript
* Google Sheets CSV data source

## Running Locally

Clone the repository:

```bash
git clone https://github.com/rchathoth/Telefunken-Dashboard.git
cd Telefunken-Dashboard
```

Then open `index.html` in your browser.

For best results, you can also serve the directory with a simple local web server.

## Project Structure

```text
Telefunken-Dashboard/
├── index.html
├── styles.css
└── app.js
```

`index.html` contains the dashboard layout, `styles.css` handles styling, and `app.js` loads the game data, calculates statistics, and renders the dashboard.

## Data

Game results are loaded from a published Google Sheets CSV and processed in the browser.

## License

This project is for personal use.
