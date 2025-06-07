import {Time} from "@/types/Time";
import ZeroToTen from "@/types/ZeroToTen";

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
    sleepQuality: ZeroToTen // 1-10
    daytimeVitality: ZeroToTen // 1-10
    napTime: number //minutes
    coffeeCups: number //count
    alcoholDoses: number //count
    notes: string // long text

}