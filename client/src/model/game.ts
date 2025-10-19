import { isDieValue, type DieValue } from "domain/src/model/dice"
import { type PlayerScore, type Yahtzee, type YahtzeeSpecs } from "domain/src/model/yahtzee.game"
import { isLowerSection, type LowerSection, type SlotKey, type UpperSection } from "domain/src/model/yahtzee.score"

type Indexed<Y, pending extends boolean> = Readonly<Y & {id: string, pending: pending}>

export type IndexedYahtzee = Indexed<Omit<Yahtzee, 'roller'>, false>

export type IndexedYahtzeeSpecs = Indexed<YahtzeeSpecs, true>

export type GraphQlGame = { 
  id: string, 
  players: string[], 
  playerInTurn: number, 
  roll: DieValue[], 
  rolls_left: number, 
  scores: {slot: string, score: number | null}[][]
}

function from_graphql_player_scores(player_scores: { slot: string, score: number | null }[]): PlayerScore {
  const GraphQLbonus = player_scores.find(s => s.slot === 'bonus')?.score
  const bonus = GraphQLbonus === 50 ? 50: GraphQLbonus === 0? 0 : undefined
  const upper_section_scores = Object.fromEntries(player_scores.map(s => ({...s, slot: parseInt(s.slot)})).filter(s => isDieValue(s.slot) && typeof s.score === 'number').map(s => [s.slot, s.score]))
  const lower_section_scores = Object.fromEntries(player_scores.filter(s => isLowerSection(s.slot) && typeof s.score === 'number').map(s => [s.slot, s.score]))
  const upper_section: UpperSection = { scores: upper_section_scores as any, bonus}
  const lower_section: LowerSection = { scores: lower_section_scores }
  return {upper_section, lower_section}
}

export function from_graphql_game({ id, players, playerInTurn, roll, rolls_left, scores }: GraphQlGame): IndexedYahtzee {
  return {
    id, pending: false, players, playerInTurn, roll, rolls_left, scores: scores.map(from_graphql_player_scores)
  }
}
