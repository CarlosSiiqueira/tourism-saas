export const dateValidate = (date: string | Date): Date => {

  if (typeof date == 'string') {
    date = new Date(date)
  }

  return date
}

export const formattingDate = (date?: string, showTime?: boolean) => {
  if (!date) return "";
  const instantiatingDate = new Date(date as string);
  instantiatingDate.setHours(instantiatingDate.getHours() + 3);

  if (showTime) {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    return instantiatingDate.toLocaleDateString("pt-br", options).replace(/\//g, '/');
  }

  return instantiatingDate.toLocaleDateString("pt-br");
}
