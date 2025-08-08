export class TimesHelper {
  public static fromSecondsToMinutes(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} seg`;
  }

  public static formatDate(dateString: string): string {
    const [day, month, year] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  public static formatFromDate(date: Date, format: 'YYYY-MM-DD' | 'DD-MM-YYYY' = 'DD-MM-YYYY'): string {
    console.log({ date })
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    if (format === 'YYYY-MM-DD') {
      return `${year}-${month}-${day}`
    } else {
      return `${day}-${month}-${year}`
    }
  }
}
