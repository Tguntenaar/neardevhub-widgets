const { addon, config, onSubmit, nearDevGovGigsWidgetsAccountId, permissions } =
  props;

const CommunityBoardPage = ({ handle }) => {
  return widget("entity.community.layout", {
    path: [{ label: "Communities", pageId: "communities" }],
    handle,
    title: "Board",

    children: widget("entity.workspace.view.kanban.configurator", {
      communityHandle: handle,
      link: "https://near.org" + href("community.board", { handle }),
      permissions,
    }),
  });
};

return CommunityBoardPage(props);
