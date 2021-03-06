import React from "react";
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import CustomTooltip from "../CustomTooltip";
import { interpolateRgb } from "d3-interpolate";
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
  }
}));

export default function Chart(props) {
  const classes = useStyles();
  const episodes = props.episodes.map(episode => {
    return {
      rating: parseFloat(episode.rating),
      season: parseInt(episode.season),
      episode: parseInt(episode.episode),
      title: episode.title,
      url: episode.imdburl,
      id: `${parseInt(episode.season)}:${parseInt(episode.episode)}`
    }
  });

  const ratings = episodes.map(episode => episode.rating);
  const min = Math.min(...ratings);
  const max = Math.max(...ratings);
  const avg = parseFloat(ratings.reduce((a, b) => a + b, 0) / ratings.length);

  const interpolateColor = (value) => {
    const startColor = "red";
    const endColor = "green";
    const minValue = min < 6 ? min : 6; //min;
    const maxValue = max > 8 ? 10 : 8; // max;

    const percent = (value - minValue) / (maxValue - minValue)
    const iColor = interpolateRgb(startColor, endColor);
    return iColor(percent);
  }

  const getBarData = () => {
    return episodes.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={props.focusBar === index ? "url(#activeBar)" : interpolateColor(entry.rating)} onClick={() => window.open(entry.url)} />
    ));
  }

  const getRangeY = () => {
    const minVal = (min > 2) ? parseInt(min - 2) : 0;
    const maxVal = (max < 8) ? parseInt(max + 2) : 10;

    return [minVal, maxVal];
  }

  const getSeasonMarkers = () => {
    if (!props.showSeason) return null;

    const referenceLines = [];
    let season = undefined;
    episodes.forEach((entry) => {
      if (entry.season !== season) {
        season = entry.season;
        const refLine = <ReferenceLine
          key={entry.id}
          x={entry.id}
          label={{ value: `S${entry.season}`, position: "top", dy: -10 }}
          stroke="yellow"
          strokeDasharray="3 3"
          strokeWidth="2"
          isFront={true}
          position={"start"}
        />
        referenceLines.push(refLine);
      }
    });
    return referenceLines;
  }

  const getAverageMarker = () => {
    if (!props.showAvg) return null;
    return <ReferenceLine
      y={avg}
      label={{ value: "AVG", position: "right" }}
      strokeDasharray="3 3"
      stroke="cyan"
    />
  }

  if (episodes.length < 1 || props.isSearching) return null;

  return (
    <ResponsiveContainer width="95%" height={300} className={classes.root}>
      <BarChart
        data={episodes}
        barCategoryGap="0"
        margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
        onMouseMove={state => {
          props.setFocusBar(state.isTooltipActive
            ? state.activeTooltipIndex
            : null)
        }}
        onMouseLeave={() => props.setFocusBar(null)}
      >
        <XAxis
          dataKey="id"
          label={{
            value: "Season:Episode",
            dy: 20,
            style: { fontWeight: "bold" },
          }}
        />
        <YAxis
          type="number"
          allowDecimals={false}
          domain={[0, 10]}
          ticks={[2, 4, 6, 8, 10]}
          interval="preserveEnd"
          dx={-10}
          label={{
            value: "Rating",
            dx: -20,
            dy: -10,
            angle: 90,
            textAnchor: "end",
            style: { fontWeight: "bold" },
          }}
        />
        <Tooltip
          content={<CustomTooltip />}
          animationBegin={1000}
          animationEasing={'ease-in-out'}
        />
        <CartesianGrid stroke="#f5f5f5" />
        <defs>
          <linearGradient id="activeBar" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="silver" />
            <stop offset="50%" stopColor="blue" />
            <stop offset="100%" stopColor="navy" />
          </linearGradient>
        </defs>
        <Bar type="monotone" dataKey="rating" stroke="#000">
          {getBarData()}
        </Bar>
        {getSeasonMarkers()}
        {getAverageMarker()}
      </BarChart>
    </ResponsiveContainer>
  );
}

Chart.propTypes = {
  isSearching: PropTypes.bool.isRequired,
  episodes: PropTypes.arrayOf(PropTypes.object),
  focusBar: PropTypes.number,
  setFocusBar: PropTypes.func,
  showSeason: PropTypes.bool,
  showAverage: PropTypes.bool,
}