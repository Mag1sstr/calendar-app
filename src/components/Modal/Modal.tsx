import { useState } from "react";
import "./Modal.css";
import { IDaysArr } from "../interfaces/interfaces";
import { useAppDispatch } from "../../store/store";
import { setEvent } from "../../store/slices/calendarSlice";

interface IProps {
  style: string | null;
  setClickModal: (bool: boolean) => void;
  clickIndex: number;
  setArray: (obj: IDaysArr[]) => void;
  daysArr: IDaysArr[];
  currentYear: number;
  currentMonth: string;
}
export default function Modal({
  style,
  setClickModal,
  daysArr,
  clickIndex,
  setArray,
  currentMonth,
  currentYear,
}: IProps) {
  const [value, setValue] = useState("");
  const dispatch = useAppDispatch();

  return (
    <div onClick={() => setClickModal(false)} className={`modal ${style}`}>
      <div onClick={(e) => e.stopPropagation()} className="modal__inner">
        <h1 className="modal__title">
          Создать событие на {clickIndex + 1} число
        </h1>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const copy: IDaysArr[] = [...daysArr];
              copy[clickIndex] = {
                title: value,
                day: clickIndex + 1,
              };

              dispatch(
                setEvent({
                  year: currentYear,
                  month: currentMonth,
                  eventsArray: copy,
                })
              );

              setArray(copy);
              setClickModal(false);
              setValue("");
            }
          }}
          className="modal__input"
          type="text"
          placeholder="Название события"
        />
      </div>
    </div>
  );
}
