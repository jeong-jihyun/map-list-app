import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import styles from "./styled/MainContainer.module.css";
import { MdPlaylistAdd } from "react-icons/md";

const App = () => {
  const [memoData, setMemoData] = React.useState(new Map());
  const [currentDate, setCurrentDate] = useState("");
  const inputRef = useRef(null);

  // 날짜를 추가
  const onAddDateHandler = () => {
    const tempCurrentDate = dayjs().format("YYYY.MM.DD HH:mm:ss");
    if (memoData.has(tempCurrentDate)) return;

    setCurrentDate(tempCurrentDate);
    setMemoData((prev) => new Map(prev).set(tempCurrentDate, []));
  };
  //
  const onDateClick = (e) => {
    const { id } = e.target.dataset;
    setCurrentDate(id);
  };
  //
  const onMsgClickHandler = (e) => {
    e.preventDefault();

    const newGoalList = memoData.get(currentDate);
    const inputMsg = inputRef.current.value;

    setMemoData((prev) =>
      new Map(prev).set(currentDate, [
        ...newGoalList,
        { msg: inputMsg, status: false },
      ])
    );

    inputRef.current.value = "";
  };
  //
  const onCheckChange = (e) => {
    const checked = e.target.checked;
    const msg = e.target.dataset.msg;
    const currentGoalList = memoData.get(currentDate);
    const newGoal = currentGoalList.map((v) => {
      let temp = { ...v };
      if (v.msg === msg) {
        temp = { msg: v.msg, status: checked };
      }
      return temp;
    });
    setMemoData((prev) => new Map(prev).set(currentDate, [...newGoal]));
  };
  //
  const Goal = ({ id, msg, status, onCheckChange }) => {
    return (
      <div className={styles.goalWrap}>
        <label
          className={status ? styles.textDisabled : styles.text}
          htmlFor={id}
        >
          {status && <div className={styles.clean} />}
          <input
            type="checkbox"
            id={id}
            name={id}
            data-msg={msg}
            onChange={onCheckChange}
            checked={status}
          />
          {msg}
        </label>
      </div>
    );
  };
  //
  return (
    <>
      <div className={styles.memoContainer}>
        <div className={styles.memoWrap}>
          <nav className={styles.sidebar}>
            <ul className={styles.dateList}>
              {Array.from(memoData.keys()).map((v) => (
                <li
                  key={v}
                  data-id={v}
                  onClick={onDateClick}
                  className={styles.li}
                >
                  {v}
                </li>
              ))}
            </ul>
            <div className={styles.addWrap}>
              <MdPlaylistAdd
                size={30}
                color="#edd200"
                style={{ cursor: "pointer" }}
                onClick={onAddDateHandler}
              />
            </div>
          </nav>
          <section className={styles.content}>
            {memoData.size > 0 && (
              <>
                <ul className={styles.goals}>
                  {memoData.get(currentDate).map((v, i) => (
                    <li key={`goal_${i}`}>
                      <Goal
                        id={`goal_${i}`}
                        msg={v.msg}
                        status={v.status}
                        onCheckChange={onCheckChange}
                      />
                    </li>
                  ))}
                </ul>

                <div className={styles.inputBox}>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="What is your goal"
                    ref={inputRef}
                  />
                  <button
                    type="button"
                    className={styles.button}
                    onClick={(e) => onMsgClickHandler(e)}
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default App;
