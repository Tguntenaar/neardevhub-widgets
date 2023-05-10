/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

function widget(widgetName, widgetProps, key) {
  widgetProps = {
    ...widgetProps,
    nearDevGovGigsContractAccountId: props.nearDevGovGigsContractAccountId,
    nearDevGovGigsWidgetsAccountId: props.nearDevGovGigsWidgetsAccountId,
    referral: props.referral,
  };

  return (
    <Widget
      src={`${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.${widgetName}`}
      props={widgetProps}
      key={key}
    />
  );
}

function href(widgetName, linkProps) {
  linkProps = { ...linkProps };

  if (props.nearDevGovGigsContractAccountId) {
    linkProps.nearDevGovGigsContractAccountId =
      props.nearDevGovGigsContractAccountId;
  }

  if (props.nearDevGovGigsWidgetsAccountId) {
    linkProps.nearDevGovGigsWidgetsAccountId =
      props.nearDevGovGigsWidgetsAccountId;
  }

  if (props.referral) {
    linkProps.referral = props.referral;
  }

  const linkPropsQuery = Object.entries(linkProps)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */

const GithubRepoBoard = ({
  boardId,
  contentTypes,
  columns,
  linkedPage,
  name,
  repoURL,
}) => {
  State.init({
    ticketByColumn: columns.reduce(
      (registry, { title }) => ({ ...registry, [title]: [] }),
      {}
    ),
  });

  if (repoURL) {
    if (contentTypes.PullRequest) {
      const pullRequests =
        fetch(
          `https://api.github.com/repos/${repoURL
            .split("/")
            .slice(-2)
            .join("/")}/pulls`
        ).body ?? [];

      const pullRequestByLabel = pullRequests.reduce((registry, item) => {
        const itemWithType = { ...item, type: "PullRequest" };

        return { ...registry, [item.labels[0].name]: [itemWithType] };
      }, {});

      console.log(pullRequestByLabel);

      State.update(({ ticketByColumn }) => ({
        ticketByColumn: Object.keys(ticketByColumn).reduce(
          (registry, columnTitle) => ({
            ...registry,

            [columnTitle]: [
              ...registry.columnTitle,

              ...pullRequests.filter((pullRequest) =>
                pullRequest.labels.some((label) =>
                  columns[columnTitle].labelFilters.some(label.includes)
                )
              ),
            ],
          }),

          ticketByColumn
        ),
      }));

      console.log(state.ticketByColumn);
    }

    if (contentTypes.Issue) {
      const issues =
        fetch(
          `https://api.github.com/repos/${repoURL
            .split("/")
            .slice(-2)
            .join("/")}/issues`
        ).body ?? [];

      console.log(response.body);

      const issuesByLabel = issues.reduce((registry, issue) => {
        const itemWithType = { ...item, type: "Issue" };

        return { ...registry, [issue.labels[0]]: [itemWithType] };
      }, {});

      console.log(issuesByLabel);

      State.update(({ ticketByColumn }) => ({ ticketByColumn: issuesByLabel }));
    }
  }

  return (
    <div>
      <div class="row mb-2">
        {boardId ? (
          <div class="col">
            <small class="text-muted">
              <a
                class="card-link"
                href={href(linkedPage, { boardId })}
                rel="noreferrer"
                role="button"
                target="_blank"
                title="Link to this board"
              >
                <span class="hstack gap-3">
                  <i class="bi bi-share" />
                  <span>Link to this board</span>
                </span>
              </a>
            </small>
          </div>
        ) : null}
      </div>

      <div class="row">
        {columns.map((column) => (
          <div class="col-3" key={column.title}>
            <div class="card">
              <div class="card-body border-secondary">
                <h6 class="card-title">
                  {label} ({items.length})
                </h6>

                {state.ticketByColumn[column.title].map((data) =>
                  widget("entities.GithubRepo.TicketCard", { data }, data.id)
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

return GithubRepoBoard(props);