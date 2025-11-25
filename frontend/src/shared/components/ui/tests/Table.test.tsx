// src/shared/components/ui/tests/Table.test.tsx
import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../table';

describe('Table UI components', () => {
  it('renderiza la estructura completa (table, thead, tbody, tfoot, caption) con roles accesibles', () => {
    render(
      <Table data-testid="tabla" className="tabla-custom">
        <TableCaption>Listado de usuarios</TableCaption>

        <TableHeader data-testid="thead">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Edad</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody data-testid="tbody">
          <TableRow>
            <TableCell>Fabricio</TableCell>
            <TableCell>24</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Alvin</TableCell>
            <TableCell>28</TableCell>
          </TableRow>
        </TableBody>

        <TableFooter data-testid="tfoot">
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>2</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    // Tabla y grupos
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('tabla-custom');

    // thead / tbody / tfoot no tienen roles directos, pero existen en el árbol
    const thead = screen.getByTestId('thead');
    const tbody = screen.getByTestId('tbody');
    const tfoot = screen.getByTestId('tfoot');
    expect(thead.nodeName.toLowerCase()).toBe('thead');
    expect(tbody.nodeName.toLowerCase()).toBe('tbody');
    expect(tfoot.nodeName.toLowerCase()).toBe('tfoot');

    // Caption
    expect(screen.getByText('Listado de usuarios')).toBeInTheDocument();

    // Column headers
    const headerRow = within(thead).getByRole('row');
    const headers = within(headerRow).getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent('Nombre');
    expect(headers[1]).toHaveTextContent('Edad');

    // Body rows & cells
    const bodyRows = within(tbody).getAllByRole('row');
    expect(bodyRows).toHaveLength(2);

    const firstBodyCells = within(bodyRows[0]).getAllByRole('cell');
    expect(firstBodyCells).toHaveLength(2);
    expect(firstBodyCells[0]).toHaveTextContent('Fabricio');
    expect(firstBodyCells[1]).toHaveTextContent('24');

    const secondBodyCells = within(bodyRows[1]).getAllByRole('cell');
    expect(secondBodyCells).toHaveLength(2);
    expect(secondBodyCells[0]).toHaveTextContent('Alvin');
    expect(secondBodyCells[1]).toHaveTextContent('28');

    // Footer row & cells
    const footerRow = within(tfoot).getByRole('row');
    const footerCells = within(footerRow).getAllByRole('cell');
    expect(footerCells).toHaveLength(2);
    expect(footerCells[0]).toHaveTextContent('Total');
    expect(footerCells[1]).toHaveTextContent('2');
  });

  it('hace merge de className en elementos internos (TableRow, TableCell, TableHead)', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow className="fila-header-custom">
            <TableHead className="head-custom">A</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="fila-body-custom">
            <TableCell className="cell-custom">B</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const headerCell = screen.getByRole('columnheader', { name: 'A' });
    expect(headerCell).toHaveClass('head-custom');

    const bodyCell = screen.getByRole('cell', { name: 'B' });
    expect(bodyCell).toHaveClass('cell-custom');

    // Verificar class de las filas: obtener su padre <tr> desde la celda
    const headerRowEl = headerCell.closest('tr');
    const bodyRowEl = bodyCell.closest('tr');
    expect(headerRowEl).toHaveClass('fila-header-custom');
    expect(bodyRowEl).toHaveClass('fila-body-custom');
  });

  it('expone refs correctamente (forwardRef) en Table y TableRow', () => {
    const tableRef = createRef<HTMLTableElement>();
    const rowRef = createRef<HTMLTableRowElement>();

    render(
      <Table ref={tableRef}>
        <TableBody>
          <TableRow ref={rowRef}>
            <TableCell>Item</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(tableRef.current).toBeInstanceOf(HTMLTableElement);
    expect(rowRef.current).toBeInstanceOf(HTMLTableRowElement);
  });
});
//hola