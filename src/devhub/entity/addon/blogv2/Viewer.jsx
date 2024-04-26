const { Card } =
  VM.require("${REPL_DEVHUB}/widget/devhub.entity.addon.blogv2.Card") ||
  (() => <></>);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url") || (() => {});

const { handle, hideTitle, communityAddonId } = props;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const Heading = styled.h3`
  color: #151515;
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: 120%; /* 48px */
  margin-bottom: 2rem;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CardContainer = styled.div`
  transition: all 300ms;
  border-radius: 1rem;
  height: 100%;

  &:hover {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
`;

const blogData =
  Social.get(
    [
      // `${handle}.community.devhub.near/blog/**`,
      "thomasguntenaar.near/blog/**",
    ],
    "final"
  ) || {};

const reshapedData = Object.keys(blogData)
  .map((key) => {
    return {
      ...blogData[key].metadata,
      id: key,
      content: blogData[key][""],
    };
  })
  // Show only published blogs
  .filter((blog) => blog.status === "PUBLISH")
  // Every instance of the blog tab has its own blogs
  .filter((blog) => blog.communityAddonId === communityAddonId)
  // Sort by published date
  .sort((blog1, blog2) => {
    return new Date(blog2.publishedAt) - new Date(blog1.publishedAt);
  });

function BlogCard(flattenedBlog) {
  console.log("BlogCard handle", handle);
  return (
    <Link
      style={{ textDecoration: "none" }}
      to={href({
        widgetSrc: "${REPL_DEVHUB}/widget/app",
        params: { page: "blogv2", id: flattenedBlog.id, community: handle },
      })}
    >
      <CardContainer>
        <Card data={flattenedBlog} />
      </CardContainer>
    </Link>
  );
}
console.log("VIEWER blogdata", blogData);

return (
  <div class="w-100">
    {!hideTitle && <Heading>Latest Blog Posts</Heading>}
    <Grid>
      {(reshapedData || []).map((flattenedBlog) => {
        return BlogCard(flattenedBlog);
      })}
    </Grid>
  </div>
);
