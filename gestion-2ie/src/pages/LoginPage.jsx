import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">
            <FontAwesomeIcon icon={faGraduationCap} aria-hidden="true" />
          </div>
          <div className="login-brand-name">Gestion 2IE</div>
          <div className="login-brand-sub">Système de gestion académique</div>
        </div>
        <div className="login-hero">
          <div className="login-hero-tag">Plateforme administrative</div>
          <h1 className="login-hero-title">Pilotez votre établissement avec clarté</h1>
          <p className="login-hero-desc">
            Gérez les étudiants, les inscriptions, les filières et les ressources académiques depuis une interface unifiée.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-box">
          <h2 className="login-form-title">Bon retour</h2>
          <p className="login-form-subtitle">Connectez-vous à votre compte administrateur</p>

          {error && <div className="login-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">Adresse email</label>
              <input
                id="email" type="email" placeholder="admin@2ie.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="login-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password" type="password" placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
