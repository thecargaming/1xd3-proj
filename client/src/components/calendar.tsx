import styles from './calendar.module.scss';

type CalendarColumnDisplayProps = {
    events: CalendarEvent[]
    date: Date,
    weekOnly: boolean,
}

type CalendarColumnProps = {
    index: number,
    beginDate: Date,
    events: CalendarEvent[]
    weekOnly: boolean,
};

function sameDay(a: Date, b: Date): boolean {
    return (a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate());
}

function Bar({height}: {height: number}) {
    return <div className={styles.bar} style={{top: `${100*height}%`}} />
}

function CalendarEvent({event, date, weekOnly}: {event: CalendarEvent, date: Date, weekOnly: boolean}) {
    let eventType = {
        "available": styles.eventAvailable,
        "client": styles.eventClient,
        "representative": styles.eventRepresentative,
    }[event.type];
    let begin = event.begin.getHours()*60*60 + event.begin.getMinutes()*60 + event.begin.getSeconds();
    let end = event.end.getHours()*60*60 + event.end.getMinutes()*60 + event.end.getSeconds();
    let max = 24*60*60;
    if (weekOnly) {
        if (event.begin.getDay() !== date.getDay()) begin=0
        if (event.end.getDay()!==date.getDay()) end=max;
    } else {
        if (!sameDay(event.begin, date)) begin=0;
        if (!sameDay(event.end, date)) end=max;
    }
    let showName = weekOnly ? event.begin.getDay()===date.getDay() : sameDay(event.begin, date);

    return (
        <div style={{
            top: `${100*begin/max}%`,
            height: `${100*(end-begin)/max}%`,
        }} className={`${styles.event} ${eventType}`}
        title={`${event.begin.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}\n${event.description || ""}`}
        >
        {showName && event.name ? <p>{event.name}</p> : <></>}
        </div>
    )
}

function CalendarColumnDisplay(props: CalendarColumnDisplayProps) {
    return (
        <div className={styles.calendarColumnDisplay}>
            {[...Array(23).keys()].map((i) => <Bar height={(i+1)/24} />)}
            {props.events.map((e) => (
                <CalendarEvent event={e} date={props.date} weekOnly={props.weekOnly} />
            ))}
        </div>
    )
}

function CalendarColumn(props: CalendarColumnProps) {
    let day = new Date(props.beginDate.getTime());
    day.setDate(day.getDate() + props.index);
    day.setHours(0);
    day.setMinutes(0);
    day.setSeconds(0);
    day.setMilliseconds(0);
    const weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if (props.weekOnly) return (
        <div className={styles.calendarColumn}>
        <p>{weeks[day.getDay()]}</p>
        <CalendarColumnDisplay
            date={day}
            events={props.events.filter((e) => e.begin.getDay()===day.getDay() || e.end.getDay()===day.getDay())}
            weekOnly={props.weekOnly}
            />
        </div>

    ); else return (
        <div className={styles.calendarColumn}>
        <p>{day.toLocaleDateString()}</p>
        <CalendarColumnDisplay
            date={day}
            events={props.events.filter((e) => sameDay(e.begin, day) || sameDay(e.end, day))}
            weekOnly={props.weekOnly}
            />
        </div>

    );
}

export type CalendarEvent = {
    begin: Date,
    end: Date,
    type: "available" | "client" | "representative"
    name?: string
    description?: string
};

export function WeekCalendar({events}: {events?: CalendarEvent[]}) {
    let date = new Date();
    date.setDate(date.getDate() - date.getDay());
    return (
        <>
        <div className={styles.calendar}>
            {[...Array(7).keys()].map((i) => (
                <CalendarColumn weekOnly={true} beginDate={date} index={i} events={events || []} />
            ))}
        </div>
        </>
    )
}
export default function Calendar({beginDate, events}: {beginDate: Date, events?: CalendarEvent[]}) {
    let date = new Date(beginDate);
    date.setDate(date.getDate() - date.getDay());
    return (
        <>
        <div className={styles.calendar}>
            {[...Array(7).keys()].map((i) => (
                <CalendarColumn beginDate={date} index={i} events={events || []} weekOnly={false} />
            ))}
        </div>
        </>
    )
}
