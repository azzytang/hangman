import React, { useState } from 'react';
import {
  Stack, Paper, TextField, Button, CircularProgress, InputAdornment,
} from '@mui/material';
import client from '@urturn/client';
import PropTypes from 'prop-types';

function SubmitWord({
  setRecentErrorMsg, createMoveFn, submitText, textFieldDefault, dense,
}) {
  const [word, setWord] = useState('');
  const cleanedWord = word.trim().toLocaleUpperCase();
  const [wordError, setWordError] = useState();
  const [loading, setLoading] = useState(false);

  const submitWord = async () => {
    try {
      setLoading(true);
      if (!/^[A-Z][A-Z\s]+[A-Z]$/.test(cleanedWord)) {
        setWordError('Word/Phrase must be made up of only letters and spaces between words');
        return;
      }

      const move = createMoveFn(cleanedWord);
      console.log('Called makeMove with move object:', move);
      const { error } = await client.makeMove(move);
      if (error) {
        setRecentErrorMsg(error.message);
      } else {
        setWord('');
        setWordError(undefined);
      }
    } catch (error) {
      setRecentErrorMsg('Unknown Error occured when submitting word. Contact Developers.');
      console.error('Unknown error from making move:', error);
    } finally {
      setLoading(false);
    }
  };

  const button = (
    <Button
      disabled={loading}
      variant="contained"
      onClick={() => submitWord()}
      size={dense ? 'small' : 'medium'}
    >
      {loading ? <CircularProgress size={24} /> : submitText}
    </Button>
  );

  return (
    <Paper>
      {/* space-between and min-height are configured so that the helperText for the TextField
          doesn't cause the submit button to bounce while typing. */}
      <Stack direction={dense ? 'row' : 'column'} justifyContent="space-between" padding={1} sx={{ minWidth: { sm: '300px', md: '400px' }, minHeight: dense ? '75px' : '130px' }}>
        <TextField
          inputRef={(input) => input && input.focus()}
          autoFocus
          fullWidth
          disabled={loading}
          error={word != null && wordError != null}
          helperText={word != null && wordError}
          label={textFieldDefault}
          variant="outlined"
          autoComplete="off"
          value={word}
          size={dense ? 'small' : 'medium'}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault();
              submitWord();
            }
          }}
          onChange={(ev) => { setWord(ev.target.value); }}
          InputProps={dense ? {
            endAdornment:
            <InputAdornment position="end">
              {button}
            </InputAdornment>,
            sx: {
              paddingRight: 1,
            },
          } : undefined}
        />
        {!dense && button}
      </Stack>
    </Paper>
  );
}

SubmitWord.propTypes = {
  setRecentErrorMsg: PropTypes.func.isRequired,
  createMoveFn: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
  textFieldDefault: PropTypes.string.isRequired,
  dense: PropTypes.bool,
};

SubmitWord.defaultProps = {
  dense: false,
};

export default SubmitWord;
