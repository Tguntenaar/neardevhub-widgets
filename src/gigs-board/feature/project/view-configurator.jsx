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
    .filter(([_key, nullable]) => (nullable ?? null) !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `/#/${nearDevGovGigsWidgetsAccountId}/widget/gigs-board.pages.${widgetName}${
    linkPropsQuery ? "?" : ""
  }${linkPropsQuery}`;
}
/* END_INCLUDE: "common.jsx" */
/* INCLUDE: "core/lib/gui/form" */
const defaultFieldUpdate = ({
  input,
  lastKnownValue,
  params: { arrayDelimiter },
}) => {
  switch (typeof input) {
    case "boolean":
      return input;

    case "object":
      return Array.isArray(input) && typeof lastKnownValue === "string"
        ? input.join(arrayDelimiter ?? ",")
        : input;

    case "string":
      return Array.isArray(lastKnownValue)
        ? input.split(arrayDelimiter ?? ",").map((string) => string.trim())
        : input;

    default: {
      if ((input ?? null) === null) {
        switch (typeof lastKnownValue) {
          case "boolean":
            return !lastKnownValue;

          default:
            return lastKnownValue;
        }
      } else return input;
    }
  }
};

const useForm = ({ initialValues, stateKey: formStateKey, uninitialized }) => {
  const initialFormState = {
    hasUnsubmittedChanges: false,
    values: initialValues ?? {},
  };

  const formState = state[formStateKey] ?? null,
    isSynced = Struct.isEqual(formState?.values ?? {}, initialFormState.values);

  const formReset = () =>
    State.update((lastKnownComponentState) => ({
      ...lastKnownComponentState,
      [formStateKey]: initialFormState,
      hasUnsubmittedChanges: false,
    }));

  const formUpdate =
    ({ path, via: customFieldUpdate, ...params }) =>
    (fieldInput) => {
      const updatedValues = Struct.deepFieldUpdate(
        formState?.values ?? {},

        {
          input: fieldInput?.target?.value ?? fieldInput,
          params,
          path,

          via:
            typeof customFieldUpdate === "function"
              ? customFieldUpdate
              : defaultFieldUpdate,
        }
      );

      State.update((lastKnownComponentState) => ({
        ...lastKnownComponentState,

        [formStateKey]: {
          hasUnsubmittedChanges: !Struct.isEqual(
            updatedValues,
            initialFormState.values
          ),

          values: updatedValues,
        },
      }));
    };

  if (
    !uninitialized &&
    (formState === null ||
      (Object.keys(formState?.values ?? {}).length > 0 &&
        !formState.hasUnsubmittedChanges &&
        !isSynced))
  ) {
    formReset();
  }

  return {
    ...(formState ?? initialFormState),
    isSynced,
    reset: formReset,
    update: formUpdate,
  };
};
/* END_INCLUDE: "core/lib/gui/form" */
/* INCLUDE: "core/lib/gui/attractable" */
const AttractableDiv = styled.div`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableLink = styled.a`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;

const AttractableImage = styled.img`
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  transition: box-shadow 0.6s;

  &:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
`;
/* END_INCLUDE: "core/lib/gui/attractable" */
/* INCLUDE: "core/lib/uuid" */
const uuid = () =>
  [Date.now().toString(16)]
    .concat(
      Array.from(
        { length: 4 },
        () => Math.floor(Math.random() * 0xffffffff) & 0xffffffff
      ).map((value) => value.toString(16))
    )
    .join("-");

const withUUIDIndex = (data) => {
  const id = uuid();

  return Object.fromEntries([[id, { ...data, id }]]);
};
/* END_INCLUDE: "core/lib/uuid" */
/* INCLUDE: "core/lib/struct" */
const Struct = {
  deepFieldUpdate: (
    node,
    { input, params, path: [nextNodeKey, ...remainingPath], via: toFieldValue }
  ) => ({
    ...node,

    [nextNodeKey]:
      remainingPath.length > 0
        ? Struct.deepFieldUpdate(
            Struct.typeMatch(node[nextNodeKey]) ||
              Array.isArray(node[nextNodeKey])
              ? node[nextNodeKey]
              : {
                  ...((node[nextNodeKey] ?? null) !== null
                    ? { __archivedLeaf__: node[nextNodeKey] }
                    : {}),
                },

            { input, path: remainingPath, via: toFieldValue }
          )
        : toFieldValue({
            input,
            lastKnownValue: node[nextNodeKey],
            params,
          }),
  }),

  isEqual: (input1, input2) =>
    Struct.typeMatch(input1) && Struct.typeMatch(input2)
      ? JSON.stringify(Struct.toOrdered(input1)) ===
        JSON.stringify(Struct.toOrdered(input2))
      : false,

  toOrdered: (input) =>
    Object.keys(input)
      .sort()
      .reduce((output, key) => ({ ...output, [key]: input[key] }), {}),

  pick: (object, subsetKeys) =>
    Object.fromEntries(
      Object.entries(object ?? {}).filter(([key, _]) =>
        subsetKeys.includes(key)
      )
    ),

  typeMatch: (input) =>
    input !== null && typeof input === "object" && !Array.isArray(input),
};
/* END_INCLUDE: "core/lib/struct" */
/* INCLUDE: "core/adapter/dev-hub" */
const devHubAccountId =
  props.nearDevGovGigsContractAccountId ||
  (context.widgetSrc ?? "devgovgigs.near").split("/", 1)[0];

const DevHub = {
  edit_community_github: ({ handle, github }) =>
    Near.call(devHubAccountId, "edit_community_github", { handle, github }) ??
    null,

  create_project: ({ tag, name, description }) =>
    Near.call(devHubAccountId, "create_project", { tag, name, description }) ??
    null,

  create_project_view: ({ config }) =>
    Near.call(devHubAccountId, "create_project_view", { config }) ?? null,

  edit_project_view: ({ config }) =>
    Near.call(devHubAccountId, "create_project_view", { config }) ?? null,

  get_access_control_info: () =>
    Near.view(devHubAccountId, "get_access_control_info") ?? null,

  get_all_authors: () => Near.view(devHubAccountId, "get_all_authors") ?? null,

  get_all_communities: () =>
    Near.view(devHubAccountId, "get_all_communities") ?? null,

  get_all_labels: () => Near.view(devHubAccountId, "get_all_labels") ?? null,

  get_community: ({ handle }) =>
    Near.view(devHubAccountId, "get_community", { handle }) ?? null,

  get_post: ({ post_id }) =>
    Near.view(devHubAccountId, "get_post", { post_id }) ?? null,

  get_posts_by_author: ({ author }) =>
    Near.view(devHubAccountId, "get_posts_by_author", { author }) ?? null,

  get_posts_by_label: ({ label }) =>
    Near.view(nearDevGovGigsContractAccountId, "get_posts_by_label", {
      label,
    }) ?? null,

  get_root_members: () =>
    Near.view(devHubAccountId, "get_root_members") ?? null,

  useQuery: ({ name, params }) => {
    const initialState = { data: null, error: null, isLoading: true };

    const cacheState = useCache(
      () =>
        Near.asyncView(devHubAccountId, ["get", name].join("_"), params ?? {})
          .then((response) => ({
            ...initialState,
            data: response ?? null,
            isLoading: false,
          }))
          .catch((error) => ({
            ...initialState,
            error: props?.error ?? error,
            isLoading: false,
          })),

      JSON.stringify({ name, params }),
      { subscribe: true }
    );

    return cacheState === null ? initialState : cacheState;
  },
};
/* END_INCLUDE: "core/adapter/dev-hub" */
/* INCLUDE: "entity/viewer" */
const access_control_info = DevHub.useQuery({
  name: "access_control_info",
});

const Viewer = {
  can: {
    editCommunity: (communityData) =>
      Struct.typeMatch(communityData) &&
      (communityData.admins.includes(context.accountId) ||
        Viewer.role.isDevHubModerator),
  },

  projectPermissions: (projectId) =>
    Near.view(devHubAccountId, "check_project_permissions", {
      id: projectId,
    }) ?? { can_configure: false },

  role: {
    isDevHubModerator:
      access_control_info.data === null || access_control_info.isLoading
        ? false
        : access_control_info.data.members_list[
            "team:moderators"
          ]?.children?.includes?.(context.accountId) ?? false,
  },
};
/* END_INCLUDE: "entity/viewer" */

const EditorSettings = {
  maxColumnsNumber: 20,
};

const CompactContainer = styled.div`
  width: fit-content !important;
  max-width: 100%;
`;

const ViewConfigDefaults = {
  id: null,
  type: "kanban-view",
  name: "Untitled view",
  tags: { excluded: [], required: [] },
  columns: [],
};

const ProjectViewConfigurator = ({ config, permissions, link, projectId }) => {
  State.init({
    editingMode: "form",
    isEditorActive: false,
  });

  const form = useForm({
    initialValues: config ?? ViewConfigDefaults,
    stateKey: "board",
  });

  const errors = {
    noProjectId: typeof projectId !== "string",
  };

  const isNewView = form.values.id === null;

  const editorToggle = (forcedState) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      isEditorActive: forcedState ?? !lastKnownState.isEditorActive,
    }));

  const editingModeSwitch = ({ target: { value } }) =>
    State.update((lastKnownState) => ({
      ...lastKnownState,
      editingMode: value,
    }));

  const columnsCreateNew = ({ lastKnownValue }) =>
    Object.keys(lastKnownValue).length < EditorSettings.maxColumnsNumber
      ? [...lastKnownValue, { id: uuid(), tag: "", title: "New column" }]
      : lastKnownValue;

  const columnsDeleteById =
    (targetId) =>
    ({ lastKnownValue }) =>
      lastKnownValue.filter(({ id }) => targetId !== id);

  const onSubmit = () =>
    DevHub.edit_project_view({
      handle: communityHandle,

      github: JSON.stringify({
        kanbanBoards: {
          ...boards,
          [form.values.id]: form.values,
        },
      }),
    });

  const formElement =
    Object.keys(form.values).length > 0 ? (
      <>
        <div className="d-flex gap-3 flex-column flex-lg-row">
          {widget(
            "components.molecule.text-input",
            {
              className: "flex-shrink-0",
              key: `${form.values.id}-title`,
              label: "Name",
              onChange: form.update({ path: ["name"] }),
              placeholder: "NEAR Protocol NEPs",
              value: form.values.title,
            },
            `${form.values.id}-title`
          )}
        </div>

        <div className="d-flex gap-3 flex-column flex-lg-row">
          {widget(
            "components.molecule.text-input",
            {
              className: "flex-shrink-0",
              key: `${form.values.id}-title`,
              label: "Tag",
              onChange: form.update({ path: ["tag"] }),
              placeholder: "near-protocol-neps",
              value: form.values.title,
            },
            `${form.values.id}-title`
          )}
        </div>

        <div className="d-flex align-items-center justify-content-between">
          <span className="d-inline-flex gap-2 m-0">
            <i className="bi bi-list-task" />
            <span>Columns ( max. {EditorSettings.maxColumnsNumber} )</span>
          </span>
        </div>

        <div className="d-flex flex-column align-items-center gap-3">
          {form.values.columns.map(
            ({ id, description, tag, title }, columnIdx) => (
              <div
                className="d-flex gap-3 border border-secondary rounded-4 p-3 w-100"
                key={id}
              >
                <div className="d-flex flex-column gap-1 w-100">
                  {widget("components.molecule.text-input", {
                    className: "flex-grow-1",
                    key: `column-${id}-title`,
                    label: "Title",
                    onChange: form.update({
                      path: ["columns", columnIdx, "title"],
                    }),
                    placeholder: "👀 Review",
                    value: title,
                  })}

                  {widget("components.molecule.text-input", {
                    className: "flex-grow-1",
                    key: `column-${id}-description`,
                    label: "Description",

                    onChange: form.update({
                      path: ["columns", columnIdx, "description"],
                    }),

                    placeholder:
                      "NEPs that need a review by Subject Matter Experts.",

                    value: description,
                  })}

                  {widget("components.molecule.text-input", {
                    format: "comma-separated",
                    key: `${form.values.id}-column-${title}-tag`,

                    label: `Search terms for all the labels
											MUST be presented in included tickets`,

                    onChange: form.update({
                      path: ["columns", columnIdx, "tag"],
                    }),

                    placeholder: "WG-, draft, review, proposal, ...",
                    value: tag.join(", "),
                  })}
                </div>

                <div
                  className="d-flex flex-column gap-3 border-start p-3 pe-0"
                  style={{ marginTop: -16, marginBottom: -16 }}
                >
                  <button
                    className="btn btn-outline-danger shadow"
                    onClick={form.update({
                      path: ["columns"],
                      via: columnsDeleteById(id),
                    })}
                    title="Delete column"
                  >
                    <i className="bi bi-trash-fill" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </>
    ) : null;

  return errors.noProjectId ? (
    <div class="alert alert-danger" role="alert">
      Error: project id not found in editor props.
    </div>
  ) : (
    <div className="d-flex flex-column gap-4">
      {state.isEditorActive && Object.keys(form.values).length > 0 ? (
        <AttractableDiv className="d-flex flex-column gap-3 p-3 w-100 rounded-4">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <h5 className="h5 d-inline-flex gap-2 m-0">
              <i className="bi bi-wrench-adjustable-circle-fill" />
              <span>View configuration</span>
            </h5>

            {widget("components.molecule.button-switch", {
              currentValue: state.editingMode,
              key: "editingMode",
              onChange: editingModeSwitch,

              options: [
                { label: "Form", value: "form" },
                { label: "JSON", value: "JSON" },
              ],

              title: "Editing mode selection",
            })}
          </div>

          {state.editingMode === "form" ? (
            formElement
          ) : (
            <div className="d-flex flex-column flex-grow-1 border-0 bg-transparent w-100">
              <textarea
                className="form-control"
                disabled
                rows="12"
                type="text"
                value={JSON.stringify(form.values ?? {}, null, "\t")}
              />
            </div>
          )}

          <div className="d-flex align-items-center justify-content-end gap-3">
            <button
              className="btn shadow btn-outline-secondary d-inline-flex gap-2 me-auto"
              disabled={
                Object.keys(form.values.columns).length >=
                EditorSettings.maxColumnsNumber
              }
              onClick={form.update({
                path: ["columns"],
                via: columnsCreateNew,
              })}
            >
              <i className="bi bi-plus-lg" />
              <span>New column</span>
            </button>

            <button
              className="btn btn-outline-danger border-0 d-inline-flex gap-2 align-items-center"
              onClick={() => editorToggle(false)}
              style={{ width: "fit-content" }}
            >
              <span>Cancel</span>
            </button>

            <button
              disabled={false}
              className="btn shadow btn-success d-inline-flex gap-2 align-items-center"
              onClick={onSubmit}
              style={{ width: "fit-content" }}
            >
              <i className="bi bi-cloud-arrow-up-fill" />
              <span>Save</span>
            </button>
          </div>
        </AttractableDiv>
      ) : null}

      {widget(["entity.project", form.values.type].join("."), {
        ...form.values,
        editorTrigger: () => editorToggle(true),
        link,
        permissions,
      })}
    </div>
  );
};

return ProjectViewConfigurator(props);