// import { TTeammember } from "./teammember";

export interface TTeam {
  id: string;
  team_sport_id: string;
  competition_id: string;
  org_id: string;
  has_militia?: boolean;
  has_army?: boolean;
  sport_id: string;
  sport_name?: string;
  org_name: string;
  list_member_id?: string[]; // PUT: list of teammembers' ids
  list_member_name?: string;

  // 1: LLTT, 2: DQTV
  for_type: number;

  // GET by team id
  competition_name: string;
  member_ids?: string[];
  member_names?: string[];

  list_team_member?: string[]; // POST: to create team with new members
}

export interface TGroup {
  id: string;
  content_id: string;
  team_id: string;
  org_id: string;
  content_name: string;
  org_name: string;
  lst_member?: string[]; // PUT: list of teammembers' ids
  list_member_name?: string;
  type: number;
  // GET by team id
  competition_name: string;
  member_ids?: string[];
  member_names?: string[];

  list_team_member?: string[]; // POST: to create team with new members
}
