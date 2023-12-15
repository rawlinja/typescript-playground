import { UndergroundSystem } from './undergroundSystem'

type UndergroundStationRecord = (
  | []
  | [string, string]
  | [number, string, number]
)[]

const CHECK_IN_OR_CHECKOUT = 3
const CALCULATE_AVERAGE_TIME = 2

function processSystemData(record: UndergroundStationRecord) {
  const customerIds = new Set()
  const undergroundStation = new UndergroundSystem()

  for (const item of record) {
    if (CHECK_IN_OR_CHECKOUT === item.length) {
      const [customer, stationName, time] = item

      if (!customerIds.has(customer)) {
        undergroundStation.checkIn(customer, stationName, time)
        // Add customer id after checking in
        customerIds.add(customer)
      } else {
        undergroundStation.checkOut(customer, stationName, time)
        // Remove customer id after checking out
        customerIds.delete(customer)
      }
    } else if (CALCULATE_AVERAGE_TIME === item.length) {
      const [statStationName, endStationName] = item
      undergroundStation.getAverageTime(statStationName, endStationName)
    }
  }
}

const record_1: UndergroundStationRecord = [
  [],
  [45, 'Leyton', 3],
  [32, 'Paradise', 8],
  [27, 'Leyton', 10],
  [45, 'Waterloo', 15],
  [27, 'Waterloo', 20],
  [32, 'Cambridge', 22],
  ['Paradise', 'Cambridge'],
  ['Leyton', 'Waterloo'],
  [10, 'Leyton', 24],
  ['Leyton', 'Waterloo'],
  [10, 'Waterloo', 38],
  ['Leyton', 'Waterloo'],
]

const record_2: UndergroundStationRecord = [
  [],
  [10, 'Leyton', 3],
  [10, 'Paradise', 8],
  ['Leyton', 'Paradise'],
  [5, 'Leyton', 10],
  [5, 'Paradise', 16],
  ['Leyton', 'Paradise'],
  [2, 'Leyton', 21],
  [2, 'Paradise', 30],
  ['Leyton', 'Paradise'],
]

const records = [record_1, record_2]

console.time('debug')
for (const record of records) {
  processSystemData(record)
  console.log('\n')
}
console.timeEnd('debug')
