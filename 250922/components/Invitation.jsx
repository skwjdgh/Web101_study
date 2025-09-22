import { useEffect, useMemo, useState } from "react";
import InviteCard from "./InviteCard";

const LS_COUNT  = "invite_count_v7";     // 총 인원
const LS_JOINED = "invite_joined_v7";    // 내 참여 상태(true/false)

function dday(ms) {
  if (ms <= 0) return { label: "진행 중", d: 0, h: 0, m: 0, s: 0 };
  const s = Math.floor(ms / 1000);
  return {
    label: `D-${Math.floor(s / 86400)}`,
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export default function Invitation({
  title = "전시회 초대장",
  periodStartISO = "2025-09-23T10:00:00+09:00",
  periodEndISO   = "2025-09-23T18:00:00+09:00",
  place = "서울 · 정수캠퍼스",
  info = "드레스코드: 캐주얼\n간단한 다과 제공",
}) {
  const startAt = useMemo(() => new Date(periodStartISO), [periodStartISO]);
  const endAt   = useMemo(() => new Date(periodEndISO),   [periodEndISO]);

  // 저장된 값 로드
  const [count, setCount] = useState(() => Number(localStorage.getItem(LS_COUNT) || "0"));
  const [joined, setJoined] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_JOINED) || "false"); }
    catch { return false; }
  });

  // 타이머
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const remain = dday(startAt.getTime() - now.getTime());

  // 동기화
  useEffect(() => localStorage.setItem(LS_COUNT, String(count)), [count]);
  useEffect(() => localStorage.setItem(LS_JOINED, JSON.stringify(joined)), [joined]);

  // 참여하기: 이미 참여했으면 무시
  const join = () => {
    if (joined) return;
    setCount((c) => c + 1);
    setJoined(true);
  };

  // 취소하기: 참여 중일 때만 가능
  const cancel = () => {
    if (!joined) return;
    setCount((c) => Math.max(0, c - 1));
    setJoined(false);
  };

  return (
    <div style={{ padding: 20, border: "1px solid #e5e7eb", borderRadius: 12, background: "#fafafa" }}>
      <InviteCard
        title={title}
        dateRange={`${startAt.toLocaleString()} ~ ${endAt.toLocaleString()}`}
        place={place}
        info={info}
      />

      <h3 style={{ marginTop: 16 }}>D-Day</h3>
      <p style={{ fontSize: 18 }}>
        {remain.label} {remain.d}일 {remain.h}시간 {remain.m}분 {remain.s}초
      </p>

      <h3>참여</h3>
      <p>현재 참여 인원: <b>{count}</b>명</p>
      <button onClick={join}   disabled={joined} style={{ padding: "6px 12px", marginRight: 8 }}>참여하기</button>
      <button onClick={cancel} disabled={!joined} style={{ padding: "6px 12px" }}>취소하기</button>
      <p style={{ marginTop: 8, color: joined ? "#0a7" : "#6b7280" }}>
        내 상태: {joined ? "참여 중" : "미참여"}
      </p>
    </div>
  );
}
