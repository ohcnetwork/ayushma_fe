export default function Table(props: any) {
  const columns = props.columns;
  const body = props?.body;
  return (
    <div>
      <div>
        <table className="w-full text-sm text-left ">
          <thead className="w-full text-xs text-gray-700 uppercase bg-gray-50 border border-gray-300 rounded-lg">
            <tr>
              {columns.map((col: string, i: number) => (
                <th key={i} scope="col" className="px-6 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          {body()}
        </table>
      </div>
    </div>
  );
}
