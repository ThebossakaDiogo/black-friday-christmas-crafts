import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FestiveCursor } from "@/components/FestiveCursor";
import { CHECKOUT, PRICES, brl, upsellTotal, withAttribution } from "@/lib/offer";

const TITLE = "Black Friday de Natal · +200 Personagens para Colocar o Rosto";
const DESC = "Transforme a família em Papai Noel, duendes e renas. +200 personagens editáveis no Canva, prontos para imprimir. A partir de R$10.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "product" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#141010" },
    ],
    links: [{ rel: "preload", as: "image", href: "/images/hero.webp", fetchPriority: "high" }],
  }),
  component: Index,
});

const GALLERY = [
  ["galeria1.jpg", "Antes e depois: foto virando personagem de Natal"],
  ["galeria2.jpg", "Modelos de personagens para colocar o rosto"],
  ["galeria3.jpg", "Parede decorada com figurinhas personalizadas"],
  ["galeria4.jpg", "Figurinhas impressas e recortadas"],
  ["galeria5.jpg", "Porta decorada com personagens de Natal"],
  ["galeria6.jpg", "Família com os personagens de Natal"],
] as const;

const FEATURES = [
  ["🎨", "Editável no Canva", "Abre direto no Canva grátis, no celular ou no computador."],
  ["🎅", "+200 personagens", "Noéis, duendes, renas, bonecos de neve, anjinhos e quebra-nozes."],
  ["😂", "Fofos e engraçados", "Do duendinho das crianças ao boneco de neve do tio mais sério."],
  ["📸", "É só colocar a foto", "Escolha, encaixe o rosto e ajuste. Pronto em minutos."],
  ["🖨️", "Imprima em casa", "Alta qualidade em A4, adesivo ou papel fotográfico."],
  ["📐", "Qualquer tamanho", "Mini para lembrancinhas, gigante para porta e parede."],
] as const;

const BONUSES = [
  { img: "bonus1.jpg", n: "01", t: "100 Artes de Decoração", d: "Plaquinhas, toppers, bandeirolas e enfeites para a ceia e a casa.", v: 27 },
  { img: "bonus2.jpg", n: "02", t: "10 Brincadeiras para a Noite", d: "Jogos rápidos que fazem crianças e adultos rirem juntos.", v: 19 },
  { img: "bonus3.jpg", n: "03", t: "Bingo de Natal", d: "Cartelas temáticas prontas para a família inteira jogar.", v: 17 },
  { img: "bonus4.jpg", n: "04", t: "Guia Anti-Caos de Natal", d: "Checklists e cronograma para ceia, presentes e decoração.", v: 15 },
];
const VIP = [
  { img: "bonus5.jpg", n: "05", t: "Etiquetas de Presente", d: "Tags e etiquetas \"De / Para\" para deixar cada pacote único.", v: 19 },
  { img: "bonus6.jpg", n: "06", t: "Cartões de Natal com Foto", d: "Cartões e envelopes editáveis com moldura para a foto da família.", v: 24 },
  { img: "bonus7.jpg", n: "07", t: "Props de Foto + Calendário do Advento", d: "Gorros, barbas e chifres para fotos, e um calendário de 24 dias.", v: 27 },
];
const ALL_BONUS = [...BONUSES, ...VIP];
const bonusTotal = ALL_BONUS.reduce((s, b) => s + b.v, 0);

const FAQ = [
  ["Como recebo o kit?", "É 100% digital. Assim que o pagamento é confirmado, o acesso chega no seu e-mail. Nada é enviado pelos Correios."],
  ["Consigo imprimir em casa?", "Sim. Impressora comum com papel A4, adesivo ou fotográfico. Se preferir, leve a uma gráfica ou papelaria."],
  ["Preciso de máquina de corte?", "Não. Uma tesoura resolve. Se tiver plotter, pode usar, mas é opcional."],
  ["Quantas vezes posso imprimir?", "Ilimitadas. Use para a família, escola ou trabalho, e de novo nos próximos Natais."],
  ["Preciso pagar o Canva?", "Não. Funciona no Canva gratuito, pelo app ou navegador. Os modelos já vêm prontos, sem saber editar."],
  ["Como recebo os bônus?", "Os bônus chegam no mesmo acesso enviado por e-mail, junto com os personagens."],
  ["Por quanto tempo terei acesso?", "Para sempre. Você paga uma vez e usa quando quiser."],
] as const;

function useCountdown(seconds: number, active = true) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (!active) return;
    setLeft(seconds);
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds, active]);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return { left, label: `${mm}:${ss}` };
}

function useCheckout() {
  const [search, setSearch] = useState("");
  useEffect(() => setSearch(window.location.search), []);
  return (url: string) => (search ? withAttribution(url, search) : url);
}

function Badge({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "red" | "dark" }) {
  const cls = tone === "gold" ? "bg-gold-grad text-gold-foreground" : tone === "red" ? "bg-red-grad text-primary-foreground" : "bg-secondary text-gold border border-gold/40";
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${cls}`}>{children}</span>;
}

function Index() {
  const [today, setToday] = useState("");
  const clock = useCountdown(15 * 60);
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [stickyOn, setStickyOn] = useState(false);
  const co = useCheckout();

  useEffect(() => {
    setToday(new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long" }));
    const onScroll = () => setStickyOn(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden pb-24 md:pb-0">
      <FestiveCursor />

      {/* Urgency bar */}
      <div className="sticky top-0 z-40 bg-red-grad px-4 py-2 text-center text-sm font-semibold text-primary-foreground">
        🖤 BLACK FRIDAY DE NATAL · só hoje{today && `, ${today}`} · termina em{" "}
        <span className="rounded bg-background/30 px-2 py-0.5 font-mono font-bold">{clock.label}</span>
      </div>

      {/* Hero */}
      <header className="bg-hero px-5 pb-14 pt-10 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap justify-center gap-2">
            <Badge tone="dark">🎅 +200 personagens</Badge>
            <Badge>⚡ até 93% OFF</Badge>
          </div>
          <h1 className="mt-6 font-display text-5xl uppercase leading-[0.95] md:text-7xl">
            Coloque o rosto da família em <span className="text-gold-grad">+200 personagens de Natal</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Filhos, avós, marido e amigos viram Papai Noel, duende ou rena em minutos. É só escolher, colocar a foto no Canva e imprimir.
          </p>
          <div className="mx-auto mt-8 overflow-hidden rounded-2xl border border-gold/30 shadow-gold">
            <img src="/images/hero.webp" alt="Personagens de Natal personalizados com fotos da família" width={1200} height={900} fetchPriority="high" className="w-full" />
          </div>
          <a href="#planos" className="btn-cta animate-pulse-cta mt-8 w-full max-w-md text-lg">Quero meu kit com desconto →</a>
          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span>✅ Acesso imediato</span><span>📱 Funciona no celular</span><span>🎨 Canva grátis</span>
          </div>
        </div>
      </header>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-gold/30 bg-secondary py-3">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap font-display text-xl uppercase text-gold">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Black Friday", "🎄", "Oferta de Natal", "⭐", "Acesso vitalício", "🎁", "7 dias de garantia", "🔔"].map((t, i) => <span key={`${k}-${i}`}>{t}</span>),
          )}
        </div>
      </div>

      {/* What you get */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <Badge tone="dark">O que você recebe</Badge>
          <h2 className="mt-4 font-display text-4xl uppercase md:text-5xl">Veja como fica na prática</h2>
          <p className="mt-3 text-muted-foreground">Deslize para ver os personagens depois de colocar a foto.</p>
          <Carousel />
          <div className="mt-12 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([ic, t, d]) => (
              <div key={t} className="rounded-xl border border-border bg-card p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-grad text-2xl">{ic}</div>
                <h3 className="mt-3 text-lg font-bold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonuses */}
      <section className="bg-secondary/50 px-5 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <Badge>🎁 Exclusivo do Premium</Badge>
          <h2 className="mt-4 font-display text-4xl uppercase md:text-5xl">7 bônus de presente</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Tudo o que você precisa para uma ceia inesquecível, da decoração às brincadeiras.</p>
          <div className="mt-10 grid gap-5 text-left sm:grid-cols-2">
            {BONUSES.map((b) => <BonusCard key={b.n} {...b} />)}
          </div>
          <div className="mt-12 flex items-center justify-center gap-3">
            <span className="h-px flex-1 bg-gold/40" />
            <Badge tone="red">👑 Só no Premium · bônus VIP</Badge>
            <span className="h-px flex-1 bg-gold/40" />
          </div>
          <div className="mt-6 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
            {VIP.map((b) => <BonusCard key={b.n} {...b} vip />)}
          </div>
          <div className="mx-auto mt-10 max-w-md rounded-2xl border-2 border-dashed border-gold/60 bg-card p-6">
            <p className="text-muted-foreground">Valor dos 7 bônus</p>
            <p className="text-2xl text-muted-foreground line-through">{brl(bonusTotal)}</p>
            <p className="font-display text-4xl uppercase text-gold-grad">Hoje: grátis no Premium</p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="scroll-mt-12 px-5 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <Badge tone="red">🖤 Preço de Black Friday</Badge>
          <h2 className="mt-4 font-display text-4xl uppercase md:text-5xl">Escolha seu kit</h2>
          <p className="mt-3 text-muted-foreground">Pagamento único · acesso imediato · garantia de 7 dias</p>

          <div className="mt-10 grid items-start gap-6 text-left md:grid-cols-2">
            {/* Basic */}
            <div className="rounded-2xl border border-border bg-card p-7 md:mt-10">
              <Badge tone="dark">Básico</Badge>
              <h3 className="mt-3 text-2xl font-bold">Kit Personagens</h3>
              <p className="text-sm text-muted-foreground">Só os personagens, sem bônus.</p>
              <p className="mt-5 text-sm text-muted-foreground line-through">de {brl(PRICES.basicFrom)}</p>
              <p className="font-display text-5xl">{brl(PRICES.basic)}</p>
              <p className="text-xs text-muted-foreground">pagamento único</p>
              <ul className="mt-6 space-y-2 text-sm">
                {["+200 personagens editáveis", "Acesso pelo Canva", "Arquivos para imprimir", "Acesso imediato"].map((t) => <li key={t}>✅ {t}</li>)}
                {ALL_BONUS.map((b) => <li key={b.n} className="text-muted-foreground/60 line-through">✖ {b.t}</li>)}
              </ul>
              <button onClick={() => setUpsellOpen(true)} className="mt-7 w-full rounded-full border-2 border-foreground/30 py-4 font-bold uppercase transition hover:border-foreground">Quero o Básico</button>
              <p className="mt-3 text-center text-xs text-muted-foreground">🔒 Compra segura</p>
            </div>

            {/* Premium */}
            <div className="relative rounded-2xl bg-card p-7 shadow-gold">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2"><Badge>⭐ Mais vendido</Badge></div>
              <Badge tone="red">👑 Premium</Badge>
              <h3 className="mt-3 text-2xl font-bold">Kit Completo + 7 bônus</h3>
              <p className="text-sm text-muted-foreground">Todos os personagens + bônus VIP exclusivos.</p>
              <img src="/images/completo.jpg" alt="Tudo o que vem no Kit Premium" loading="lazy" width={800} height={600} className="mt-5 w-full rounded-xl" />
              <p className="mt-5 text-sm text-muted-foreground line-through">de {brl(PRICES.premiumFrom)}</p>
              <div className="flex items-end gap-3">
                <p className="font-display text-6xl text-gold-grad">{brl(PRICES.premium)}</p>
                <span className="mb-2"><Badge tone="red">-74%</Badge></span>
              </div>
              <p className="text-xs text-muted-foreground">pagamento único · economize {brl(PRICES.premiumFrom - PRICES.premium)}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {["+200 personagens editáveis", "Acesso pelo Canva", "Arquivos para imprimir", "Acesso imediato e vitalício"].map((t) => <li key={t}>✅ {t}</li>)}
                {ALL_BONUS.map((b) => (
                  <li key={b.n}>🎁 <b className="text-gold">Bônus {b.n}</b> · {b.t}{Number(b.n) > 4 && <span className="ml-1 rounded bg-primary px-1.5 text-[10px] font-bold uppercase text-primary-foreground">VIP</span>}</li>
                ))}
              </ul>
              <a href={co(CHECKOUT.premium)} className="btn-gold animate-pulse-cta mt-7 w-full text-lg">Quero o Premium →</a>
              <p className="mt-3 text-center text-xs text-muted-foreground">🔒 Compra segura · acesso no e-mail na hora</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="px-5 pb-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-2xl border border-gold/30 bg-card p-8 text-center md:flex-row md:text-left">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gold-grad font-display text-3xl text-gold-foreground">7 DIAS</div>
          <div>
            <h2 className="font-display text-3xl uppercase">Garantia incondicional</h2>
            <p className="mt-2 text-muted-foreground">Não gostou? Peça o reembolso em até 7 dias e receba 100% do valor de volta. Sem perguntas, sem burocracia.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/50 px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center"><Badge tone="dark">Dúvidas</Badge><h2 className="mt-4 font-display text-4xl uppercase">Perguntas frequentes</h2></div>
          <div className="mt-8 space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group rounded-xl border border-border bg-card p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {q}<span className="text-gold transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-hero px-5 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <Badge tone="red">⏰ Última chamada</Badge>
          <h2 className="mt-4 font-display text-4xl uppercase leading-tight md:text-6xl">A ceia mais divertida <span className="text-gold-grad">da sua família</span></h2>
          <p className="mt-4 text-muted-foreground">Escolha o personagem, coloque a foto e imprima. A surpresa que vai fazer todo mundo rir neste Natal.</p>
          <a href="#planos" className="btn-cta animate-pulse-cta mt-8 w-full max-w-md text-lg">Garantir meu kit agora</a>
          <div className="mt-4 flex flex-wrap justify-center gap-x-5 text-sm text-muted-foreground"><span>✓ Acesso imediato</span><span>✓ Canva grátis</span><span>✓ Garantia de 7 dias</span></div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Carinhas de Natal · Produto digital.</p>
        <p className="mx-auto mt-2 max-w-2xl">Este site não é afiliado, endossado ou conectado oficialmente à Meta Platforms, Inc., Facebook ou Instagram. Canva é marca de seus respectivos proprietários.</p>
      </footer>

      {/* Sticky mobile CTA */}
      <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-gold/30 bg-background/95 p-3 backdrop-blur transition-transform md:hidden ${stickyOn ? "translate-y-0" : "translate-y-full"}`}>
        <a href="#planos" className="btn-cta w-full py-3.5">Ver ofertas de Black Friday</a>
      </div>

      {upsellOpen && <UpsellModal onClose={() => setUpsellOpen(false)} co={co} />}
    </div>
  );
}

function BonusCard({ img, n, t, d, v, vip }: { img: string; n: string; t: string; d: string; v: number; vip?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-card ${vip ? "shadow-gold" : "border border-border"}`}>
      <div className="relative">
        <img src={`/images/${img}`} alt={t} loading="lazy" width={1024} height={1024} className="aspect-[4/3] w-full object-cover" />
        <div className="absolute left-3 top-3"><Badge tone={vip ? "red" : "gold"}>Bônus {n}</Badge></div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">{t}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{d}</p>
        <p className="mt-3 text-sm"><span className="text-muted-foreground line-through">{brl(v)}</span> <b className="ml-1 text-success">GRÁTIS</b></p>
      </div>
    </div>
  );
}

function Carousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const n = (i + GALLERY.length) % GALLERY.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };
  return (
    <div className="relative mx-auto mt-8 max-w-xl">
      <div ref={ref} onScroll={(e) => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-2xl border border-gold/30">
        {GALLERY.map(([f, alt], i) => (
          <img key={f} src={`/images/${f}`} alt={alt} loading={i === 0 ? "eager" : "lazy"} width={800} height={800} className="w-full shrink-0 snap-center object-cover" />
        ))}
      </div>
      <button aria-label="Anterior" onClick={() => go(idx - 1)} className="absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-background/80 text-2xl">‹</button>
      <button aria-label="Próximo" onClick={() => go(idx + 1)} className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-background/80 text-2xl">›</button>
      <div className="mt-4 flex justify-center gap-2">
        {GALLERY.map(([f], i) => (
          <button key={f} aria-label={`Imagem ${i + 1}`} onClick={() => go(i)} className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-gold" : "w-2 bg-muted-foreground/40"}`} />
        ))}
      </div>
    </div>
  );
}

function UpsellModal({ onClose, co }: { onClose: () => void; co: (u: string) => string }) {
  const { left, label } = useCountdown(5 * 60);
  const expired = left === 0;
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="upsell-title" className="fixed inset-0 z-50 flex items-end justify-center bg-background/85 p-3 backdrop-blur-sm animate-in fade-in sm:items-center" onClick={onClose}>
      <div className="relative max-h-[94vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card shadow-gold animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        <div className="stripes h-2" />
        <button aria-label="Fechar" onClick={onClose} className="absolute right-3 top-4 text-2xl text-muted-foreground">×</button>
        <div className="p-6 text-center">
          <Badge tone="red">⚠️ Espere! Oferta única</Badge>
          <p className="mt-3 text-sm text-muted-foreground">Esta oferta expira em <b className="font-mono text-gold">{label}</b></p>
          <h3 id="upsell-title" className="mt-3 font-display text-3xl uppercase leading-tight">Por só <span className="text-gold-grad">+{brl(PRICES.upsellAddOn)}</span> leve o pacote Premium completo</h3>
          <img src="/images/completo.jpg" alt="Kit Premium com todos os bônus" width={800} height={600} className="mt-4 w-full rounded-xl" />
          <ul className="mt-4 space-y-1.5 text-left text-sm">
            <li>✅ +200 personagens de Natal editáveis</li>
            {ALL_BONUS.map((b) => <li key={b.n}>🎁 Bônus {b.n} · {b.t}</li>)}
          </ul>
          <div className="mt-5 rounded-xl bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Premium sai por <span className="line-through">{brl(PRICES.premium)}</span></p>
            <p className="font-display text-4xl text-gold-grad">{brl(upsellTotal())} no total</p>
            <p className="text-xs text-muted-foreground">{brl(PRICES.basic)} do Básico + {brl(PRICES.upsellAddOn)} do upgrade</p>
          </div>
          {expired ? (
            <p className="mt-5 font-semibold text-destructive">O tempo acabou e esta oferta não está mais disponível.</p>
          ) : (
            <a href={co(CHECKOUT.upsell)} className="btn-gold mt-5 w-full">Sim! Quero o upgrade por +{brl(PRICES.upsellAddOn)}</a>
          )}
          <a href={co(CHECKOUT.basic)} className="mt-4 block text-sm text-muted-foreground underline">Não, obrigado. Quero só o Básico por {brl(PRICES.basic)}</a>
        </div>
      </div>
    </div>
  );
}
