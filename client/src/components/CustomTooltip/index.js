import React from "react";


export default ({ payload, label, active }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "5px",
          padding: "0 0.5rem",
          minWidth: "200px",
        }}
      >
        <h4>{payload[0].payload.title}</h4>

        <p className="label">
          <span>{`Season: ${payload[0].payload.season}`}</span>
        </p>

        <p className="label">
          <span>{`Episode: ${payload[0].payload.episode}`}</span>
        </p>

        <p className="label">
          <span>{`Rating: ${payload[0].value}`}</span>
        </p>

      </div>
    );
  }
  return null;
}