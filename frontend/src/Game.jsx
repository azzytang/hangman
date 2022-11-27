import React, { useState, useEffect } from 'react';
import {
  ThemeProvider, Typography, Stack, Snackbar, Alert,
} from '@mui/material';
import client from '@urturn/client';
import Hangman from './Hangman';
import SubmitWord from './SubmitWord';
import theme from './theme';

const getStatusMsg = ({
  players, status, winner, curPlr, guesser,
}) => {
  if (status === 'preGame') {
    if (players?.length === 2) {
      return `waiting for ${players[0].id === curPlr?.id ? players[0].username : 'you'} to input the secret phrase`;
    }
    return 'waiting on another player to join...';
  }
  if (status === 'inGame') {
    if (guesser.id === curPlr.id) {
      return 'Try not to die buddy... guess the word';
    }
    return '';
  }
  if (status === 'endGame') {
    if (curPlr.id === winner.id) {
      return 'You won!';
    }
    return 'You lost!';
  }
  return 'You should not see this. Contact developers.';
};

function Game() {
  const [recentErrorMsg, setRecentErrorMsg] = useState(null);
  const [roomState, setRoomState] = useState(client.getRoomState() || {});

  // setup event listener for updating roomState when client fires
  useEffect(() => {
    const onStateChanged = (newBoardGame) => {
      setRoomState(newBoardGame);
    };
    client.events.on('stateChanged', onStateChanged);
    return () => {
      client.events.off('stateChanged', onStateChanged);
    };
  }, []);

  const [curPlr, setCurPlr] = useState();

  // load current player, which is initially null
  useEffect(() => {
    const setupCurPlr = async () => {
      const newCurPlr = await client.getLocalPlayer();
      setCurPlr(newCurPlr);
    };
    setupCurPlr();
  }, []);

  const { players, state = {} } = roomState;
  const {
    winner, status, lettersGuessed, secret,
  } = state;
  const [hanger, guesser] = players ?? [];

  return (
    <ThemeProvider theme={theme}>
      <Stack alignItems="center" padding={3} spacing={2}>
        <Typography variant="h5" color="text.primary">
          Hangman
        </Typography>
        {curPlr != null && curPlr?.id === hanger?.id && secret == null && (
        <SubmitWord
          setRecentErrorMsg={setRecentErrorMsg}
          createMoveFn={((phrase) => ({ secret: phrase }))}
          submitText="Submit"
          textFieldDefault="Provide secret phrase for other player to guess"
        />
        )}
        <Hangman
          secret={secret || ''}
          lettersGuessed={lettersGuessed}
          guessing={guesser != null && guesser?.id === curPlr?.id}
        />
        <Typography color="text.primary">
          {getStatusMsg({
            players, status, curPlr, guesser, winner,
          })}
        </Typography>
      </Stack>
      <Snackbar
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={recentErrorMsg !== null}
        onClose={() => { setRecentErrorMsg(null); }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {recentErrorMsg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default Game;
