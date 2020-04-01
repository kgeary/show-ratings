import React from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "white",
    border: "1px solid black",
    borderRadius: "5px",
    padding: "0 0.5rem",
    minWidth: "200px",
    opacity: "0.9",
    "& p": {
      margin: "0.25rem",
    },
    "& .title": {
      fontWeight: "bold",
    },
  }
}));

export default ({ payload, label, active }) => {
  const classes = useStyles();

  if (active && payload && payload.length > 0) {
    return (
      <div className={classes.root}>
        <p className="title">{payload[0].payload.title}</p>

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