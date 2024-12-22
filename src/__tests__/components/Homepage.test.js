import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Homepage from "./Homepage";
import React from "react";
import { getAmountData } from "../../api/amount";

jest.mock("../../api/amount");

const mockData = [
  { sNo: 1, amountPledged: 1000, percentageFunded: 50 },
  { sNo: 2, amountPledged: 2000, percentageFunded: 70 },
  { sNo: 3, amountPledged: 1500, percentageFunded: 60 },
  { sNo: 4, amountPledged: 2500, percentageFunded: 80 },
  { sNo: 5, amountPledged: 1200, percentageFunded: 55 },
  { sNo: 6, amountPledged: 3000, percentageFunded: 90 },
];

describe("Homepage Component", () => {
  beforeEach(async () => {
    getAmountData.mockResolvedValue(mockData);
    render(<Homepage />);

    await waitFor(() => expect(getAmountData).toHaveBeenCalled());
  });

  it("renders table with data", async () => {
    const rows = await screen.findAllByRole("row");
    expect(rows).toHaveLength(6);
  });

  it("filters data based on input", async () => {
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "2000" } });

    const rows = await screen.findAllByRole("row");
    expect(rows).toHaveLength(2);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("sorts data by S.No column", async () => {
    const columnHeader = screen.getByText("S.No");
    fireEvent.click(columnHeader);

    const rows = await screen.findAllByRole("row");
    const firstRow = rows[1].children;
    expect(firstRow[0].textContent).toBe("1");

    fireEvent.click(columnHeader);
    const lastRow = rows[rows.length - 1].children;
    expect(lastRow[0].textContent).toBe("6");
  });

  it("paginates data correctly", async () => {
    const rows = await screen.findAllByRole("row");
    expect(rows).toHaveLength(6);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("updates records per page", async () => {
    const select = screen.getByLabelText("Records per page:");
    fireEvent.change(select, { target: { value: "10" } });

    const rows = await screen.findAllByRole("row");
    expect(rows).toHaveLength(7);
  });

  it("disables Previous button on the first page", async () => {
    const prevButton = screen.getByText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("disables Next button on the last page", async () => {
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled();
  });
});
