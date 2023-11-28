import newrelic from "newrelic"

export const recordNREvent = (name: string, data: any) => {
    newrelic.recordCustomEvent(name, data)
}