declare module 'lunar-javascript' {
  const Lunar: {
    Solar: {
      fromYmd(year: number, month: number, day: number): {
        getLunar(): {
          getEightChar(): {
            getYearGan(): string
            getYearZhi(): string
            getMonthGan(): string
            getMonthZhi(): string
            getDayGan(): string
            getDayZhi(): string
            getTimeGan(): string
            getTimeZhi(): string
          }
        }
      }
      fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): {
        getLunar(): {
          getEightChar(): {
            getYearGan(): string
            getYearZhi(): string
            getMonthGan(): string
            getMonthZhi(): string
            getDayGan(): string
            getDayZhi(): string
            getTimeGan(): string
            getTimeZhi(): string
          }
        }
      }
    }
  }
  export default Lunar
}
