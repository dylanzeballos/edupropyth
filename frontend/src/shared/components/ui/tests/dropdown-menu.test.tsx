import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "../dropdown-menu";

const renderMenu = (children: React.ReactNode) =>
  render(
    <DropdownMenu open>
      <DropdownMenuTrigger>Trigger</DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  );

describe("DropdownMenu UI Components", () => {
  it("DropdownMenuItem aplica pl-8 cuando inset=true", () => {
    renderMenu(<DropdownMenuItem inset>Elemento</DropdownMenuItem>);
    expect(screen.getByText("Elemento").className).toContain("pl-8");
  });

  it("DropdownMenuItem NO aplica pl-8 sin inset", () => {
    renderMenu(<DropdownMenuItem>Normal</DropdownMenuItem>);
    expect(screen.getByText("Normal").className).not.toContain("pl-8");
  });

  it("CheckboxItem aria-checked='true' cuando checked", () => {
    renderMenu(
      <DropdownMenuCheckboxItem checked>
        Checkbox ON
      </DropdownMenuCheckboxItem>
    );
    expect(screen.getByText("Checkbox ON").getAttribute("aria-checked")).toBe("true");
  });

  it("CheckboxItem aria-checked='false' cuando no checked", () => {
    renderMenu(
      <DropdownMenuCheckboxItem>
        Checkbox OFF
      </DropdownMenuCheckboxItem>
    );
    expect(screen.getByText("Checkbox OFF").getAttribute("aria-checked")).toBe("false");
  });

  it("RadioItem aria-checked='true' dentro de RadioGroup", () => {
    renderMenu(
      <DropdownMenuRadioGroup value="a">
        <DropdownMenuRadioItem value="a">Radio seleccionado</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    );
    expect(screen.getByText("Radio seleccionado").getAttribute("aria-checked")).toBe("true");
  });

  it("RadioItem aria-checked='false' cuando value no coincide", () => {
    renderMenu(
      <DropdownMenuRadioGroup value="x">
        <DropdownMenuRadioItem value="a">Radio off</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    );
    expect(screen.getByText("Radio off").getAttribute("aria-checked")).toBe("false");
  });

  it("DropdownMenuSubTrigger renderiza texto e icono SVG", () => {
    renderMenu(
      <DropdownMenuSub>
        <DropdownMenuSubTrigger inset>Submenú</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>Contenido</DropdownMenuSubContent>
      </DropdownMenuSub>
    );
    const el = screen.getByText("Submenú");
    expect(el.className).toContain("pl-8");
    expect(el.querySelector("svg")).toBeTruthy();
  });
});
