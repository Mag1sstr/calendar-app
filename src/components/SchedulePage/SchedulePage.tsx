import { useEffect, useState } from "react";
import "./SchedulePage.css";
import Modal from "../Modal/Modal";
import { IDaysArr } from "../interfaces/interfaces";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setEvent } from "../../store/slices/calendarSlice";

export default function SchedulePage() {
  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];
  let curr = new Date();
  let [currentYear, setCurrentYear] = useState(curr.getFullYear());
  let [currentMonth, setCurrentMonth] = useState(Number(curr.getMonth()));
  const [clickModal, setClickModal] = useState(false);
  const [clickIndex, setClickIndex] = useState<number>(-1);
  let date = new Date(currentYear, currentMonth + 1, 0);

  const events = useAppSelector((state) => state.calendar.events);
  const dispatch = useAppDispatch();

  //  let getYear = curr.getFullYear()
  //  let getMonth = curr.getMonth()
  //  let startDate = new Date(getYear, getMonth, 1)

  // function getWeekDay(date: Date) {
  //   let days = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];

  //   return days[date.getDay()];
  // }

  let [array, setArray] = useState<IDaysArr[]>([]);
  useEffect(() => {
    let daysArr: IDaysArr[] | undefined = [];
    for (let i: number = 0; i < date.getDate(); i++) {
      daysArr.push({ day: i + 1, title: "" });
    }

    setArray(daysArr);
  }, [currentMonth]);

  //  console.log(getWeekDay(startDate))

  const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
  function getStartDayNum(date: Date) {
    let arr = [0, 1, 2, 3, 4, 5, 6];
    if (date.getDay() === 0) {
      return 6;
    }
    return arr[date.getDay() - 1];
  }

  const [currCard, setCurrCard] = useState<IDaysArr | null>(null);
  function dragStartHandler(item: IDaysArr) {
    setCurrCard(item);

    if (item.title) {
      const copy = [...array];
      copy[item.day - 1] = {
        title: "",
        day: item.day,
      };
      // setArray(copy);
      dispatch(
        setEvent({
          year: currentYear,
          month: monthNames[currentMonth],
          eventsArray: copy,
        })
      );
    }
    //  console.log("drag", item.title);
  }

  // interface IEvent {
  //   e: {
  //     target: {
  //       classList: DOMTokenList;
  //     };
  //   };
  // }
  function dragEndHandler(e: React.DragEvent) {
    if (!e.currentTarget.classList.contains("active")) {
      (e.target as HTMLElement).style.background = "white";
    }
  }
  function dragOverHandler(e: React.DragEvent, item: IDaysArr) {
    e.preventDefault();

    if (
      !e.currentTarget.classList.contains("active") &&
      curr.getTime() < new Date(currentYear, currentMonth, item.day).getTime()
    ) {
      (e.target as HTMLElement).style.background = "lightgray";
    }
  }
  function dropHandler(e: React.DragEvent, item: IDaysArr) {
    e.preventDefault();
    if (
      !e.currentTarget.classList.contains("active") &&
      curr.getTime() < new Date(currentYear, currentMonth, item.day).getTime()
    ) {
      let copy: any = array.map((c) => {
        if (c.day === item.day) {
          return { ...c, title: currCard?.title };
        }
        if (c.day === currCard?.day) {
          return { ...c, title: item.title };
        }
        return c;
      });
      setArray(copy);
      dispatch(
        setEvent({
          year: currentYear,
          month: monthNames[currentMonth],
          eventsArray: copy,
        })
      );
      (e.target as HTMLElement).style.background = "white";
    }

    console.log("drop", item);
  }

  useEffect(() => {
    events.forEach((item) => {
      if (
        item.year === currentYear &&
        item.month === monthNames[currentMonth]
      ) {
        setArray(item.eventsArray);
      }
    });
  }, [currentMonth]);

  let [timeId, setTimeId] = useState<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    setTimeId(null);
  }, [currentMonth]);
  function previosMonthDrag(e: React.DragEvent) {
    e.preventDefault();
    if (!timeId) {
      setTimeId(
        setTimeout(() => {
          if (currentMonth > 0) {
            setCurrentMonth(currentMonth - 1);
          }
          if (currentMonth == 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
          }
        }, 3000)
      );
    }
  }
  function nextMonthDrag(e: React.DragEvent) {
    e.preventDefault();
    if (!timeId) {
      setTimeId(
        setTimeout(() => {
          if (currentMonth > 10) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(0);
          } else {
            setCurrentMonth(currentMonth + 1);
          }
        }, 3000)
      );
    }
  }
  //  console.log(timeId)

  function clearTime() {
    clearTimeout(timeId!);
    setTimeId(null);
  }

  // console.log(events);

  return (
    <div className="schedule">
      <Modal
        setClickModal={setClickModal}
        style={clickModal ? "openModal" : null}
        daysArr={array}
        clickIndex={clickIndex}
        setArray={setArray}
        currentMonth={monthNames[currentMonth]}
        currentYear={currentYear}
      />
      <div className="schedule__inner">
        <div className="schedule__month">
          <div className="schedule__year">{currentYear}</div>
          <button
            onDragOver={(e) => previosMonthDrag(e)}
            onDragLeave={() => clearTime()}
            onDragEnd={() => clearTime()}
            onClick={() => {
              if (currentMonth > 0) {
                setCurrentMonth(currentMonth - 1);
              }
              if (currentMonth == 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              }
            }}
            className="schedule__month-arrow"
          >
            {"<"}
          </button>

          {monthNames[currentMonth]}
          <button
            onDragOver={(e) => nextMonthDrag(e)}
            onDragLeave={() => clearTime()}
            onDragEnd={() => clearTime()}
            onClick={() => {
              if (currentMonth > 10) {
                setCurrentYear(currentYear + 1);
                setCurrentMonth(0);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="schedule__month-arrow"
          >
            {">"}
          </button>
        </div>

        <div className="schedule__nums">
          {weekDays.map((item) => {
            return (
              <div key={item} className="schedule__nums-item">
                {item}
              </div>
            );
          })}

          {[
            ...Array(getStartDayNum(new Date(currentYear, currentMonth, 1))),
          ].map((_, i) => (
            <div key={i} className="schedule__nums-item"></div>
          ))}

          {array?.map((item, i) => {
            return (
              <div
                key={i}
                className={`schedule__nums-item ${
                  curr.getDate() === i + 1 &&
                  curr.getFullYear() === currentYear &&
                  curr.getMonth() === currentMonth
                    ? "active"
                    : null
                } ${item.title.length ? "clicked" : null}`}
                onClick={() => {
                  if (
                    !(
                      curr.getTime() >
                      new Date(currentYear, currentMonth, i + 1).getTime()
                    )
                  ) {
                    let copy = [...array];
                    setArray(copy);
                    setClickIndex(i);
                    setClickModal(true);
                  }
                }}
                onDragStart={() => dragStartHandler(item)}
                onDragLeave={(e) => dragEndHandler(e)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDragOver={(e) => dragOverHandler(e, item)}
                onDrop={(e) => dropHandler(e, item)}
                draggable={true}
              >
                {i + 1}
                <div>
                  {/* {getWeekDay(
                              new Date(currentYear, currentMonth, i + 1)
                           )} */}
                </div>
                {item.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
