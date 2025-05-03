// 有効数字3桁で万人単位に変換する関数
export const formatPopulation = (value: number): string => {
  const manUnit = value / 10000;
  const magnitude = Math.floor(Math.log10(Math.abs(manUnit)));
  const power = 3 - magnitude - 1;
  const rounded = Math.round(manUnit * Math.pow(10, power)) / Math.pow(10, power);

  // 小数点第1位までの表示
  return `${rounded.toFixed(1)}万人`;
};

// ツールチップ用の正確な表示
export const formatTooltipValue = (value: number): string => {
  return value.toLocaleString() + "人";
};
