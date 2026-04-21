import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { err: null };

  static getDerivedStateFromError(err) {
    return { err };
  }

  componentDidCatch(err, info) {
    if (typeof console !== 'undefined') console.error('[ErrorBoundary]', err, info?.componentStack);
  }

  reset = () => {
    this.setState({ err: null });
    if (typeof window !== 'undefined') window.location.reload();
  };

  render() {
    if (!this.state.err) return this.props.children;

    const lang = (typeof navigator !== 'undefined' && /^ru/i.test(navigator.language)) ? 'ru' : 'en';
    const t = lang === 'ru'
      ? { title: 'Что-то пошло не так', sub: 'Приложение не смогло отрендерить. Попробуйте перезагрузить страницу.', btn: 'Перезагрузить', sec: 'Если не помогло — очистите кэш (Ctrl+Shift+R)' }
      : { title: 'Something went wrong', sub: 'The app failed to render. Try reloading the page.', btn: 'Reload', sec: 'If this persists, hard-refresh (Ctrl+Shift+R)' };

    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0806',
        color: '#ece3ce',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 480 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#a09584', marginBottom: 24 }}>
            AIAgent-Hub
          </div>
          <h1 style={{
            fontFamily: "'Fraunces','Times New Roman',serif",
            fontSize: 40,
            fontWeight: 600,
            margin: '0 0 16px',
            lineHeight: 1.1,
            color: '#ece3ce',
          }}>
            {t.title}
          </h1>
          <p style={{
            fontFamily: "'Instrument Serif','Georgia',serif",
            fontSize: 18,
            lineHeight: 1.5,
            margin: '0 0 32px',
            color: '#b3a794',
          }}>
            {t.sub}
          </p>
          <button onClick={this.reset} style={{
            padding: '10px 28px',
            fontSize: 11,
            letterSpacing: 3,
            textTransform: 'uppercase',
            fontWeight: 700,
            fontFamily: "'JetBrains Mono',monospace",
            color: '#0a0806',
            background: '#e86a2a',
            border: '1px solid #e86a2a',
            borderRadius: 0,
            cursor: 'pointer',
            outline: 'none',
          }}>
            {t.btn}
          </button>
          <div style={{ fontSize: 10, color: '#8a816d', marginTop: 24, letterSpacing: 1 }}>
            {t.sec}
          </div>
          {this.state.err?.message && (
            <details style={{ marginTop: 32, fontSize: 10, color: '#8a816d', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer' }}>Error details</summary>
              <pre style={{ marginTop: 8, padding: 12, background: '#15110b', border: '1px solid #221d15', overflow: 'auto', fontSize: 10 }}>
                {String(this.state.err.message || this.state.err)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}
