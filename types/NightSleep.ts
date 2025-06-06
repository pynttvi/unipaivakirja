import {Time} from "@/types/Time";
import SleepQuality from "@/types/SleepQuality";

export default interface NightSleep {
    date: string
    wentToBed: Time
    delayToFallAsleep: number //minutes
    wakingUpDuringSleep: number //times
    wokeUp: Time
    gotOutOfBed: Time
    wasAwakeInTheNight: number //minutes
    slept: Time
    timeInBed: Time
    sleepQuality: SleepQuality // 1-10
    napTime: number //minutes
    coffeeCups: number //count
    alcoholDoses: number //count
    notes: string // long text

}