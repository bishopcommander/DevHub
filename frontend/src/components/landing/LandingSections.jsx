import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ClockIcon, GridIcon, MusicIcon, SparkIcon } from '../ui/Icons';

const iconMap = { spark: SparkIcon, clock: ClockIcon, grid: GridIcon, music: MusicIcon };

const LandingSections = ({ data }) => {
  return (
    <>
      <section id="top" className="relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.15),_transparent_40%),radial-gradient(circle_at_15%_70%,_rgba(14,116,144,0.18),_transparent_40%)]" />
        <div className="mx-auto max-w-7xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-cyan-300">Developer Productivity Platform</p>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold text-slate-100 sm:text-6xl">{data.heroHeadline}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">{data.heroSubheading}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/app"><Button className="w-full sm:w-auto">{data.heroCta}</Button></Link>
            <Button variant="ghost" className="w-full sm:w-auto">See Product Tour</Button>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-20 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {data.features.map((feature) => {
          const Icon = iconMap[feature.icon] || SparkIcon;
          return (
            <Card key={feature.title} className="p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40">
              <div className="mb-4 inline-flex rounded-xl bg-slate-800 p-3 text-cyan-300"><Icon /></div>
              <h3 className="mb-2 text-xl font-semibold text-slate-100">{feature.title}</h3>
              <p className="text-sm text-slate-300">{feature.description}</p>
            </Card>
          );
        })}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-cyan-400/20 p-6 sm:p-10">
          <h2 className="text-2xl font-semibold text-slate-100 sm:text-3xl">Product Preview</h2>
          <p className="mt-3 text-slate-300">One workspace for code clarity, focus metrics, and progress rituals.</p>
          <div className="mt-8 grid gap-4 rounded-2xl bg-slate-950/70 p-4 lg:grid-cols-3">
            {data.previewStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-cyan-300">{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="testimonials" className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-20 sm:px-6 lg:grid-cols-3 lg:px-8">
        {data.testimonials.map((item) => (
          <Card key={item.name} className="p-6">
            <p className="text-slate-200">"{item.quote}"</p>
            <p className="mt-5 font-semibold text-cyan-300">{item.name}</p>
            <p className="text-sm text-slate-400">{item.role}</p>
          </Card>
        ))}
      </section>

      <section id="pricing" className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        {data.pricing.map((plan) => (
          <Card key={plan.tier} className="p-7">
            <p className="text-sm uppercase tracking-widest text-slate-400">{plan.tier}</p>
            <p className="mt-2 text-4xl font-black text-slate-100">{plan.price}</p>
            <p className="mt-3 text-slate-300">{plan.description}</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-300">
              {plan.features.map((feature) => <li key={feature}>• {feature}</li>)}
            </ul>
            <Button className="mt-6 w-full">Choose {plan.tier}</Button>
          </Card>
        ))}
      </section>

      <footer className="border-t border-slate-800/80 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 DevHub. Build with focus.</p>
          <div className="flex gap-5">
            <a href="#">Docs</a>
            <a href="#">Privacy</a>
            <a href="#">X</a>
            <a href="#">GitHub</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingSections;
