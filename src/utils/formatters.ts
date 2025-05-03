// 有効数字3桁で万人単位に変換する関数
export const formatPopulation = (value: number): string => {
  // valueが不正な値（NaN, undefined, null）または0の場合は「0」を返す
  if (!value || isNaN(value)) {
    return "0";
  }

  const manUnit = value / 10000;

  // 非常に小さい値の場合も「0」として扱う
  if (Math.abs(manUnit) < 0.001) {
    return "0";
  }

  try {
    const magnitude = Math.floor(Math.log10(Math.abs(manUnit)));
    const power = 3 - magnitude - 1;
    const rounded = Math.round(manUnit * Math.pow(10, power)) / Math.pow(10, power);

    // 小数点第1位までの表示
    return `${rounded}`;
  } catch (error) {
    // 何らかの計算エラーが発生した場合も安全に「0」を返す
    console.error("Population formatting error:", error);
    return "0";
  }
};

// ツールチップ用の正確な表示
export const formatTooltipValue = (value: number): string => {
  if (!value || isNaN(value)) {
    return "0人";
  }
  return value.toLocaleString() + "人";
};
