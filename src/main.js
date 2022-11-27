// tip: docs @ https://docs.urturn.app/docs/API/backend#functions

function onRoomStart(roomState) {
  const { logger } = roomState;
  logger.info('Start called')
  logger.warn('TODO: implement what the state of the room looks like initially')
  
  return { 
    state: {
      status: "preGame",
      secret: null,
      lettersGuessed: [],
      winner: null,
    },
   };
}

function onPlayerJoin(player, roomState) {
  const { logger, players, state } = roomState;
  logger.info('Join called with:', { player, roomState });
  logger.warn('TODO: implement how to change the roomState when a player joins');
  if (players.length === 2) {
    state.status = "inGame";
    return {
      state,
      joinable: false,
    }
  }
  return {};
}

function onPlayerQuit(player, roomState) {
  const { logger, state, players } = roomState;
  logger.info('Quit called with:', { player, roomState });
  logger.warn('TODO: implement how to change the roomState when a player quits the room');
  state.status = "endGame";
  if (players.length === 1) {
    const [winner] = players;
    state.winner = winner;
    return { state, finished: true };
  }
  return { state, finished: true };
}

function onPlayerMove(player, move, roomState) {
  const { logger, state } = roomState
  logger.info('Move called with:', { player, move, roomState })
  logger.warn('TODO: implement how to change the roomState when any player makes a move')
  const letters = /^[A-Z][A-Z\s]+[A-Z]$/;
  const secret = move.secret;
  const guess = move.guess

  if (secret != null && secret.match(letters)) {
    state.secret = secret
    return { state };
  }

  if (guess != null && guess.match(letters)) {
    state.lettersGuessed.push(guess)
    // do winner stuff 
    return { state };
  }

  throw new Error('this is not possible idiot');



}

// Export these functions so UrTurn runner can run these functions whenever the associated event
// is triggered. Follow an example flow of events: https://docs.urturn.app/docs/Introduction/Flow-Of-Simple-Game
export default {
  onRoomStart,
  onPlayerJoin,
  onPlayerQuit,
  onPlayerMove,
};
