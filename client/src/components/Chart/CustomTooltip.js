import React from "react";


export default ({ payload, label, active }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div style={{ backgroundColor: "white", border: "1px solid black", padding: "0.5rem" }}>
        <p className="label">{`Season: ${payload[0].payload.season}`}</p>
        <p className="label">{`Episode: ${payload[0].payload.episode}`}</p>
        <p className="label">{`Title: ${payload[0].payload.title}`}</p>
        <p className="label">{`Rating: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
}