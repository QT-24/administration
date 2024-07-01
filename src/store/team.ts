import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { TTeam } from "../type/team";
import { baseGetParams, IGetFilters } from "../Service/_getParams";

export type TeamState = {
  filters?: Partial<IGetFilters>;
  teams: TTeam[];
  total?: number;
  loading?: boolean;
  addTeams: (data: TTeam[]) => void;
  addTeam: (data: TTeam) => void;
  updateTeam: (data: TTeam) => void;
  deleteTeam: (id: string) => void;
  updateGetFilter: (filter: Partial<IGetFilters>) => void;
  updateTotal: (total: number) => void;
  updateLoading: (v: boolean) => void;
};

export const useTeamStore = create<TeamState>()(
  immer((set) => ({
    filters: baseGetParams,
    teams: [],
    addTeams: (data: TTeam[]) =>
      set((state: TeamState) => {
        state.teams = data;
      }),
    addTeam: (data: TTeam) =>
      set((state: TeamState) => {
        state.teams.push(data);
      }),
    updateTeam: (data: TTeam) =>
      set((state: TeamState) => {
        const idx = state.teams.findIndex(({ id: teamId }) =>
          teamId === data.id
        );
        if (idx > -1) {
          state.teams[idx] = data;
        }
      }),
    deleteTeam: (id: string) =>
      set((state: TeamState) => {
        const idx = state.teams.findIndex(({ id: teamId }) => teamId === id);
        if (idx > -1) {
          state.teams.splice(idx, 1);
        }
      }),
    updateGetFilter: (filter: Partial<IGetFilters>) => {
      set((state: TeamState) => {
        state.filters = { ...state.filters, ...filter };
      });
    },
    updateTotal: (total: number) => {
      set((state: TeamState) => {
        state.total = total;
      });
    },

    updateLoading(v: boolean) {
      set((state: TeamState) => {
        state.loading = v;
      });
    },
  })),
);
