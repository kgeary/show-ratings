import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import PropTypes from 'prop-types';

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
      fontWeight: "bold",
    },
    '& .episode-link': {
      paddingLeft: "1rem",
    },
    '& .episode-link:hover': {
      color: "blue",
      textDecoration: "none",
    },
  },
  notFound: {
    textAlign: "center",
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
        return <a
          className="episode-link"
          onMouseEnter={() => props.setFocusBar(getEpisodeIndex(episode))}
          onMouseLeave={() => props.setFocusBar(null)}
          href={episode.imdburl}
          key={episode.imdbid}
          target="_blank"
          rel="noopener noreferrer"
        >S{episode.season}:E{episode.episode} - {episode.title}</a>
      });
  }

  const getSeasons = () => {
    const array = props.episodes.map(episode => episode.season);
    const seasons = [...new Set(array)];
    return seasons.length;
  }

  if (props.isSearching) {
    return <h3 className={classes.notFound}>Searching...</h3>;
  }

  if (ratings.length < 1) {
    return <h3 className={classes.notFound}>Not Found</h3>;
  }

  const getRow = (heading, data, episodes = undefined) => {
    return (
      <tr>
        <td className="th">{heading}</td>
        <td>
          {data}
          {
            episodes
              ? episodes
              : null
          }
        </td>
      </tr>
    )
  }

  return (
    <Paper className={classes.root}>
      {
        ratings
          ?
          <table>
            <tbody>
              {getRow("Episodes", ratings.length || "-")}
              {getRow("Seasons", getSeasons() || "-")}
              {getRow("Average Rating", isNaN(average) ? "-" : average)}
              {getRow("Highest Rating", !isFinite(max) ? "-" : max, getEpisode(max))}
              {getRow("Lowest Rating", !isFinite(min) ? "-" : min, getEpisode(min))}
            </tbody>
          </table>
          : <h1>Select a show</h1>
      }
    </Paper >
  )
}

Stats.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  episodes: PropTypes.arrayOf(PropTypes.object),
  focusBar: PropTypes.number,
  setFocusBar: PropTypes.func,
}