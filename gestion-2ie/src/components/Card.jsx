import './Card.css';

export default function Card({ title, children, className = '', style = {} }) {
  return (
    <div className={`card ${className}`} style={style}>
      {title && <div className="card-title">{title}</div>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}
