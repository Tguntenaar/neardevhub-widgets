/* INCLUDE: "common.jsx" */
const nearDevGovGigsContractAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const nearDevGovGigsWidgetsAccountId =
  props.nearDevGovGigsWidgetsAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

/**
 * Reads a board config from DevHub contract storage.
 * Currently a mock.
 *
 * Boards are indexed by their ids.
 */
const boardConfigByBoardId = ({ boardId }) => {
  return {
    probablyUUIDv4: {
      id: "probablyUUIDv4",

      columns: [
        { title: "Draft", labelFilters: ["S-draft"] },
        { title: "Review", labelFilters: ["S-review"] },
      ],

      dataTypes: { Issue: true, PullRequest: true },
      description: "Latest NEAR Enhancement Proposals by status",
      repoURL: "https://github.com/near/NEPs",
      title: "NEAR Protocol NEPs",
    },
  }[boardId];
};

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
    .map(([key, value]) => (value === null ? null : `${key}=${value}`))
    .filter((nullable) => nullable !== null)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;

const FormCheckLabel = styled.label`
  white-space: nowrap;
`;
/* END_INCLUDE: "common.jsx" */

const Banner = styled.div`
   {
    height: 62px;
    background: #181818;
    margin-top: -24px;
    padding: 16px 20px;

    img {
      height: 30px;
    }

    margin-bottom: 25px;
  }
`;

return (
  <>
    <Banner className="d-flex justify-content-between">
      <a href={href("Feed")}>
        <img src="https://ipfs.near.social/ipfs/bafkreibjsn3gswlcc5mvgkfv7ady2lzkd2htm55l472suarbd34qryh2uy"></img>
      </a>
      <div>
        <a
          href="https://www.neardevgov.org/blog/near-developer-dao"
          class="text-white me-2"
        >
          Developer DAO
        </a>

        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-outline-light rounded-circle"
            style={{
              width: "30px",
              height: "30px",
              padding: "6px 0px",
              borderWidth: "0.5px",
              lineHeight: "0px",
            }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-question-lg"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a
                target="_blank"
                class="dropdown-item"
                href="https://github.com/near/devgigsboard-widgets/issues/new?assignees=&labels=bug&template=bug_report.md&title="
              >
                Report a bug
              </a>
            </li>
            <li>
              <a
                target="_blank"
                class="dropdown-item"
                href="https://github.com/near/devgigsboard-widgets/issues/new?assignees=&labels=enhancement&template=feature-request.md&title="
              >
                Suggest an improvement
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Banner>
  </>
);
