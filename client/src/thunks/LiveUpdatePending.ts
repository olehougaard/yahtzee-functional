import * as api from '../model/api'
import { pending_games_slice } from '../slices/pending_games_slice'
import type { Dispatch } from '../stores/store'

export default async (dispatch: Dispatch) => {
  api.onPending(pending => dispatch(pending_games_slice.actions.upsert(pending)))
}
