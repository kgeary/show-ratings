import React, { useState, useEffect } from 'react';
import { Container } from '@material-ui/core'
import Search from './components/Search';
import Stats from './components/Stats';
import Chart from './components/Chart';
import axios from 'axios';


function App() {
  const [title, setTitle] = useState("Game of Thrones");
  const [episodes, setEpisodes] = useState([]);

  const updateShow = (e) => {
    setEpisodes([]);
    setTitle(e.target.value);
  }

  useEffect(() => {
    axios.get(`/api/episodes/${title}`)
      .then(res => {
        const episodes = res.data;
        console.log("NO RATING", episodes.filter(ep => isNaN(ep.rating)));
        console.log("RATING", episodes.filter(ep => !isNaN(ep.rating)));

        setEpisodes(episodes.filter(episode => !isNaN(episode.rating)));
      })
  }, [title]);

  return (
    <div className="App">
      <Search value={title} onChange={updateShow} />
      <Container>
        {title ? <h1 style={{ textAlign: "center" }}>{`Ratings for "${title}"`}</h1> : null}
        <Chart showSeason={true} showAvg={false} data={episodes} />
        <Stats episodes={episodes} />
      </Container>
    </div>
  );
}

export default App;
