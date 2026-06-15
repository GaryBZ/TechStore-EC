export const cursorToObjects = async (cursor) => {
  const metaData = cursor.metaData;
  const rows = await cursor.getRows();
  await cursor.close();
  return rows.map(row =>
    Object.fromEntries(metaData.map((col, i) => [col.name.toLowerCase(), row[i]]))
  );
};