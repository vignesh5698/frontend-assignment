export const serializeAmountRecords = (amountRecords) => {
  const serializedAmountRecords = amountRecords.map((amountRecord) => {
    return {
      sNo: amountRecord["s.no"],
      amountPledged: amountRecord["amt.pledged"],
      percentageFunded: amountRecord["percentage.funded"],
    };
  });

  return serializedAmountRecords;
};
