import PropTypes from "prop-types";

export function TableHead({ cols }) {
  return (
    <thead>
      <tr>
        {cols.map((tr, idx) => (
          <th key={idx} scope="col" style={idx === 0 ? { width: "100px" } : {}}>
            {tr}
          </th>
        ))}
      </tr>
    </thead>
  );
}
TableHead.propTypes = {
  cols: PropTypes.array,
};

export function TableBody({ data, TableRow, ...rest }) {
  if (!data) return <></>;

  return (
    <tbody>
      {data.map(item => (
        <TableRow key={item.id} item={item} {...rest} />
      ))}
    </tbody>
  );
}
TableBody.propTypes = {
  data: PropTypes.array,
  TableRow: PropTypes.elementType.isRequired,
};
