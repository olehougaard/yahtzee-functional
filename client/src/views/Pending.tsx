import { useNavigate, useParams } from "react-router"
import Page from "../components/Page"
import { useDispatch, useSelector } from "react-redux"
import type { IndexedYahtzeeSpecs } from "../model/game"
import type { PlayerState } from "../slices/player_slice"
import type { Dispatch, State } from "../stores/store"
import * as Pending from "../slices/pending_games_slice"
import * as _ from 'lodash/fp'
import type { OngoingGamesState } from "../slices/ongoing_games_slice"
import JoinThunk from "../thunks/JoinThunk"
import { useEffect } from "react"

export default () => {
  const params = useParams()
  const {player} = useSelector<State, PlayerState>(state => state.player)
  const ongoing_games = useSelector<State, OngoingGamesState>(state => state.ongoing_games)
  const id = params.id!
  const game = useSelector<State, IndexedYahtzeeSpecs | undefined>(state => Pending.game(id, state.pending_games))
  const navigate = useNavigate()
  
  useEffect(() => {
    if (player === undefined) {
      navigate(`/login?pending=${id}`)
    } else if (game === undefined) {
      if (ongoing_games.some(g => g.id === id))
        navigate(`/login?game=${id}`)
      else
        navigate('/')
    }
  }, [game, player])

  if (player === undefined || game === undefined)
    return <></>

  const dispatch: Dispatch = useDispatch()

  const canJoin = !game.players.some(_.equals(player))

  const join = () => {
    if (canJoin)
      dispatch(JoinThunk(game, player))
  }

return <Page>
    <h1>Game #{id}</h1>
    <div>Created by: {game?.creator}</div>
    <div>Players: {game?.players.join(', ')}</div>
    <div>Available Seats: { (game?.number_of_players??2) - (game?.players.length??0)}</div>
    {canJoin && <button onClick={join}>Join</button>}
  </Page>
}
