import * as React from "react";
import {
  ColorValue,
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Cell } from "../components/Cell";
import { Row } from "../components/Row";

export enum MergeCell {
  top,
  left,
}

interface TableProps<RowData, CellData> {
  data: RowData[];
  mapRowDataToCells: (rowData: RowData) => CellData[];
  mergeCell?: (
    rowIndex: number,
    cellIndex: number,
    tableData: RowData[]
  ) => MergeCell | void;
  color?: string;
  stripeColor?: string;
  headers?: string[];
  scrollable?: boolean;
  headerTextStyle?: TextStyle;
  borderWidth?: number;
}

export function Table<RowData, CellData>({
  data,
  color,
  headers,
  mapRowDataToCells,
  mergeCell,
  headerTextStyle,
  stripeColor,
  borderWidth = 0,
  scrollable = false,
}: TableProps<RowData, CellData>) {
  const headerRow = headers ? (
    <Row key={-1} style={{ backgroundColor: color ? color : "white" }}>
      {headers.map((header: string, index: number) => (
        <Cell key={index} borderWidth={borderWidth}>
          <Text style={headerTextStyle}>{header}</Text>
        </Cell>
      ))}
    </Row>
  ) : undefined;

  const rows: JSX.Element[] = renderRows(
    data,
    stripeColor,
    mapRowDataToCells,
    borderWidth,
    mergeCell,
    color
  );

  if (headerRow) rows.unshift(headerRow);

  return scrollable ? (
    <ScrollView
      stickyHeaderIndices={headerRow ? [0] : []}
      contentContainerStyle={{ backgroundColor: color }}
    >
      {rows}
    </ScrollView>
  ) : (
    <View
      style={{
        backgroundColor: color,
        flex: 1,
        borderBottomWidth: borderWidth,
        borderRightWidth: borderWidth,
      }}
    >
      {rows}
    </View>
  );
}

interface RowCellColors {
  previousRow: Array<ColorValue | undefined>;
  currentRow: Array<ColorValue | undefined>;
}

function renderRows<RowData, CellData>(
  data: TableProps<RowData, CellData>["data"],
  stripeColor: TableProps<RowData, CellData>["stripeColor"],
  mapRowDataToCells: TableProps<RowData, CellData>["mapRowDataToCells"],
  borderWidth: TableProps<RowData, CellData>["borderWidth"],
  mergeCell: TableProps<RowData, CellData>["mergeCell"],
  color: TableProps<RowData, CellData>["color"]
): JSX.Element[] {
  let rows: JSX.Element[] = [];
  let cellColors: RowCellColors = { previousRow: [], currentRow: [] };

  data.forEach((rowData: RowData, rowIndex: number) => {
    const rowColor = !(rowIndex % 2) ? stripeColor : color;
    const mergeCellPartial = (cellIndex: number) =>
      mergeCell?.(rowIndex, cellIndex, data);

    const cells: JSX.Element[] = renderCells(
      rowData,
      mapRowDataToCells,
      cellColors,
      mergeCellPartial,
      borderWidth,
      rowColor
    );

    cellColors.previousRow = [...cellColors.currentRow];
    cellColors.currentRow = [];
    rows.push(<Row key={rowIndex}>{cells}</Row>);
  });

  return rows;
}

function renderCells<RowData, CellData>(
  rowData: RowData,
  mapRowDataToCells: TableProps<RowData, CellData>["mapRowDataToCells"],
  cellColors: RowCellColors,
  mergeCell: (cellIndex: number) => void | MergeCell | undefined,
  borderWidth: TableProps<RowData, CellData>["borderWidth"],
  rowColor: string | undefined
): JSX.Element[] {
  return mapRowDataToCells(rowData).map(
    (cellData: CellData, cellIndex: number) => {
      const cellStyle: StyleProp<ViewStyle> = calculateCellStyle(
        mergeCell?.(cellIndex),
        rowColor,
        cellColors.previousRow?.[cellIndex]
      );
      cellColors.currentRow.push(cellStyle.backgroundColor || rowColor);
      return (
        <Cell key={cellIndex} borderWidth={borderWidth} style={cellStyle}>
          {cellData}
        </Cell>
      );
    }
  );
}

function calculateCellStyle(
  merge: MergeCell | void | undefined,
  rowColor: ColorValue | undefined,
  aboveCellColor: ColorValue | undefined
): ViewStyle {
  const cellStyle: ViewStyle = {};
  cellStyle.backgroundColor = rowColor;
  if (merge === MergeCell.left) {
    cellStyle.borderLeftWidth = 0;
  } else if (merge === MergeCell.top) {
    cellStyle.borderTopWidth = 0;
    cellStyle.backgroundColor = aboveCellColor;
  }
  return cellStyle;
}
