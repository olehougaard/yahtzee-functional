import * as api from '../model/api'
import { ongoing_games_slice } from '../slices/ongoing_games_slice'
import { pending_games_slice, game as pending_game } from '../slices/pending_games_slice'
import type { Dispatch, GetState } from '../stores/store'

export default async (dispatch: Dispatch, getState: GetState) => {
  api.onGame(game => {
    const state = getState()
    const obsolete_pending = pending_game(game.id, state.pending_games)
    if (obsolete_pending)
      dispatch(pending_games_slice.actions.delete(obsolete_pending))
    dispatch(ongoing_games_slice.actions.upsert(game))
  })
}
