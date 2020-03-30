import React from 'react';
import { TextField, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((props) => ({

  root:
    props => props.value
      ? {
        backgroundColor: "#CCC",
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
          '&.Mui-focused fieldset': {
            borderColor: 'red',
          },
        }
      }
      : {
        height: "100vh",
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
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        id="search"
        label="Search By Show"
        variant="outlined"
        onChange={props.onChange}
        value={props.value}
        className="TextField"
        inputProps={{ maxLength: 32 }}
        InputProps={{
          endAdornment: (
            <IconButton position="end" onClick={() => props.onChange({ target: { value: "" } })}>
              <ClearIcon />
            </IconButton>
          ),
        }}
      />
    </form>
  );

}
