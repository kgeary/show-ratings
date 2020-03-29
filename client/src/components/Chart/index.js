import React from "react";
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import CustomTooltip from "./CustomTooltip";
import { interpolateRgb } from "d3-interpolate";

export default function Chart(props) {

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
      <Cell key={`cell-${index}`} fill={interpolateColor(entry.rating)} onClick={() => window.open(entry.url)} />
    ));
  }

  const getRangeY = () => {
    const minVal = (min > 2) ? parseInt(min - 2) : 0;
    const maxVal = (max < 8) ? parseInt(max + 2) : 10;
    console.log("GRY", minVal, maxVal);

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
          label={{ value: `S${entry.season}`, position: "top" }}
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

  if (data.length < 1) return null;

  return (
    <ResponsiveContainer width="90%" height={300}>
      <BarChart
        data={data}
        barCategoryGap="0"
        margin={{ top: 25, right: 20, left: 30, bottom: 25 }}
      >
        <XAxis dataKey="id" label={{ value: "Season:Episode", dy: 20 }} />
        <YAxis type="number" domain={getRangeY()} label={{ value: "Rating", dx: -30, dy: -10 }} />
        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid stroke="#f5f5f5" />
        <Bar type="monotone" dataKey="rating" stroke="#000">
          {getBarData()}
        </Bar>
        {getSeasonMarkers()}
        {getAverageMarker()}
      </BarChart>
    </ResponsiveContainer>
  );
}