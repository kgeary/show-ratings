import React from 'react';
import { Button, TextField, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((props) => ({
  root: {
    height: props => props.title ? "auto" : "100vh",
    flexDirection: props => props.title ? "row" : "column",
    justifyContent: props => props.title ? "space-between" : "center",
    display: "flex",
    alignItems: "center",
    "& .MuiButton-root": {
      marginRight: "1rem"
    },
    "& h1": {
      display: props => props.title ? "none" : "block",
    }
  },

  form:
    props => props.title
      ? {
        padding: "1rem 1rem",
        marginBottom: "1rem",
        "& .TextField": {
          width: "100%",
          maxWidth: "600px",
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'black',
          },
          '&:hover fieldset': {
            borderColor: 'blue',
          },

        }
      }
      : {
        marginBottom: "1rem",
        backgroundColor: "#FFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& .TextField": {
          width: "100%",
          maxWidth: "600px",
        },
      }
}));

export default function Search(props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <h1>Show Ratings By Episode</h1>
      <form
        className={classes.form}
        noValidate
        autoComplete="off"
        onSubmit={() => { }}
      >
        <TextField
          autoFocus
          id="search"
          label="Search By Show"
          variant="outlined"
          onChange={props.onChange}
          value={props.title}
          className="TextField"
          inputProps={{ maxLength: 32 }}
          onKeyPress={(e) => { if (e.which === 13) { e.preventDefault(); } }}
          InputProps={{
            endAdornment: (
              <IconButton position="end" onClick={() => props.onChange({ target: { value: "" } })}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
      </form>
      <Button
        onClick={props.setRandom}
        variant={props.title ? "outlined" : "contained"}
        color="primary">
        Random Show
      </Button>
    </div>
  );
}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
