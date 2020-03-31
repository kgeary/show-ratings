import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: "1rem auto",
    width: "fit-content",
    '& table': {
      border: "1px solid black",
      borderCollapse: "collapse",
      margin: "1rem",
    },
    '& td': {
      padding: "0.25rem 1rem",
      borderBottom: "1px solid black"
    },
    '& tr:last-child td': {
      borderBottom: "none",
    },
    '& .th': {
      backgroundColor: "#EEE",
      color: "#333",
      fontWeight: "bold",
    },
    '& .average': {
      backgroundColor: "yellow",
      color: "black",
    },
    '& .highest': {
      backgroundColor: "green",
      color: "white",
    }, '& .lowest': {
      backgroundColor: "red",
      color: "white",
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

  if (!props.title) {
    return null
  }

  if (props.isSearching) {
    return <h3 className={classes.notFound}>Searching...</h3>;
  }

  if (ratings.length < 1) {
    return <h3 className={classes.notFound}>Not Found</h3>;
  }

  const getRow = (className, heading, data, episodes = undefined) => {
    return (
      <tr>
        <td className={`th ${className}`}>{heading}</td>
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
    <div className={classes.root}>
      {
        ratings
          ?
          <>
            <table>
              <tbody>
                {getRow("default-th", "Episodes", ratings.length || "-")}
                {getRow("default-th", "Seasons", getSeasons() || "-")}
              </tbody>
            </table>
            <table>
              <tbody>
                {getRow("average", "Average Rating", isNaN(average) ? "-" : average)}
                {getRow("highest", "Highest Rating", !isFinite(max) ? "-" : max, getEpisode(max))}
                {getRow("lowest", "Lowest Rating", !isFinite(min) ? "-" : min, getEpisode(min))}
              </tbody>
            </table>
          </>
          : <h1>Select a show</h1>
      }
    </div >
  )
}

Stats.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  episodes: PropTypes.arrayOf(PropTypes.object),
  focusBar: PropTypes.number,
  setFocusBar: PropTypes.func,
}