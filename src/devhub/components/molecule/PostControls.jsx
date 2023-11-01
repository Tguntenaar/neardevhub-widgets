const { className, title, icon, href, onClick } = props;

const buttonStyle = {
  backgroundColor: "#0C7283",
  color: "#f3f3f3",
};

return (
  <div className={`d-flex flex-row-reverse ${className}`}>
    {href ? (
      <Link className="btn btn-light" style={buttonStyle} to={href}>
        <i className={icon ? icon : "bi bi-plus-circle-fill"}></i>
        {title}
      </Link>
    ) : (
      <button className="btn btn-light" style={buttonStyle} onClick={onClick}>
        <i className={icon ? icon : "bi bi-plus-circle-fill"}></i>
        {title || "Post"}
      </button>
    )}
  </div>
);
