//  Stolen from: https://stackoverflow.com/a/54226985

const MILLIS_PER_SECOND = 1000;
const MILLIS_PER_MINUTE = MILLIS_PER_SECOND * 60;   //     60,000
const MILLIS_PER_HOUR = MILLIS_PER_MINUTE * 60;     //  3,600,000
const MILLIS_PER_DAY = MILLIS_PER_HOUR * 24;        // 86,400,000

export class TimeSpanOverflowError extends Error {
    constructor(msg: string){
        super(msg);
    }
}

export class TimeSpanFormatError extends Error {
    constructor(msg: string){
        super(msg);
    }
}

export class TimeSpan {
    private _millis: number;

    private static interval(value: number, scale: number): TimeSpan {
        if (Number.isNaN(value)) {
            throw new Error("Value can't be NaN");
        }

        const tmp = value * scale;
        const millis = TimeSpan.round(tmp + (value >= 0 ? 0.5 : -0.5));
        if ((millis > TimeSpan.maxValue.totalMilliseconds) || (millis < TimeSpan.minValue.totalMilliseconds)) {
            throw new TimeSpanOverflowError("TimeSpanTooLong");
        }

        return new TimeSpan(millis);
    }

    private static round(n: number): number {
        if (n < 0) {
            return Math.ceil(n);
        } else if (n > 0) {
            return Math.floor(n);
        }

        return 0;
    }

    private static timeToMilliseconds(hour: number, minute: number, second: number): number {
        const totalSeconds = (hour * 3600) + (minute * 60) + second;
        if (totalSeconds > TimeSpan.maxValue.totalSeconds || totalSeconds < TimeSpan.minValue.totalSeconds) {
            throw new TimeSpanOverflowError("TimeSpanTooLong");
        }

        return totalSeconds * MILLIS_PER_SECOND;
    }

    public static get zero(): TimeSpan {
        return new TimeSpan(0);
    }

    public static get maxValue(): TimeSpan {
        return new TimeSpan(Number.MAX_SAFE_INTEGER);
    }

    public static get minValue(): TimeSpan {
        return new TimeSpan(Number.MIN_SAFE_INTEGER);
    }

    public static fromDays(value: number): TimeSpan {
        return TimeSpan.interval(value, MILLIS_PER_DAY);
    }

    public static fromHours(value: number): TimeSpan {
        return TimeSpan.interval(value, MILLIS_PER_HOUR);
    }

    public static fromMilliseconds(value: number): TimeSpan {
        return TimeSpan.interval(value, 1);
    }

    public static fromMinutes(value: number): TimeSpan {
        return TimeSpan.interval(value, MILLIS_PER_MINUTE);
    }

    public static fromSeconds(value: number): TimeSpan {
        return TimeSpan.interval(value, MILLIS_PER_SECOND);
    }

    public static fromTime(hours: number, minutes: number, seconds: number): TimeSpan;
    public static fromTime(days: number, hours: number, minutes: number, seconds: number, milliseconds: number): TimeSpan;
    public static fromTime(daysOrHours: number, hoursOrMinutes: number, minutesOrSeconds: number, seconds?: number, milliseconds?: number): TimeSpan {
        if (seconds != undefined && milliseconds != undefined) {
            return this.fromTimeStartingFromDays(daysOrHours, hoursOrMinutes, minutesOrSeconds, seconds, milliseconds);
        } else {
            return this.fromTimeStartingFromHours(daysOrHours, hoursOrMinutes, minutesOrSeconds);
        }
    }

    public static fromLocale(locale: string): TimeSpan {
        const matches = locale.split(/[\s:.]/).map(m => Number(m));

        if(matches.length < 2)
            throw new TimeSpanFormatError("Invalid timespan format: " + locale);

        return TimeSpan.fromTime(0, matches[0], matches[1], matches[2] ?? 0, matches[3] ?? 0);
    }

    private static fromTimeStartingFromHours(hours: number, minutes: number, seconds: number): TimeSpan {
        const millis = TimeSpan.timeToMilliseconds(hours, minutes, seconds);
        return new TimeSpan(millis);
    }

    private static fromTimeStartingFromDays(days: number, hours: number, minutes: number, seconds: number, milliseconds: number): TimeSpan {
        const totalMilliSeconds = (days * MILLIS_PER_DAY) +
            (hours * MILLIS_PER_HOUR) +
            (minutes * MILLIS_PER_MINUTE) +
            (seconds * MILLIS_PER_SECOND) +
            milliseconds;

        if (totalMilliSeconds > TimeSpan.maxValue.totalMilliseconds || totalMilliSeconds < TimeSpan.minValue.totalMilliseconds) {
            throw new TimeSpanOverflowError("TimeSpanTooLong");
        }
        return new TimeSpan(totalMilliSeconds);
    }

    constructor(millis: number) {
        this._millis = millis;
    }

    public get days(): number {
        return TimeSpan.round(this._millis / MILLIS_PER_DAY);
    }

    public get hours(): number {
        return TimeSpan.round((this._millis / MILLIS_PER_HOUR) % 24);
    }

    public get minutes(): number {
        return TimeSpan.round((this._millis / MILLIS_PER_MINUTE) % 60);
    }

    public get seconds(): number {
        return TimeSpan.round((this._millis / MILLIS_PER_SECOND) % 60);
    }

    public get milliseconds(): number {
        return TimeSpan.round(this._millis % 1000);
    }

    public get totalDays(): number {
        return this._millis / MILLIS_PER_DAY;
    }

    public get totalHours(): number {
        return this._millis / MILLIS_PER_HOUR;
    }

    public get totalMinutes(): number {
        return this._millis / MILLIS_PER_MINUTE;
    }

    public get totalSeconds(): number {
        return this._millis / MILLIS_PER_SECOND;
    }

    public get totalMilliseconds(): number {
        return this._millis;
    }

    public get json(): any {
        return {
            days: this.days,
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            milliseconds: this.milliseconds,
            totalDays: this.totalDays,
            totalHours: this.totalHours,
            totalMinutes: this.totalMinutes,
            totalSeconds: this.totalSeconds,
            totalMilliseconds: this.totalMilliseconds,
            locale: this.toLocale()
        }
    }

    public toLocale(opts: any = {}): string {
        const hh = (this.hours < 10 ? '0' : '') + this.hours;
        const mm = (this.minutes < 10 ? '0' : '') + this.minutes;
        
        let t = hh + ':' + mm;

        if(opts.seconds){
            const ss = (this.seconds < 10 ? '0' : '') + this.seconds;
            t += ':' + ss;
        }

        if(opts.milliseconds){
            const ms = (this.milliseconds < 10 ? '00' : (this.milliseconds < 100 ? '0' : '')) + this.milliseconds;
            t += '.' + ms;
        }
        
        return t;
    }

    public add(ts: TimeSpan): TimeSpan {
        const result = this._millis + ts.totalMilliseconds;
        return new TimeSpan(result);
    }

    public subtract(ts: TimeSpan): TimeSpan {
        const result = this._millis - ts.totalMilliseconds;
        return new TimeSpan(result);
    }
}