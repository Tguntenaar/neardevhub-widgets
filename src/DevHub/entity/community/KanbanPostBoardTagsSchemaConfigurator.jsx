const KanbanPostBoardTagsSchema = {
  required: {
    label:
      "Enter tags you want to include. Posts with these tags will display.",

    order: 1,
    placeholder: "tag1, tag2",
  },

  excluded: {
    label:
      "Enter tags you want to exclude. Posts with these tags will not show.",

    order: 2,
    placeholder: "tag3, tag4",
  },
};

const { data, onSubmit, nearDevGovGigsWidgetsAccountId } = props;

return (
  <Widget
    src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.organism.Configurator`}
    props={{
      externalState: data,
      schema: KanbanPostBoardTagsSchema,
      onSubmit: onSubmit,
      nearDevGovGigsWidgetsAccountId,
    }}
  />
);
