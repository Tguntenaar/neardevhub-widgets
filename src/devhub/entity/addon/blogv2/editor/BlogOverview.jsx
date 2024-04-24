// Pagination not necessary since it won't be too many blogs per community
// a few hundred widgets per account are also not a problem
const { data, editPostId, handleItemClick, selectedItem } = props;

const options = { year: "numeric", month: "short", day: "numeric" };
const formattedDate = (date) => new Date(date).toLocaleString("en-US", options);

// TODO move this to the provider
const reshapedData =
  Object.keys(data || {}).map((key) => {
    return {
      id: key,
      title: data[key].metadata.title,
      status: data[key].metadata.status,
      createdAt: formattedDate(data[key].metadata.createdAt),
      updatedAt: formattedDate(data[key].metadata.updatedAt),
      publishedAt: formattedDate(data[key].metadata.publishedAt),
      content: data[key][""],
      author: data[key].metadata.author,
      description: data[key].metadata.description,
      subtitle: data[key].metadata.subtitle,
      category: data[key].metadata.category,
    };
  }) || [];

console.log({ reshapedData });

const blogData = [
  {
    id: "new",
    title: "New Blog Post",
    status: "DRAFT",
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    publishedAt: "mm-dd-yyyy",
    author: "",
    description: "",
    subtitle: "",
    content: "",
  },
  ...reshapedData,
];

return (
  <table id="manage-blog-table" className="table table-hover">
    <thead>
      {/* TODO make this clickable to sort based on one of the columns (double click to reverse) */}
      {props.hideColumns ? null : (
        <tr>
          <th scope="col">Blog title</th>
          <td scope="col">Status</td>
          <td scope="col">Created At</td>
          <td scope="col">Updated At</td>
          <td scope="col">Visible Publish Date</td>
        </tr>
      )}
    </thead>
    <tbody>
      {(blogData || []).map((it) => {
        if (it.id === "new" && selectedItem !== null) {
          return;
        }

        return (
          <tr
            id={`edit-blog-selector-${it.id}`}
            key={it.id}
            onClick={() => handleItemClick(it)}
          >
            <th
              scope="row"
              className={
                (it.id === selectedItem.id && selectedItem !== null) ||
                (it.id === "new" && selectedItem === null)
                  ? "table-primary"
                  : ""
              }
            >
              {it.title}
            </th>
            {!props.hideColumns ? (
              <>
                <td>{it.status}</td>
                <td>{it.createdAt}</td>
                <td>{it.updatedAt}</td>
                <td>{it.publishedAt}</td>
              </>
            ) : null}
          </tr>
        );
      })}
    </tbody>
  </table>
);
