import React, { useState, useRef, useEffect } from 'react';

const DAYS_OF_WEEK = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
};

const isSameDay = (d1, d2) => d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
const isBetween = (date, start, end) => {
  if (!start || !end || !date) return false;
  return date > start && date < end;
};
const isBeforeToday = (year, month, day) => {
  const today = new Date(); today.setHours(0,0,0,0);
  return new Date(year, month, day) < today;
};
const isDateBooked = (date, bookedDates) => {
  if (!bookedDates || !date || bookedDates.length === 0) return false;
  const d = new Date(date); d.setHours(0,0,0,0);
  return bookedDates.some(range => {
    const start = new Date(range.start); start.setHours(0,0,0,0);
    const end = new Date(range.end); end.setHours(0,0,0,0);
    return d >= start && d < end;
  });
};

const formatDateShort = (date) => {
  if (!date) return '';
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};
const formatDateDisplay = (date) => {
  if (!date) return '';
  return `${date.getDate()} thg ${date.getMonth() + 1} ${date.getFullYear()}`;
};
const formatSidebarDate = (date) => {
  if (!date) return '';
  const d = date.getDate().toString().padStart(2, '0');
  const m = 'Th' + (date.getMonth() + 1).toString().padStart(2, '0');
  return `${d} ${m}`;
};

const CalendarMonth = ({ year, month, checkIn, checkOut, onDateClick, bookedDates }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells = [];

  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-center font-semibold text-gray-900 mb-4 text-sm">
        {MONTH_NAMES[month]} năm {year}
      </h3>
      <div className="grid grid-cols-7 gap-0 mb-1">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="text-center text-xs text-gray-500 font-medium py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="h-10" />;
          
          const currentDate = new Date(year, month, day);
          const past = isBeforeToday(year, month, day);
          const isBooked = isDateBooked(currentDate, bookedDates);
          const isDisabled = past || isBooked;
          const isStart = isSameDay(currentDate, checkIn);
          const isEnd = isSameDay(currentDate, checkOut);
          const between = isBetween(currentDate, checkIn, checkOut);

          let cellBg = '';
          let textClass = isDisabled ? 'text-gray-300 line-through' : 'text-gray-800';
          let circle = '';

          if (isStart || isEnd) {
            circle = 'bg-gray-900 text-white rounded-full';
            textClass = 'text-white font-semibold';
          } else if (between) {
            cellBg = 'bg-gray-100';
            textClass = 'text-gray-800';
          }

          return (
            <div key={day} className={`h-10 flex items-center justify-center ${cellBg} ${isStart ? 'rounded-l-full' : ''} ${isEnd ? 'rounded-r-full' : ''} ${between ? '' : ''}`}>
              <button
                disabled={isDisabled}
                onClick={() => !isDisabled && onDateClick(currentDate)}
                className={`w-9 h-9 flex items-center justify-center text-sm transition-colors ${circle} ${textClass} ${!isDisabled && !isStart && !isEnd ? 'hover:bg-gray-200 rounded-full' : ''} disabled:cursor-default`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DateRangePicker = ({ checkIn, checkOut, onDatesChange, isOpen, onClose, onOpen, bookedDates }) => {
  const today = new Date();
  const [baseMonth, setBaseMonth] = useState(checkIn ? checkIn.getMonth() : today.getMonth());
  const [baseYear, setBaseYear] = useState(checkIn ? checkIn.getFullYear() : today.getFullYear());
  const [selecting, setSelecting] = useState(null); // 'checkIn' or 'checkOut'
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const nextMonth = baseMonth === 11 ? 0 : baseMonth + 1;
  const nextYear = baseMonth === 11 ? baseYear + 1 : baseYear;

  const goBack = () => {
    if (baseMonth === 0) { setBaseMonth(11); setBaseYear(baseYear - 1); }
    else setBaseMonth(baseMonth - 1);
  };
  const goForward = () => {
    if (baseMonth === 11) { setBaseMonth(0); setBaseYear(baseYear + 1); }
    else setBaseMonth(baseMonth + 1);
  };

  const nights = checkIn && checkOut ? Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)) : 0;

  const handleDateClick = (date) => {
    if (!checkIn || selecting === 'checkIn' || (checkIn && checkOut)) {
      onDatesChange(date, null);
      setSelecting('checkOut');
    } else {
      if (date <= checkIn) {
        onDatesChange(date, null);
        setSelecting('checkOut');
      } else {
        onDatesChange(checkIn, date);
        setSelecting(null);
      }
    }
  };

  const clearDates = () => { onDatesChange(null, null); setSelecting(null); };

  const displayText = checkIn && checkOut
    ? `${formatSidebarDate(checkIn)} - ${formatSidebarDate(checkOut)}`
    : checkIn
    ? `${formatSidebarDate(checkIn)} - Chọn ngày`
    : 'Chọn ngày';

  return (
    <>
      {/* Trigger */}
      <div onClick={onOpen} className="p-4 border-b border-gray-300 relative cursor-pointer hover:bg-gray-50/50 transition bg-white/50">
        <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Ngày nhận & trả phòng</label>
        <div className="text-sm font-medium text-gray-900">{displayText}</div>
        <svg className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          
          {/* Calendar Modal */}
          <div ref={ref} className="relative bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-gray-100 p-8 w-[720px] max-h-[90vh] overflow-y-auto">
          
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{nights > 0 ? `${nights} đêm` : 'Chọn ngày'}</h3>
                {checkIn && checkOut && (
                  <p className="text-sm text-gray-500 mt-1">{formatDateDisplay(checkIn)} - {formatDateDisplay(checkOut)}</p>
                )}
              </div>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <div className={`px-4 py-2.5 text-xs cursor-pointer transition ${selecting === 'checkIn' || (!checkIn && !selecting) ? 'border-2 border-gray-900 rounded-lg -m-[1px]' : ''}`}
                  onClick={() => setSelecting('checkIn')}>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Nhận phòng</div>
                  <div className="text-sm font-medium text-gray-900 mt-0.5 flex items-center">
                    {checkIn ? formatDateShort(checkIn) : 'Thêm ngày'}
                    {checkIn && <button onClick={(e) => { e.stopPropagation(); onDatesChange(null, null); setSelecting('checkIn'); }} className="ml-2 text-gray-400 hover:text-gray-700">✕</button>}
                  </div>
                </div>
                <div className="w-px bg-gray-300" />
                <div className={`px-4 py-2.5 text-xs cursor-pointer transition ${selecting === 'checkOut' ? 'border-2 border-gray-900 rounded-lg -m-[1px]' : ''}`}
                  onClick={() => checkIn && setSelecting('checkOut')}>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Trả phòng</div>
                  <div className="text-sm font-medium text-gray-900 mt-0.5 flex items-center">
                    {checkOut ? formatDateShort(checkOut) : 'Thêm ngày'}
                    {checkOut && <button onClick={(e) => { e.stopPropagation(); onDatesChange(checkIn, null); setSelecting('checkOut'); }} className="ml-2 text-gray-400 hover:text-gray-700">✕</button>}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mb-2">
              <button onClick={goBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div />
              <button onClick={goForward} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Calendars */}
            <div className="flex gap-10">
              <CalendarMonth year={baseYear} month={baseMonth} checkIn={checkIn} checkOut={checkOut} onDateClick={handleDateClick} bookedDates={bookedDates} />
              <CalendarMonth year={nextYear} month={nextMonth} checkIn={checkIn} checkOut={checkOut} onDateClick={handleDateClick} bookedDates={bookedDates} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={clearDates} className="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-gray-900 transition">Xóa ngày</button>
                <button onClick={onClose} className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition">Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateRangePicker;
