import './Spinner.css';

export default function Spinner({ size = 'md', text = '' }) {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
