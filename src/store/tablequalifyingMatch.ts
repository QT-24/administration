import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { TTablequalifyingMatch } from "../type/tablequalifyingMatch";

export type TablequalifyingMatchState = {
  counter: number;
  table_id?: string;
  tablequalifyingMatchs: TTablequalifyingMatch[];
  total?: number;
  loading?: boolean;
  addTablequalifyingMatchs: (data: TTablequalifyingMatch[]) => void;
  addTablequalifyingMatch: (data: TTablequalifyingMatch) => void;
  updateTablequalifyingMatch: (data: TTablequalifyingMatch) => void;
  deleteTablequalifyingMatch: (id: string) => void;
  updateTableId: (table_id: string) => void;
  updateTotal: (total: number) => void;
  updateLoading: (v: boolean) => void;
  increaseCounter: () => void;
};

export const useTablequalifyingMatchStore = create<TablequalifyingMatchState>()(
  immer((set) => ({
    counter: 0,
    tablequalifyingMatchs: [],
    addTablequalifyingMatchs: (data: TTablequalifyingMatch[]) =>
      set((state: TablequalifyingMatchState) => {
        state.tablequalifyingMatchs = data;
      }),
    addTablequalifyingMatch: (data: TTablequalifyingMatch) =>
      set((state: TablequalifyingMatchState) => {
        state.tablequalifyingMatchs.push(data);
      }),
    updateTablequalifyingMatch: (data: TTablequalifyingMatch) =>
      set((state: TablequalifyingMatchState) => {
        const idx = state.tablequalifyingMatchs.findIndex(
          ({ id: tablequalifyingMatchId }) => tablequalifyingMatchId === data.id
        );
        if (idx > -1) {
          state.tablequalifyingMatchs[idx] = {
            ...state.tablequalifyingMatchs[idx],
            ...data,
          };
        }
      }),
    deleteTablequalifyingMatch: (id: string) =>
      set((state: TablequalifyingMatchState) => {
        const idx = state.tablequalifyingMatchs.findIndex(
          ({ id: tablequalifyingMatchId }) => tablequalifyingMatchId === id
        );
        if (idx > -1) {
          state.tablequalifyingMatchs.splice(idx, 1);
        }
      }),
    updateTableId: (table_id: string) => {
      set((state: TablequalifyingMatchState) => {
        if (state.table_id !== table_id) {
          state.table_id = table_id;
        }
      });
    },
    updateTotal: (total: number) => {
      set((state: TablequalifyingMatchState) => {
        state.total = total;
      });
    },

    updateLoading(v: boolean) {
      set((state: TablequalifyingMatchState) => {
        state.loading = v;
      });
    },
    increaseCounter() {
      set((state: TablequalifyingMatchState) => {
        state.counter += 1;
      });
    },
  }))
);
