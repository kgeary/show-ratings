import React from "react";

export default ({ title }) => {
  return (
    title
      ? <h1 style={{ textAlign: "center" }}>{`Ratings for "${title}"`}</h1>
      : null
  )
}
