# MovieApp

A responsive web app that lets you explore movies using The Movie Database (TMDb) API.  
Features include dark/light mode, search, filtering by genre, sorting, pagination, and a floating details panel with trailer playback.

---

## Features

- **Dark and Light Mode:** Toggle between dark and light themes with persistent preference.
- **Search:** Filter movies by title or description.
- **Genre Filter:** Dynamic dropdown to filter movies by genre.
- **Sorting:** Sort movies by Popular, Top Rated, Newest, and Oldest.
- **Pagination:** Browse movies with page numbers, previous and next buttons.
- **Responsive Design:** Works well on mobile, tablet, and desktop.
- **Equal Grid Rows:** Movie grid layout always fills rows evenly with placeholders.
- **Movie Details Panel:** Click a movie to see a floating side panel with poster, description, release date, genre(s), and embedded YouTube trailer.
- **Splash Screen:** A splash screen shown on page load.

---

## Technologies Used

- **HTML**  
- **CSS**  
- **JavaScript**  
- **TMDb API**  

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)  
- Internet connection (to fetch data from TMDb API)  

### Setup

1. Clone or download this repository.
2. Replace the API key in `script.js` with your TMDb API key (get one at [TMDb API](https://www.themoviedb.org/documentation/api)).
   ```js
   const API_KEY = 'YOUR_API_KEY_HERE';
