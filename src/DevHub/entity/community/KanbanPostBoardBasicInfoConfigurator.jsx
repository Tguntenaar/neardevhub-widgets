const KanbanPostBoardBasicInfoSchema = {
  title: { label: "Title", order: 1, placeholder: "Enter board title." },

  description: {
    label: "Description",
    order: 2,
    placeholder: "Enter board description.",
  },
};

const { data, onSubmit, nearDevGovGigsWidgetsAccountId } = props;

return (
  <Widget
    src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.organism.Configurator`}
    props={{
      externalState: data,
      schema: KanbanPostBoardBasicInfoSchema,
      onSubmit: onSubmit,
      nearDevGovGigsWidgetsAccountId,
    }}
  />
);
