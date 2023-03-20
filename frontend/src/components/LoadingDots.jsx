export const LoadingDots = (props) => {
  const className = `loader ${props.headerFix ? "pt-80" : ""} ${
    props.fullScreen ? "overlay" : ""
  }`;
  return (
    <div className={className}>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
