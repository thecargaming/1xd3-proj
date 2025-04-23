import styles from './calendar.module.scss';

type CalendarColumnDisplayProps = {
    events: CalendarEvent[]
    date: Date,
}

type CalendarColumnProps = {
    index: number,
    beginDate: Date,
    events: CalendarEvent[]
};

function sameDay(a: Date, b: Date): boolean {
    return (a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate());
}

function CalendarEvent({event, date}: {event: CalendarEvent, date: Date}) {
    let eventType = {
        "available": styles.eventAvailable,
        "client": styles.eventClient,
        "representative": styles.eventRepresentative,
    }[event.type];
    let begin = event.begin.getHours()*60*60 + event.begin.getMinutes()*60 + event.begin.getSeconds();
    let end = event.end.getHours()*60*60 + event.end.getMinutes()*60 + event.end.getSeconds();
    let max = 24*60*60;
    if (!sameDay(event.begin, date)) begin=0;
    if (!sameDay(event.end, date)) end=max;

    return (
        <div style={{
            top: `${100*begin/max}%`,
            height: `${100*(end-begin)/max}%`,
        }} className={`${styles.event} ${eventType}`}>
        </div>
    )
}

function CalendarColumnDisplay(props: CalendarColumnDisplayProps) {
    return (
        <div className={styles.calendarColumnDisplay}>
            {props.events.map((e) => (
                <CalendarEvent event={e} date={props.date} />
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

    return (
        <div className={styles.calendarColumn}>
        <p>{day.toLocaleDateString()}</p>
        <CalendarColumnDisplay
            date={day}
            events={props.events.filter((e) => sameDay(e.begin, day) || sameDay(e.end, day))}
            />
        </div>
    )
}

export type CalendarEvent = {
    begin: Date,
    end: Date,
    type: "available" | "client" | "representative"
    name?: string
    description?: string
};
export default function Calendar({beginDate, events}: {beginDate: Date, events?: CalendarEvent[]}) {
    let date = new Date(beginDate);
    date.setDate(date.getDate() - date.getDay());
    return (
        <>
        <div className={styles.calendar}>
            {[...Array(7).keys()].map((i) => (
                <CalendarColumn beginDate={date} index={i} events={events || []} />
            ))}
        </div>
        </>
    )
}
