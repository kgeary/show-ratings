import React from "react";
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import CustomTooltip from "./CustomTooltip";
import { interpolateRgb } from "d3-interpolate";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
  }
}));

export default function Chart(props) {
  const classes = useStyles();
  const data = props.data.map(episode => {
    return {
      rating: parseFloat(episode.rating),
      season: parseInt(episode.season),
      episode: parseInt(episode.episode),
      title: episode.title,
      url: episode.imdburl,
      id: `${parseInt(episode.season)}:${parseInt(episode.episode)}`
    }
  });

  const ratings = data.map(episode => episode.rating);
  const min = Math.min(...ratings);
  const max = Math.max(...ratings);
  const avg = parseFloat(ratings.reduce((a, b) => a + b, 0) / ratings.length);

  const interpolateColor = (value) => {
    const startColor = "red";
    const endColor = "green";
    const minValue = min;
    const maxValue = max;

    const percent = (value - minValue) / (maxValue - minValue)
    const iColor = interpolateRgb(startColor, endColor);
    return iColor(percent);
  }

  const getBarData = () => {
    return data.map((entry, index) => (
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
    data.forEach((entry) => {
      if (entry.season !== season) {
        season = entry.season;
        const refLine = <ReferenceLine
          key={entry.id}
          x={entry.id}
          label={{ value: `S${entry.season}`, position: "top", dy: -10 }}
          stroke="blue"
          strokeDasharray="3 3"
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

  if (data.length < 1 || props.searching) return null;

  return (
    <ResponsiveContainer width="95%" height={300} className={classes.root}>
      <BarChart
        data={data}
        barCategoryGap="0"
        margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
        onMouseMove={state => {
          if (state.isTooltipActive) {
            props.setFocusBar(state.activeTooltipIndex);
          } else {
            props.setFocusBar(null);
          }
        }}
        onMouseLeave={() => {
          props.setFocusBar(null);
        }}
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
          domain={getRangeY()}
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