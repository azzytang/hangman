import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Stack, Typography, Button, Paper,
} from '@mui/material';
import client from '@urturn/client';
import styles from './Hangman.module.css';

const ALPHA_KEYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function Hangman({ secret, lettersGuessed, guessing }) {
  const lettersCount = lettersGuessed.length + 1;
  const lettersGuessedSet = new Set(lettersGuessed);
  const secretLettersSet = new Set(secret.split(''));
  console.log(lettersGuessedSet);

  useEffect(() => {

  }, [guessing]);
  return (
    <Stack alignItems="center" spacing={2}>
      <img
        className={styles['hangman-img']}
        src={`/data/hang_${lettersCount}.png`}
        alt="hangman status"
      />
      <Paper sx={{ padding: 2 }}>
        <Stack
          direction="row"
          spacing={0}
          sx={{ flexWrap: 'wrap', gap: 3 }}
        >
          {secret.split(' ').map((word) => (
            <Stack direction="row" spacing={1}>
              {word.split('').map((char) => {
                if (lettersGuessedSet.has(char)) {
                  return (
                    <Typography color="text.primary" variant="h4" sx={{ fontWeight: 'bold' }}>
                      {char}
                    </Typography>
                  );
                }
                return (
                  <Typography color="text.primary" variant="h4" sx={{ fontWeight: 'bold' }}>
                    _
                  </Typography>
                );
              })}
            </Stack>
          ))}
        </Stack>
      </Paper>
      <Stack direction="row" spacing={1}>
        <Typography color="text.primary">{lettersGuessed.length === 0 ? 'No guesses yet...' : 'Guessed: '}</Typography>
        {lettersGuessed.map((alphaKey) => {
          const className = secretLettersSet.has(alphaKey) ? styles['keyboard-item-success'] : styles['keyboard-item-error'];
          return <kbd className={className} key={alphaKey}>{alphaKey}</kbd>;
        })}
      </Stack>
      <Stack
        direction="row"
        spacing={0}
        sx={{ flexWrap: 'wrap', gap: 1 }}
      >
        {ALPHA_KEYS.map((alphaKey) => (
          <Button
            sx={{
              padding: 1,
              minHeight: '35px',
              minWidth: '35px',
            }}
            disabled={lettersGuessedSet.has(alphaKey)}
            size="small"
            variant="contained"
            onClick={async () => {
              const move = { guess: alphaKey };
              await client.makeMove(move);
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {alphaKey}
            </Typography>
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}

Hangman.propTypes = {
  lettersGuessed: PropTypes.arrayOf(PropTypes.string),
  secret: PropTypes.string,
  guessing: PropTypes.bool.isRequired,
};

Hangman.defaultProps = {
  lettersGuessed: [],
  secret: '',
};

export default Hangman;
