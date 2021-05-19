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

function renderRows<RowData, CellData>(
  data: TableProps<RowData, CellData>["data"],
  stripeColor: TableProps<RowData, CellData>["stripeColor"],
  mapRowDataToCells: TableProps<RowData, CellData>["mapRowDataToCells"],
  borderWidth: TableProps<RowData, CellData>["borderWidth"],
  mergeCell: TableProps<RowData, CellData>["mergeCell"],
  color: TableProps<RowData, CellData>["color"]
): JSX.Element[] {
  let rows: JSX.Element[] = [];
  let cellColors: {
    previousRow: Array<ColorValue | undefined>;
    currentRow: Array<ColorValue | undefined>;
  } = { previousRow: [], currentRow: [] };
  data.forEach((rowData: RowData, rowIndex: number) => {
    const rowColor = stripeColor && !(rowIndex % 2) ? stripeColor : color;
    const cells: JSX.Element[] = mapRowDataToCells(rowData).map(
      (cellData: CellData, cellIndex: number) => {
        const merge = mergeCell?.(rowIndex, cellIndex, data);
        const cellStyle: StyleProp<ViewStyle> = {};
        cellStyle.backgroundColor = rowColor;
        if (merge !== undefined) {
          if (merge === MergeCell.left) {
            cellStyle.borderLeftWidth = 0;
          } else {
            cellStyle.borderTopWidth = 0;
            cellStyle.backgroundColor = cellColors?.previousRow?.[cellIndex];
          }
        }
        cellColors.currentRow.push(cellStyle.backgroundColor || rowColor);
        return (
          <Cell key={cellIndex} borderWidth={borderWidth} style={cellStyle}>
            {cellData}
          </Cell>
        );
      }
    );
    cellColors.previousRow = [...cellColors.currentRow];
    cellColors.currentRow = [];
    rows.push(<Row key={rowIndex}>{cells}</Row>);
  });
  return rows;
}
