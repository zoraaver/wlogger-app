import * as React from "react";
import { ScrollView, Text, TextStyle, View } from "react-native";
import { Cell } from "../components/Cell";
import { Row } from "../components/Row";

interface TableProps<RowData, CellData> {
  data: RowData[];
  mapRowDataToCells: (rowData: RowData) => CellData[];
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
  headerTextStyle,
  stripeColor,
  borderWidth = 0,
  scrollable = false,
}: TableProps<RowData, CellData>) {
  const headerRow = headers ? (
    <Row
      borderWidth={borderWidth}
      topBorder
      key={-1}
      style={{ backgroundColor: color ? color : "white" }}
    >
      {headers.map((header: string, index: number) => (
        <Cell key={index} borderWidth={borderWidth}>
          <Text style={headerTextStyle}>{header}</Text>
        </Cell>
      ))}
    </Row>
  ) : undefined;

  const rows: JSX.Element[] = data.map((rowData: RowData, index: number) => (
    <Row
      key={index}
      borderWidth={borderWidth}
      style={{
        backgroundColor: stripeColor && !(index % 2) ? stripeColor : undefined,
      }}
    >
      {mapRowDataToCells(rowData).map(
        (cellData: CellData, cellIndex: number) => (
          <Cell key={cellIndex} borderWidth={borderWidth}>
            {cellData}
          </Cell>
        )
      )}
    </Row>
  ));

  if (headerRow) rows.unshift(headerRow);

  return scrollable ? (
    <ScrollView
      stickyHeaderIndices={headerRow ? [0] : []}
      contentContainerStyle={{ backgroundColor: color }}
    >
      {rows}
    </ScrollView>
  ) : (
    <View style={{ backgroundColor: color, flex: 1 }}>{rows}</View>
  );
}
