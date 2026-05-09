import Spinner from './Spinner';

export default function PageLoader({ text = 'Chargement...' }) {
  return (
    <div className="page-loading-center">
      <Spinner size="lg" text={text} />
    </div>
  );
}
