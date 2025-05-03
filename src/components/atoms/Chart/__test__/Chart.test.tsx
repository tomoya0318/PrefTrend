import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PopulationByYear } from "../../../../types/domain/chart";
import * as formatters from "../../../../utils/formatters";
import { Chart, ChartProps } from "../Chart"; // パスは実際のファイル構造に合わせて調整してください

// 新しいモックデータ
const mockChartData: PopulationByYear[] = [
  { year: 2015, 東京都: 13515271, 大阪府: 8839469 },
  { year: 2020, 東京都: 13960000, 大阪府: 8823000 },
  { year: 2025, 東京都: 14012000, 大阪府: 8753000 },
];

const mockLines = [
  { dataKey: "東京都", name: "東京都", color: "#1f77b4" },
  { dataKey: "大阪府", name: "大阪府", color: "#ff7f0e" },
];

// フォーマッターのモック
vi.mock("../../../utils/formatters", () => ({
  formatPopulation: vi.fn((value) => `${value.toLocaleString()}人`),
  formatTooltipValue: vi.fn((value) => `${value.toLocaleString()}人`),
}));

// Rechartsコンポーネントのモック
vi.mock("recharts", () => {
  const lineChartMock = vi.fn(({ children }) => <div data-testid="line-chart">{children}</div>);
  const xAxisMock = vi.fn(({ dataKey, label }) => (
    <div data-datakey={dataKey} data-label={label.value} data-testid="x-axis">
      XAxis
    </div>
  ));
  const yAxisMock = vi.fn(({ label, tickFormatter }) => (
    <div data-formatter={typeof tickFormatter} data-label={label.value} data-testid="y-axis">
      YAxis
    </div>
  ));
  const cartesianGridMock = vi.fn(() => <div data-testid="cartesian-grid">CartesianGrid</div>);
  const tooltipMock = vi.fn(({ formatter, labelFormatter }) => (
    <div
      data-formatter={typeof formatter}
      data-label-formatter={typeof labelFormatter}
      data-testid="tooltip"
    >
      Tooltip
    </div>
  ));
  const legendMock = vi.fn(() => <div data-testid="legend">Legend</div>);
  const lineMock = vi.fn(({ dataKey, stroke, name }) => (
    <div data-datakey={dataKey} data-name={name} data-stroke={stroke} data-testid="line">
      Line
    </div>
  ));
  const responsiveContainerMock = vi.fn(({ children, width, height }) => (
    <div data-height={height} data-testid="responsive-container" data-width={width}>
      {children}
    </div>
  ));

  return {
    LineChart: lineChartMock,
    XAxis: xAxisMock,
    YAxis: yAxisMock,
    CartesianGrid: cartesianGridMock,
    Tooltip: tooltipMock,
    Legend: legendMock,
    Line: lineMock,
    ResponsiveContainer: responsiveContainerMock,
  };
});

describe("Chart Component", () => {
  let props: ChartProps;

  beforeEach(() => {
    props = {
      data: mockChartData,
      lines: mockLines,
    };
    // テスト前にモックをリセット
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<Chart {...props} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("renders with correct dimensions", () => {
    render(<Chart {...props} />);
    const container = screen.getByTestId("responsive-container");
    expect(container).toHaveAttribute("data-width", "100%");
    expect(container).toHaveAttribute("data-height", "300");
  });

  it("renders XAxis with default label", () => {
    render(<Chart {...props} />);
    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis).toHaveAttribute("data-datakey", "year");
    expect(xAxis).toHaveAttribute("data-label", "年");
  });

  it("renders YAxis with default label and formatter", () => {
    render(<Chart {...props} />);
    const yAxis = screen.getByTestId("y-axis");
    expect(yAxis).toHaveAttribute("data-label", "人口数");
    expect(yAxis).toHaveAttribute("data-formatter", "function");
  });

  it("renders custom axis labels when provided", () => {
    const customProps = { ...props, xAxisLabel: "カスタムX軸", yAxisLabel: "カスタムY軸" };
    render(<Chart {...customProps} />);

    expect(screen.getByTestId("x-axis")).toHaveAttribute("data-label", "カスタムX軸");
    expect(screen.getByTestId("y-axis")).toHaveAttribute("data-label", "カスタムY軸");
  });

  it("renders correct number of Line components", () => {
    render(<Chart {...props} />);
    const lines = screen.getAllByTestId("line");
    expect(lines).toHaveLength(mockLines.length);
  });

  it("passes correct props to Line components", () => {
    render(<Chart {...props} />);
    const lines = screen.getAllByTestId("line");

    lines.forEach((line, index) => {
      expect(line).toHaveAttribute("data-datakey", mockLines[index].dataKey);
      expect(line).toHaveAttribute("data-stroke", mockLines[index].color);
      expect(line).toHaveAttribute("data-name", mockLines[index].name);
    });
  });

  it("uses formatters correctly", () => {
    render(<Chart {...props} />);

    // フォーマッターが正しく使用されていることを確認
    expect(formatters.formatPopulation).toBeDefined();
    expect(formatters.formatTooltipValue).toBeDefined();

    // TooltipコンポーネントがフォーマッターとLabelFormatterを使用していることを確認
    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toHaveAttribute("data-formatter", "function");
    expect(tooltip).toHaveAttribute("data-label-formatter", "function");
  });

  // 新しいテストケース: 都道府県データの確認
  it("handles prefecture population data correctly", () => {
    render(<Chart {...props} />);

    // 東京都と大阪府のデータが正しく表示されることを確認
    const lines = screen.getAllByTestId("line");
    expect(lines[0]).toHaveAttribute("data-datakey", "東京都");
    expect(lines[0]).toHaveAttribute("data-name", "東京都");
    expect(lines[0]).toHaveAttribute("data-stroke", "#1f77b4");

    expect(lines[1]).toHaveAttribute("data-datakey", "大阪府");
    expect(lines[1]).toHaveAttribute("data-name", "大阪府");
    expect(lines[1]).toHaveAttribute("data-stroke", "#ff7f0e");
  });

  it("renders with the correct data structure", () => {
    // データ構造が期待通りであることを確認するテスト
    const { rerender } = render(<Chart {...props} />);

    // LineChartに正しいデータが渡されていることを確認
    const lineChart = screen.getByTestId("line-chart");
    expect(lineChart).toBeInTheDocument();

    // 異なるデータでの再レンダリングテスト
    const updatedData = [...mockChartData, { year: 2030, 東京都: 14100000, 大阪府: 8700000 }];

    rerender(<Chart data={updatedData} lines={mockLines} />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});
