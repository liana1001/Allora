import { StrictMode, useEffect, useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './styles.css';

const queryClient = new QueryClient();

function HealthStatus() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await fetch('http://localhost:4000/api/v1/health');
      if (!response.ok) throw new Error('API unavailable');
      return response.json() as Promise<{ status: string }>;
    },
  });

  return (
    <span className={health.isSuccess ? 'status status-online' : 'status'}>
      {health.isSuccess ? 'API online' : health.isLoading ? 'Checking API' : 'API offline'}
    </span>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <main className={darkMode ? 'app-shell dark-mode' : 'app-shell'}>
      <nav className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-mark">A</span>Allora
        </Link>
        <div className="nav-group">
          <span className="nav-label">Workspace</span>
          <Link className="nav-item active" to="/">
            Overview <span>⌘ 1</span>
          </Link>
          <Link className="nav-item" to="/items/new">
            Quick add <span>⌘ K</span>
          </Link>
          <Link className="nav-item" to="/onboarding">
            Setup <span>⌘ 2</span>
          </Link>
        </div>
        <div className="nav-group modules">
          <span className="nav-label">Modules</span>
          <a className="nav-item" href="#tasks">
            <i className="module-dot dot-coral" />
            Tasks
          </a>
          <a className="nav-item" href="#academics">
            <i className="module-dot dot-blue" />
            Academics
          </a>
          <a className="nav-item" href="#habits">
            <i className="module-dot dot-mint" />
            Habits
          </a>
          <a className="nav-item" href="#money">
            <i className="module-dot dot-gold" />
            Money
          </a>
        </div>
        <div className="sidebar-footer">
          <button className="theme-toggle" type="button" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
          <HealthStatus />
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard darkMode={darkMode} />} />
        <Route path="/items/new" element={<FirstItemForm />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <Link to="/">Overview</Link>
        <Link to="/items/new">Add</Link>
        <Link to="/onboarding">Setup</Link>
      </nav>
    </main>
  );
}

function Dashboard({ darkMode }: { darkMode: boolean }) {
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        window.location.assign('/items/new');
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Thursday, October 9, 2026</p>
          <h1>Good morning, Liana.</h1>
          <p className="intro">A clear day starts with a clear view.</p>
        </div>
        <div className="header-actions">
          <span className="avatar">LS</span>
          <button
            className="icon-button"
            type="button"
            aria-label="Toggle theme"
            onClick={() =>
              document.querySelector('.theme-toggle')?.dispatchEvent(new MouseEvent('click'))
            }
          >
            {darkMode ? '☼' : '◐'}
          </button>
        </div>
      </header>
      <div className="focus-band">
        <div>
          <span className="section-kicker">Today’s focus</span>
          <strong>Build the foundation</strong>
          <p>Complete the first three setup tasks and make space for the week ahead.</p>
        </div>
        <Link className="button" to="/items/new">
          Add an item <span>+</span>
        </Link>
      </div>
      <div className="dashboard-grid">
        <section className="panel task-panel" id="tasks">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Tasks</span>
              <h2>Today</h2>
            </div>
            <span className="count">2 / 5</span>
          </div>
          <div className="progress-track">
            <span style={{ width: '40%' }} />
          </div>
          <Task text="Choose your first module" done />
          <Task text="Create your workspace profile" />
          <Task text="Plan the week ahead" />
        </section>
        <section className="panel progress-panel" id="habits">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Habits</span>
              <h2>Daily rhythm</h2>
            </div>
            <span className="panel-arrow">↗</span>
          </div>
          <div className="habit-score">
            <strong>
              68<span>%</span>
            </strong>
            <p>weekly consistency</p>
          </div>
          <div className="mini-bars">
            <i style={{ height: '42%' }} />
            <i style={{ height: '70%' }} />
            <i style={{ height: '55%' }} />
            <i style={{ height: '82%' }} />
            <i style={{ height: '64%' }} />
            <i style={{ height: '92%' }} />
            <i style={{ height: '74%' }} />
          </div>
        </section>
        <section className="panel deadline-panel" id="academics">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Academics</span>
              <h2>Coming up</h2>
            </div>
            <span className="panel-arrow">↗</span>
          </div>
          <div className="deadline">
            <span className="date-tile">
              <b>18</b>OCT
            </span>
            <div>
              <strong>Database systems</strong>
              <p>Assignment due · 6 days</p>
            </div>
          </div>
          <div className="deadline">
            <span className="date-tile">
              <b>24</b>OCT
            </span>
            <div>
              <strong>Design critique</strong>
              <p>Milestone · 12 days</p>
            </div>
          </div>
        </section>
        <section className="panel money-panel" id="money">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Money</span>
              <h2>This month</h2>
            </div>
            <span className="panel-arrow">↗</span>
          </div>
          <strong className="money-total">
            $1,240<span>.00</span>
          </strong>
          <p className="muted">of $2,000 monthly budget</p>
          <div className="budget-line">
            <span style={{ width: '62%' }} />
          </div>
          <div className="money-footer">
            <span>62% used</span>
            <span>$760 left</span>
          </div>
        </section>
      </div>
    </section>
  );
}

function Onboarding() {
  const [modules, setModules] = useState(['Tasks', 'Academics', 'Habits']);
  const [saved, setSaved] = useState(false);
  const availableModules = ['Tasks', 'Academics', 'Habits', 'Money', 'Research'];

  function toggleModule(module: string) {
    setModules((current) =>
      current.includes(module) ? current.filter((item) => item !== module) : [...current, module],
    );
  }

  return (
    <section className="dashboard form-page">
      <section className="form-card onboarding-card">
        <p className="eyebrow">Workspace setup</p>
        <h1>Make Allora yours.</h1>
        <p className="intro">Choose the areas you want to see, then set the basics for your day.</p>
        <fieldset>
          <legend>Modules</legend>
          <div className="module-options">
            {availableModules.map((module) => (
              <label key={module}>
                <input
                  type="checkbox"
                  checked={modules.includes(module)}
                  onChange={() => toggleModule(module)}
                />
                {module}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="setup-fields">
          <label>
            Time zone
            <select defaultValue="UTC">
              <option>UTC</option>
              <option>Asia/Dhaka</option>
              <option>America/New_York</option>
            </select>
          </label>
          <label>
            Currency
            <select defaultValue="USD">
              <option>USD</option>
              <option>EUR</option>
              <option>BDT</option>
            </select>
          </label>
        </div>
        <button type="button" onClick={() => setSaved(true)}>
          Save workspace
        </button>
        {saved && (
          <p className="success-message" role="status">
            Workspace preferences saved locally.
          </p>
        )}
      </section>
    </section>
  );
}

function Task({ text, done }: { text: string; done?: boolean }) {
  return (
    <div className={done ? 'task done' : 'task'}>
      <span className="check">{done ? '✓' : ''}</span>
      <span>{text}</span>
      <small>{done ? 'Done' : 'Today'}</small>
    </div>
  );
}

function FirstItemForm() {
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(title.trim().length > 0);
  }

  return (
    <section className="dashboard form-page">
      <Link className="back-link" to="/">
        ← Back to overview
      </Link>
      <section className="form-card">
        <p className="eyebrow">First step</p>
        <h1>Add something to your day.</h1>
        <form onSubmit={submit} className="item-form">
          <label htmlFor="item-title">Item title</label>
          <input
            id="item-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <button type="submit">Save item</button>
          {saved && (
            <p role="status">Saved locally. API persistence arrives with the data layer.</p>
          )}
        </form>
      </section>
    </section>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
