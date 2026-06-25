export default function Table({
    columns,
    data
}) {

    return (

        <table className="w-full">

            <thead>

                <tr>

                    {
                        columns.map((column) => (

                            <th
                                key={column.key}
                                className="text-left p-3"
                            >
                                {column.title}
                            </th>

                        ))
                    }

                </tr>

            </thead>

            <tbody>

                {
                    data.map((item) => (

                        <tr key={item.id}>

                            {
                                columns.map((column) => (

                                    <td
                                        key={column.key}
                                        className="p-3"
                                    >
                                        {
                                            column.render
                                                ? column.render(item)
                                                : item[column.key]
                                        }
                                    </td>

                                ))
                            }

                        </tr>

                    ))
                }

            </tbody>

        </table>

    )
}