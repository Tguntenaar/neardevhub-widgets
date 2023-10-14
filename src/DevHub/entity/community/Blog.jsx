// State.init({
//   initial: { author, tag },
//   author,
//   tag,
// });
const { nearDevGovGigsWidgetsAccountId, tab } = props;
// Blog specific parameters
const {
  params: { labels, excludeLabels },
} = tab;

const [author, setAuthor] = useState(props.author || "");
// const [tag, setTag] = useState(props.tag || "");
const [tag, setTag] = useState(labels[0] || "");

// // When rerendered with different props, State will be preserved, so we need to update the state when we detect that the props have changed.
// if (tag !== state.initial.tag || author !== state.initial.author) {
//   State.update((lastKnownState) => ({
//     ...lastKnownState,
//     initial: { author, tag },
//     author,
//     tag,
//   }));
// }

const onTagSearch = (tag) => {
  setTag(tag);
};

const onAuthorSearch = (author) => {
  setAuthor(author);
};

console.log(labels);
console.log("tag", tag);

return (
  <Widget
    src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.entity.post.Panel`}
    props={{
      author: author,
      authorQuery: { author },
      children: (
        <Widget
          src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.molecule.PostControls`}
          props={{ title: "Post", link: "Create" }}
        />
      ),
      onAuthorSearch,
      onTagSearch,
      recency,
      tag: tag,
      tagQuery: { tag },
      transactionHashes: props.transactionHashes,
    }}
  />
);
