const getRank = bonus => {
  if (bonus === 0) {
    return { value: 0, percentage: '0%' };
  } else if (bonus >= 1 && bonus <= 7) {
    return { value: 1, percentage: '+' + bonus + '%' };
  } else if (bonus >= 8 && bonus <= 15) {
    return { value: 2, percentage: '+' + bonus + '%' };
  } else if (bonus >= 16 && bonus <= 24) {
    return { value: 3, percentage: '+' + bonus + '%' };
  } else if (bonus >= 25 && bonus <= 34) {
    return { value: 4, percentage: '+' + bonus + '%' };
  } else if (bonus >= 35 && bonus <= 45) {
    return { value: 5, percentage: '+' + bonus + '%' };
  }
}

export default getRank