import * as React from "react";
import { ScrollView, Text, TextStyle } from "react-native";
import { Cell } from "../components/Cell";
import { Row } from "../components/Row";

interface TableProps<RowData, CellData> {
  data: RowData[];
  mapRowDataToCells: (rowData: RowData) => CellData[];
  color?: string;
  stripeColor?: string;
  headers?: string[];
  headerTextStyle?: TextStyle;
}

export function Table<RowData, CellData>({
  data,
  color,
  headers,
  mapRowDataToCells,
  headerTextStyle,
  stripeColor,
}: TableProps<RowData, CellData>) {
  const headerRow = headers ? (
    <Row key={-1} style={{ backgroundColor: color ? color : "white" }}>
      {headers.map((header: string, index: number) => (
        <Cell key={index}>
          <Text style={headerTextStyle}>{header}</Text>
        </Cell>
      ))}
    </Row>
  ) : undefined;

  const rows: JSX.Element[] = data.map((rowData: RowData, index: number) => {
    return (
      <Row
        key={index}
        style={{
          backgroundColor:
            stripeColor && !(index % 2) ? stripeColor : undefined,
        }}
      >
        {mapRowDataToCells(rowData).map(
          (cellData: CellData, cellIndex: number) => (
            <Cell key={cellIndex}>{cellData}</Cell>
          )
        )}
      </Row>
    );
  });

  if (headerRow) rows.unshift(headerRow);

  return (
    <ScrollView
      stickyHeaderIndices={headerRow ? [0] : []}
      contentContainerStyle={{ backgroundColor: color }}
    >
      {rows}
    </ScrollView>
  );
}
