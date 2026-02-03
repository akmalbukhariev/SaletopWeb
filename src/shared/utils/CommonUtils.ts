class CommonUtils {
  private constructor() {}

  static ConvertUtcToLocal(date: number): string {
    const dateObj = new Date(date)
    const formatted = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} : ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`
    return formatted
  }

  static FormatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  static FormatDate(date: number | Date, locale: string = 'en-US'): string {
    const dateObj = typeof date === 'number' ? new Date(date) : date
    return dateObj.toLocaleDateString(locale)
  }

  static FormatDateTime(date: number | Date, locale: string = 'en-US'): string {
    const dateObj = typeof date === 'number' ? new Date(date) : date
    return dateObj.toLocaleString(locale)
  }

  static GetTimeDifference(startDate: number | Date, endDate: number | Date = new Date()): {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } {
    const start = typeof startDate === 'number' ? startDate : startDate.getTime()
    const end = typeof endDate === 'number' ? endDate : endDate.getTime()
    const diff = Math.abs(end - start)

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    }
  }
}

export default CommonUtils