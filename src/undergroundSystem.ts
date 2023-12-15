/** 
 * @title 1396. Design Underground System
 * @statement https://leetcode.com/problems/design-underground-system/
 * @difficulty Medium

An underground railway system is keeping track of customer travel times between different stations.
They are using this data to calculate the average time it takes to travel from one station to another.

Implement the UndergroundSystem class:

void checkIn(int id, string stationName, int t)
A customer with a card ID equal to id, checks in at the station stationName at time t.
A customer can only be checked into one place at a time.

void checkOut(int id, string stationName, int t)
A customer with a card ID equal to id, checks out from the station stationName at time t.

double getAverageTime(string startStation, string endStation)
Returns the average time it takes to travel from startStation to endStation.

The average time is computed from all the previous traveling times from startStation to endStation that happened directly, 
meaning a check in at startStation followed by a check out from endStation.
The time it takes to travel from startStation to endStation may be different 
from the time it takes to travel from endStation to startStation.
There will be at least one customer that has traveled from startStation to endStation before getAverageTime is called.

You may assume all calls to the checkIn and checkOut methods are consistent.
If a customer checks in at time t1 then checks out at time t2, then t1 < t2.All events happen in chronological order.
*/

type TravelEvent = {
  stationName: string
  time: number
}

type Trip = {
  start: TravelEvent
  end?: TravelEvent
}

type StationStats = {
  customerTotalMileage: number
  totalTripCount: number
}

class UndergroundSystem {
  // <customer, [trips]>
  customerTravelLog = new Map<number, Trip[]>()

  //<startStation, <endStation, {customerTotalMileage, totalTripCount}>>
  stationCommuterData = new Map<string, Map<string, StationStats>>()

  /**
   *
   * @param customer
   * @param stationName
   * @param time
   */
  checkIn(customer: number, stationName: string, time: number): void {
    const start: TravelEvent = {
      stationName,
      time,
    }

    // A customer has not checked in to any station
    if (!this.customerTravelLog.has(customer)) {
      this.customerTravelLog.set(customer, [] as Trip[])
    }

    // Add the start travel event to the customer's trips
    const customerTrips = this.customerTravelLog.get(customer)
    customerTrips && (customerTrips[customerTrips.length] = { start })

    // Record customer check in at the start station
    // if it doesn't already exist
    if (!this.stationCommuterData.has(stationName)) {
      this.stationCommuterData.set(stationName, new Map<string, StationStats>())
    }

    console.log('customer', customer, 'checked in at', stationName, 'at', time)
  }

  /**
   *
   * @param customer
   * @param stationName
   * @param time
   */
  checkOut(customer: number, stationName: string, time: number): void {
    const end: TravelEvent = {
      stationName,
      time,
    }

    const customerTrips = this.customerTravelLog.get(customer) || ([] as Trip[])

    let lastTrip = customerTrips[customerTrips.length - 1]
    lastTrip = { start: lastTrip.start, end }

    const endStationMap =
      this.stationCommuterData.get(lastTrip.start?.stationName) ||
      new Map<string, StationStats>()

    // Create a new entry for end station
    // if it doesn't already exist
    if (!endStationMap.has(stationName)) {
      endStationMap.set(stationName, {
        customerTotalMileage: 0,
        totalTripCount: 0,
      })
    }

    const tripDuration = time - lastTrip.start?.time

    let { customerTotalMileage, totalTripCount } = endStationMap.get(
      stationName
    ) || { customerTotalMileage: 0, totalTripCount: 0 }

    customerTotalMileage = customerTotalMileage + tripDuration
    totalTripCount = totalTripCount + 1

    endStationMap.set(stationName, { customerTotalMileage, totalTripCount })

    console.log('customer', customer, 'checked out at', stationName, 'at', time)
  }

  /**
   *
   * @param startStation
   * @param endStation
   */
  getAverageTime(startStation: string, endStation: string): number {
    const total = this.stationCommuterData.get(startStation)?.get(endStation)
      ?.customerTotalMileage
    const count = this.stationCommuterData.get(startStation)?.get(endStation)
      ?.totalTripCount

    let average = 0

    if (total && count) {
      average = Number(total) / Number(count)
    }

    console.log(
      'average time from',
      startStation,
      'to',
      endStation,
      'is',
      average
    )

    return average
  }
}

export { UndergroundSystem }
