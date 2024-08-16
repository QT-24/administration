import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { LI, UL } from "../../../AbstractElements";
import { getFilterByValue } from "../../../Service/_getParams";
import {
  qualifyingMatchTurnCreate,
  qualifyingMatchTurnDelete,
  qualifyingMatchTurnsGet,
  qualifyingMatchTurnUpdate,
} from "../../../Service/matchTurn";
import { tablequalifyingMatchReportUpdate } from "../../../Service/tablequalifyingMatch";
import { useTablequalifyingMatchStore } from "../../../store/tablequalifyingMatch";
import {
  TTablequalifyingMatch,
  TTablequalifyingMatchReport,
} from "../../../type/tablequalifyingMatch";
import { useTablequalifyingMatchReportModal } from "../TablequalifyingMatchReportForm";
import { MatchTurnWrapper } from "./MatchTurn";

type TTablequalifyingColumn = TTablequalifyingMatch;

const TablequalifyingTableAction = ({
  tablequalifyingMatch,
}: {
  tablequalifyingMatch: TTablequalifyingColumn;
}) => {
  const { updateTablequalifyingMatch, increaseCounter } =
    useTablequalifyingMatchStore();
  const { t } = useTranslation();

  const handleUpdateTablequalifyingMatchReport = (
    tablequalifyingMatch: TTablequalifyingMatchReport
  ) => {
    // console.log({ handleUpdateTablequalifyingMatch: tablequalifyingMatch });
    tablequalifyingMatchReportUpdate(tablequalifyingMatch)
      .then((res) => {
        const { status, data } = res;
        if (status === 200) {
          updateTablequalifyingMatch(data as TTablequalifyingMatch);
          increaseCounter();
          toast.success(t("success"));
          return;
        }

        return Promise.reject(status);
      })
      .catch((err) => {
        toast.error(t("error"));
        console.log({ err });
      });
  };

  const matchReport = {
    team1_name: tablequalifyingMatch.team1_name,
    team2_name: tablequalifyingMatch.team2_name,
    id: tablequalifyingMatch.id,
    team1_point: 0,
    team2_point: 0,
    sets: [],
  };

  const {
    handleToggle: handleToggleUpdateModal,
    TablequalifyingMatchReportModal: TablequalifyingUpdateModal,
  } = useTablequalifyingMatchReportModal({
    onSubmit: handleUpdateTablequalifyingMatchReport,
    matchReport,
  });

  const matchTurnsGet = useCallback(async () => {
    if (matchReport?.id) {
      // get all match turns belong to that match id
      const filter = getFilterByValue("match_id", "=", matchReport.id);
      return qualifyingMatchTurnsGet({ filter });
    }
    return Promise.reject("no match id");
  }, [matchReport?.id]);

  console.log({ TablequalifyingTableActionmatchReport: matchReport });
  return (
    <UL className="action simple-list flex-row" id={tablequalifyingMatch.id}>
      <LI className="edit btn" onClick={handleToggleUpdateModal}>
        <i className="icon-pencil-alt" />
        Cập nhật
        <MatchTurnWrapper
          matchId={matchReport.id}
          matchTurnsGet={matchTurnsGet}
          matchTurnUpdate={qualifyingMatchTurnUpdate}
          matchTurnDel={qualifyingMatchTurnDelete}
          matchTurnCreate={qualifyingMatchTurnCreate}
        >
          <TablequalifyingUpdateModal />
        </MatchTurnWrapper>
      </LI>
    </UL>
  );
};

export default TablequalifyingTableAction;
