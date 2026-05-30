
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, CalendarDays, FileText, BarChart3, Target, User, Bell, CheckCircle2, Clock, ShieldCheck, GraduationCap, Plus, UploadCloud } from 'lucide-react';
import './styles.css';
import logo from './assets/rjp-study-logo.png';

const initialStudents = [
  { id: 1, nome: 'Aluno 01', ano: 'Ano letivo', perfil: 'Aluno', progresso: 62 },
  { id: 2, nome: 'Aluno 02', ano: 'Ano letivo', perfil: 'Aluno', progresso: 48 }
];

const initialSubjects = [
  { aluno: 'Aluno 01', disciplina: 'Matemática', prioridade: 'Alta', dificuldade: 5, horasBase: 2 },
  { aluno: 'Aluno 01', disciplina: 'Português', prioridade: 'Média', dificuldade: 3, horasBase: 1 },
  { aluno: 'Aluno 02', disciplina: 'Ciências', prioridade: 'Alta', dificuldade: 4, horasBase: 1.5 },
  { aluno: 'Aluno 02', disciplina: 'Inglês', prioridade: 'Média', dificuldade: 3, horasBase: 1 }
];

const initialEvents = [
  { aluno: 'Aluno 01', disciplina: 'Matemática', tipo: 'Teste', data: '2026-06-12', matriz: 'Funções; Equações; Geometria', notaAnterior: 68 },
  { aluno: 'Aluno 02', disciplina: 'Ciências', tipo: 'Questão-aula', data: '2026-06-07', matriz: 'Energia; Sistema solar', notaAnterior: 74 }
];

const docs = [
  { aluno: 'Aluno 01', disciplina: 'Matemática', tipo: 'Matriz', nome: 'Matriz Matemática', origem: 'Google Drive', link: '#' },
  { aluno: 'Aluno 02', disciplina: 'Ciências', tipo: 'Ficha', nome: 'Ficha de Revisão', origem: 'Google Drive', link: '#' }
];

function daysUntil(dateString){
  const today = new Date();
  const target = new Date(dateString + 'T12:00:00');
  const diff = Math.ceil((target - today) / (1000*60*60*24));
  return Math.max(diff, 0);
}

function generateStudyPlan(event){
  const dias = Math.max(daysUntil(event.data), 1);
  const topics = event.matriz.split(';').map(t=>t.trim()).filter(Boolean);
  const notaFactor = Number(event.notaAnterior || 70) < 70 ? 1.35 : 1;
  const urgencia = dias <= 3 ? 1.5 : dias <= 7 ? 1.25 : 1;
  const totalMin = Math.ceil((topics.length * 35 * notaFactor * urgencia) / 5) * 5;
  const sessions = topics.map((topic, idx)=>({
    dia: idx === 0 ? 'Hoje' : `Sessão ${idx+1}`,
    topico: topic,
    minutos: Math.max(25, Math.ceil(totalMin / topics.length / 5)*5)
  }));
  return { totalMin, sessions };
}

function App(){
  const [page,setPage] = useState('dashboard');
  const [events,setEvents] = useState(initialEvents);
  const [activeEvent,setActiveEvent] = useState(initialEvents[0]);

  const plan = useMemo(()=>generateStudyPlan(activeEvent),[activeEvent]);

  function addDemoEvent(){
    setEvents([...events, { aluno:'Aluno 01', disciplina:'História', tipo:'Teste', data:'2026-06-18', matriz:'Romanização; Idade Média; Fontes históricas', notaAnterior:72 }]);
  }

  const nav = [
    ['dashboard','Início',BookOpen],
    ['alunos','Alunos',User],
    ['disciplinas','Disciplinas',GraduationCap],
    ['avaliacoes','Avaliações',FileText],
    ['documentos','Documentos',UploadCloud],
    ['plano','Plano',Target],
    ['calendario','Calendário',CalendarDays],
    ['admin','Admin',ShieldCheck]
  ];

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand">
        <img src={logo} alt="RJP Study" />
        <div><h1>RJP Study</h1><span>Organiza · Planeia · Alcança</span></div>
      </div>
      <nav>
        {nav.map(([id,label,Icon])=><button key={id} onClick={()=>setPage(id)} className={page===id?'active':''}><Icon size={18}/>{label}</button>)}
      </nav>
      <div className="sideCard">
        <Bell size={18}/>
        <p><b>Google pronto</b><br/>Drive, Calendar e Sheets preparados para ligação OAuth.</p>
      </div>
    </aside>

    <main>
      <header className="topbar">
        <div>
          <p className="eyebrow">Ambiente de Estudo</p>
          <h2>{nav.find(n=>n[0]===page)?.[1] || 'Dashboard'}</h2>
        </div>
        <button className="primary" onClick={addDemoEvent}><Plus size={18}/>Adicionar exemplo</button>
      </header>

      {page==='dashboard' && <section className="grid">
        <div className="hero">
          <div>
            <h3>Próxima avaliação</h3>
            <h2>{activeEvent.disciplina}</h2>
            <p>{activeEvent.tipo} · {new Date(activeEvent.data).toLocaleDateString('pt-PT')} · faltam {daysUntil(activeEvent.data)} dias</p>
          </div>
          <CalendarDays size={46}/>
        </div>
        <div className="card">
          <h3>Plano sugerido</h3>
          <p className="big">{Math.round(plan.totalMin/60*10)/10} h</p>
          <span className="badge">gerado por calendário e matriz</span>
        </div>
        <div className="card">
          <h3>Documentos Drive</h3>
          <p className="big">{docs.length}</p>
          <span className="badge">PDF / Excel / Matrizes</span>
        </div>
        <div className="card wide">
          <h3>O que estudar hoje</h3>
          <div className="tasks">{plan.sessions.slice(0,3).map((s,i)=><div className="task" key={i}><CheckCircle2/><span>{s.topico}</span><b>{s.minutos} min</b></div>)}</div>
        </div>
      </section>}

      {page==='alunos' && <section className="grid">{initialStudents.map(s=><div className="card" key={s.id}><h3>{s.nome}</h3><p>{s.ano}</p><div className="progress"><i style={{width:s.progresso+'%'}}></i></div><span className="badge">{s.progresso}% plano concluído</span></div>)}</section>}

      {page==='disciplinas' && <section className="grid">{initialSubjects.map((s,i)=><div className="card" key={i}><h3>{s.disciplina}</h3><p>{s.aluno}</p><span className="badge">Prioridade {s.prioridade}</span><p>Dificuldade: {s.dificuldade}/5 · Base: {s.horasBase}h/semana</p></div>)}</section>}

      {page==='avaliacoes' && <section className="panel">
        <h3>Testes, exames e questões-aula</h3>
        {events.map((e,i)=><button className="row" key={i} onClick={()=>setActiveEvent(e)}>
          <FileText/><span><b>{e.tipo} — {e.disciplina}</b><small>{e.aluno} · {new Date(e.data).toLocaleDateString('pt-PT')} · {e.matriz}</small></span><b>{daysUntil(e.data)} dias</b>
        </button>)}
      </section>}

      {page==='documentos' && <section className="panel">
        <h3>Documentos ligados ao Google Drive</h3>
        {docs.map((d,i)=><div className="row static" key={i}><UploadCloud/><span><b>{d.nome}</b><small>{d.aluno} · {d.disciplina} · {d.tipo}</small></span><a href={d.link}>Abrir</a></div>)}
      </section>}

      {page==='plano' && <section className="panel">
        <h3>Plano inteligente por disciplina</h3>
        <p className="muted">Baseado na data da avaliação, matriz, nota anterior e urgência.</p>
        <div className="studyPlan">{plan.sessions.map((s,i)=><div className="session" key={i}><Clock/><div><b>{s.dia}</b><p>{activeEvent.disciplina} — {s.topico}</p></div><strong>{s.minutos} min</strong></div>)}</div>
      </section>}

      {page==='calendario' && <section className="panel">
        <h3>Calendário</h3>
        <p className="muted">Na fase Google, estes cartões criam eventos no Google Calendar.</p>
        {events.map((e,i)=><div className="row static" key={i}><CalendarDays/><span><b>{e.tipo}: {e.disciplina}</b><small>{e.aluno} · {new Date(e.data).toLocaleDateString('pt-PT')}</small></span><span className="badge">Criar evento</span></div>)}
      </section>}

      {page==='admin' && <section className="grid">
        <div className="card"><h3>Login Google</h3><p>Preparado para Google Identity Services.</p><span className="badge">OAuth</span></div>
        <div className="card"><h3>Drive</h3><p>Pastas por aluno, disciplina e tipo de documento.</p><span className="badge">API Drive</span></div>
        <div className="card"><h3>Calendar</h3><p>Eventos de testes, exames e sessões de estudo.</p><span className="badge">API Calendar</span></div>
        <div className="card"><h3>Sheets</h3><p>Base de dados inicial para notas e avaliações.</p><span className="badge">API Sheets</span></div>
      </section>}
    </main>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
}
