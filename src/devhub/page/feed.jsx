const { author, recency, tag } = props;

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!href) {
  return <p>Loading modules...</p>;
}

const FeedPage = ({ recency, tag }) => {
  return (
    <div className="w-100">
      <Widget src={`${REPL_DEVHUB}/widget/devhub.components.island.banner`} />
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.feature.post-search.panel"}
        props={{
          hideHeader: false,
          children: (
            <Widget
              src={
                "${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"
              }
              props={{
                title: "Post",
                href: href({
                  widgetSrc: "${REPL_DEVHUB}/widget/app",
                  params: { page: "create" },
                }),
              }}
            />
          ),
          recency,
          tag,
          author,
          transactionHashes: props.transactionHashes,
        }}
      />
    </div>
  );
};

return FeedPage(props);
