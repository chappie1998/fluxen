export const Toggle = ({ label, toggled, onClick }) => {
  const callback = () => {
    onClick(!toggled);
  };

  return (
    <div className="toggle">
      <label>
        <input type="checkbox" checked={toggled} onChange={callback} />
        <span />
        {label ? <strong>{label}</strong> : <></>}
      </label>
    </div>
  );
};
