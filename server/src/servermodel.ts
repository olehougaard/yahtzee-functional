import { YahtzeeSpecs } from "domain/src/model/yahtzee.game";
import * as Game from "domain/src/model/yahtzee.game";
import { SlotKey } from "domain/src/model/yahtzee.score";

export interface IndexedYahtzee extends Game.Yahtzee {
  readonly id: string
  readonly pending: false
}

export type PendingGame = Required<YahtzeeSpecs> & {
  readonly creator: string
  readonly id: string
  readonly pending: true
}

function startGameIfReady(pending_game: PendingGame): IndexedYahtzee | PendingGame {
  if (pending_game.players.length < pending_game.number_of_players)
    return pending_game
  const game = Game.new_yahtzee({players: pending_game.players})
  return {...game, id: pending_game.id, pending: false}
}

export function join(player: string, pending_game: PendingGame): PendingGame | IndexedYahtzee {
  const joined = {...pending_game, players: [...pending_game.players, player]}
  return startGameIfReady(joined)
}

export function create_pending(creator: string, number_of_players: number): Omit<PendingGame, 'id'> | Omit<IndexedYahtzee, 'id'>{
  if (number_of_players === 1) {
    const game = Game.new_yahtzee({players: [creator]})
    return { ...game, pending: false}
  }
  return { creator, number_of_players, players: [creator], pending: true }
}

export function reroll(held: number[], game: IndexedYahtzee): IndexedYahtzee {
  return {...game, ...Game.reroll(held, game)}
}

export function register(slot: SlotKey, game: IndexedYahtzee) {
  return {...game, ...Game.register(slot, game)}
}
