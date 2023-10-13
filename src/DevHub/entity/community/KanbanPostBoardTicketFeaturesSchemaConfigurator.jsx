const KanbanPostBoardTicketFeaturesSchema = {
  author: { label: "Author" },
  like_count: { label: "Likes" },
  reply_count: { label: "Replies", noop: true },

  sponsorship_request_indicator: {
    label: "Sponsorship request indicator",
    noop: true,
  },

  requested_grant_value: { label: "Requested grant value", noop: true },
  requested_sponsor: { label: "Requested sponsor", noop: true },
  approved_grant_value: { label: "Approved amount" },
  sponsorship_supervisor: { label: "Supervisor" },
  tags: { label: "Tags" },
  type: { label: "Post type" },
};

const { data, onSubmit, nearDevGovGigsWidgetsAccountId } = props;

return (
  <Widget
    src={`${nearDevGovGigsWidgetsAccountId}/widget/DevHub.components.organism.Configurator`}
    props={{
      externalState: data,
      schema: KanbanPostBoardTicketFeaturesSchema,
      onSubmit: onSubmit,
      nearDevGovGigsWidgetsAccountId,
    }}
  />
);
