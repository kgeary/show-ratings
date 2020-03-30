import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "1rem auto",
    border: "1px solid black",
    width: "fit-content",
    '& table': {
      borderCollapse: "collapse",
    },
    '& td': {
      padding: "0.25rem 1rem",
      borderBottom: "1px solid black"
    },
    '& tr:last-child td': {
      borderBottom: "none",
    },
    '& .th': {
      backgroundColor: "#CCC",
      color: "#333",
    },
    '& .episode-link': {
      paddingLeft: "1rem",
      textDecoration: "underline",
    },
    '& .episode-link:hover': {
      color: "blue",
    },
  },
}));

export default function Stats(props) {
  const classes = useStyles();
  const ratings = props.episodes.map(episode => parseFloat(episode.rating));
  const average = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  const min = ratings ? Math.min(...ratings) : 0;
  const max = ratings ? Math.max(...ratings) : 0;

  const getEpisodeIndex = (episode) => {
    return props.episodes.findIndex(i => i.imdbid === episode.imdbid)
  }

  const getEpisode = (score) => {
    if (!isFinite(score) || isNaN(score)) return "";

    return props.episodes
      .filter(episode => episode.rating === score)
      .map(episode => {
        return <span
          className="episode-link"
          onMouseEnter={() => props.setFocusBar(getEpisodeIndex(episode))}
          onMouseLeave={() => props.setFocusBar(null)}
        >S{episode.season}:E{episode.episode} - {episode.title}</span>
      });
  }

  const getSeasons = () => {
    const array = props.episodes.map(episode => episode.season);
    const seasons = [...new Set(array)];
    return seasons.length;
  }

  if (ratings.length < 1) return null;

  return (
    <Paper className={classes.root}>
      {
        ratings
          ?
          <table>
            <tr>
              <td className="th">Episodes</td>
              <td>{ratings.length || "-"}</td>
            </tr>
            <tr>
              <td className="th">Seasons</td>
              <td>{getSeasons() || "-"}</td>
            </tr>
            <tr>
              <td className="th">Average Rating</td>
              <td>{isNaN(average) ? "-" : average}</td>
            </tr>
            <tr>
              <td className="th">Highest Rating</td>
              <td>{!isFinite(max) ? "-" : max} {getEpisode(max)}</td>
            </tr>
            <tr>
              <td className="th">Lowest Rating</td>
              <td>{!isFinite(min) ? "-" : min} {getEpisode(min)}</td>
            </tr>
          </table>
          : <span>Select a show</span>
      }
    </Paper >
  )
}