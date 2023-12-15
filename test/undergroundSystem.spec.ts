import { expect } from 'chai'
import { UndergroundSystem } from '../src/undergroundSystem'

describe('UndergroundStation', () => {
  describe('checkIn', () => {
    it('should check in customer at railway station', () => {
      const undergroundSystem = new UndergroundSystem()

      undergroundSystem.checkIn(45, 'Leyton', 3)

      expect(undergroundSystem.customerTravelLog.has(45)).to.equal(true)
      expect(undergroundSystem.customerTravelLog.get(45)?.length).to.equal(1)
      expect(
        undergroundSystem.customerTravelLog.get(45)?.[0].start?.stationName
      ).to.equal('Leyton')
      expect(
        undergroundSystem.customerTravelLog.get(45)?.[0].start?.time
      ).to.equal(3)

      expect(undergroundSystem.stationCommuterData.has('Leyton')).to.equal(true)
    })
  })

  describe('checkOut', () => {
    it('should check out customer at railway station', () => {
      const undergroundSystem = new UndergroundSystem()

      undergroundSystem.checkIn(32, 'Paradise', 8)
      undergroundSystem.checkOut(32, 'Cambridge', 22)

      expect(
        undergroundSystem.customerTravelLog.get(32)?.[0].end?.stationName
      ).to.equal('Cambridge')
      expect(
        undergroundSystem.customerTravelLog.get(32)?.[0].end?.time
      ).to.equal(22)

      expect(
        undergroundSystem.stationCommuterData.get('Paradise')?.has('Cambridge')
      ).to.equal(true)
    })
  })

  describe('getAverageTime', () => {
    it('should compute average time between railway stations', () => {
      const undergroundSystem = new UndergroundSystem()

      undergroundSystem.checkIn(32, 'Paradise', 8)
      undergroundSystem.checkOut(32, 'Cambridge', 22)

      const customerTotalMileage = undergroundSystem.stationCommuterData
        .get('Paradise')
        ?.get('Cambridge')?.customerTotalMileage
      const totalTripCount = undergroundSystem.stationCommuterData
        .get('Paradise')
        ?.get('Cambridge')?.totalTripCount

      expect(
        undergroundSystem.getAverageTime('Paradise', 'Cambridge')
      ).to.equal(Number(customerTotalMileage) / Number(totalTripCount))
    })

    it('should compute average time between railway stations', () => {
      const undergroundSystem = new UndergroundSystem()

      undergroundSystem.checkIn(45, 'Leyton', 3)
      undergroundSystem.checkIn(27, 'Leyton', 10)
      undergroundSystem.checkOut(45, 'Waterloo', 15)
      undergroundSystem.checkOut(27, 'Waterloo', 20)
      undergroundSystem.checkIn(10, 'Leyton', 24)
      undergroundSystem.checkOut(10, 'Waterloo', 38)

      const customerTotalMileage = undergroundSystem.stationCommuterData
        .get('Leyton')
        ?.get('Waterloo')?.customerTotalMileage
      const totalTripCount = undergroundSystem.stationCommuterData
        .get('Leyton')
        ?.get('Waterloo')?.totalTripCount

      expect(undergroundSystem.getAverageTime('Leyton', 'Waterloo')).to.equal(
        Number(customerTotalMileage) / Number(totalTripCount)
      )
    })
  })
})
