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
}
