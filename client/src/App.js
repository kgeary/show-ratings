import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import Stats from './components/Stats';
import Chart from './components/Chart';
import TitleBar from './components/TitleBar';
import axios from 'axios';

const popularShows = ["Game of Thrones", "Seinfeld", "Friends", "The Office", "The Wire", "Big Bang Theory", "The Sopranos"];
const getRandomShow = () => {
  return popularShows[Math.floor(Math.random() * popularShows.length)];
}

function App() {
  const [title, setTitle] = useState(getRandomShow());
  const [episodes, setEpisodes] = useState([]);
  const [focusBar, setFocusBar] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(undefined);

  const updateShow = (e) => {
    setEpisodes([]);
    setTitle(e.target.value);
  }

  const getEpisodes = () => {
    axios.get(`/api/episodes/${title}`)
      .then(res => {
        const episodes = res.data;
        //console.log("NO RATING", episodes.filter(ep => isNaN(ep.rating)));
        //console.log("RATING", episodes.filter(ep => !isNaN(ep.rating)));
        setEpisodes(episodes.filter(episode => !isNaN(episode.rating)));
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        // Delay clearing the search in case the user is still typing
        setIsSearching(false);
      })
  }

  useEffect(() => {
    setIsSearching(true);
    clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => getEpisodes(), 700));
  }, [title]);

  return (
    <div className="App">

      <Search
        value={title}
        onChange={updateShow}
      />

      <TitleBar title={title} />

      <Chart
        isSearching={isSearching}
        episodes={episodes}
        showSeason={true}
        showAvg={false}
        focusBar={focusBar}
        setFocusBar={setFocusBar}
      />

      <Stats
        isSearching={isSearching}
        episodes={episodes}
        setFocusBar={setFocusBar}
      />

    </div>
  );
}

export default App;
