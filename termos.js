/**
 * termos.js — Conexão Psi
 * Sistema de aceite de termos reutilizável
 * Inclua este script em: perfil.html, met.html, index.html
 *
 * USO:
 *   TermosAceite.verificar({ email, tabela, onAceito })
 *
 * DEPENDÊNCIAS:
 *   Supabase JS já carregado na página (window.supabase ou window._supabase)
 */

const TermosAceite = (() => {

  const SUPABASE_URL = 'https://tjtrdfbckgdgvcegdsbz.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqdHJkZmJja2dkZ3ZjZWdkc2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODM1ODcsImV4cCI6MjA4OTg1OTU4N30.zNHugdW2a2hYrY43hdqS8TkSM9uCYognU_UyzJZ2Los'; // substitua pela chave anon real
  const VERSAO_TERMOS = '1.0'; // atualize aqui quando revisar os termos

  const TEXTOS = {
    psis: {
      titulo: 'Termos de Uso — Psicólogos',
      subtitulo: 'Leia com atenção antes de continuar',
      corpo: `
        <p>Bem-vindo(a) à <strong>Conexão Psi</strong>, uma rede colaborativa de encaminhamento entre profissionais de saúde.</p>

        <h4>1. Natureza da Plataforma</h4>
        <p>A Conexão Psi facilita indicações de pacientes entre psicólogos e entre psicólogos e outros profissionais de saúde. <strong>Não é um serviço de captação de clientela</strong> e não garante número mínimo de pacientes.</p>

        <h4>2. Conformidade com o CFP</h4>
        <p>Você é responsável pelo conteúdo do seu perfil, que deve estar em conformidade com a <strong>Resolução CFP Nº 06/2019</strong>. A plataforma poderá remover conteúdos que violem as normas éticas.</p>

        <h4>3. Uso de Dados (LGPD)</h4>
        <p>Ao aceitar, você autoriza o uso de: nome, CRP, e-mail, WhatsApp, foto, especialidades, abordagem e cidade — para funcionamento da plataforma. Esses dados nunca serão vendidos a terceiros.</p>

        <h4>4. Suas Responsabilidades</h4>
        <p>Fornecer informações verdadeiras, manter o CRP ativo, responder às indicações com profissionalismo e comunicar alterações relevantes nos seus dados.</p>

        <h4>5. Cancelamento</h4>
        <p>O plano premium pode ser cancelado a qualquer momento, sem multa, com efeito no fim do ciclo vigente.</p>

        <p style="margin-top:16px;font-size:12px;color:#8A8299;">Documento completo disponível em: <a href="termos_conexaopsi.html" target="_blank" style="color:#1B5EA6">termos_conexaopsi.html</a></p>
      `
    },
    profissionais_saude: {
      titulo: 'Termos de Uso — Profissionais de Saúde',
      subtitulo: 'Rede PsiMed · Leia com atenção antes de continuar',
      corpo: `
        <p>Bem-vindo(a) à <strong>Rede PsiMed</strong>, área da Conexão Psi dedicada ao encaminhamento interprofissional.</p>

        <h4>1. Natureza da Plataforma</h4>
        <p>A PsiMed conecta profissionais de saúde a psicólogos verificados para encaminhamento de pacientes. <strong>A plataforma não participa da relação clínica</strong> entre profissional e paciente.</p>

        <h4>2. Responsabilidade pelo Encaminhamento</h4>
        <p>Você é responsável pelos encaminhamentos realizados. Obtenha consentimento do paciente antes de compartilhar dados e <strong>insira apenas informações anonimizadas</strong> nos campos de encaminhamento.</p>

        <h4>3. Uso de Dados (LGPD)</h4>
        <p>Ao aceitar, você autoriza o uso de: nome, registro profissional, especialidade, e-mail, WhatsApp e cidade — para funcionamento da rede PsiMed. Esses dados nunca serão vendidos a terceiros.</p>

        <h4>4. Acesso Gratuito</h4>
        <p>O acesso à PsiMed é gratuito na fase atual. A plataforma poderá introduzir planos pagos futuramente, com aviso prévio.</p>

        <p style="margin-top:16px;font-size:12px;color:#8A8299;">Documento completo disponível em: <a href="termos_conexaopsi.html" target="_blank" style="color:#1B5EA6">termos_conexaopsi.html</a></p>
      `
    }
  };

  // ── ESTILOS DO MODAL ──
  function injetarEstilos() {
    if (document.getElementById('termos-styles')) return;
    const style = document.createElement('style');
    style.id = 'termos-styles';
    style.textContent = `
      #termos-overlay {
        position:fixed;inset:0;z-index:99999;
        background:rgba(15,13,26,0.75);
        display:flex;align-items:center;justify-content:center;
        padding:20px;
        backdrop-filter:blur(4px);
        animation:termos-fade .25s ease;
      }
      @keyframes termos-fade {
        from{opacity:0} to{opacity:1}
      }
      #termos-modal {
        background:#fff;border-radius:18px;
        width:100%;max-width:560px;
        max-height:90vh;display:flex;flex-direction:column;
        box-shadow:0 24px 80px rgba(0,0,0,0.35);
        overflow:hidden;
        animation:termos-up .3s ease;
      }
      @keyframes termos-up {
        from{transform:translateY(20px);opacity:0}
        to{transform:translateY(0);opacity:1}
      }
      #termos-header {
        background:linear-gradient(145deg,#1E1040 0%,#261550 60%,#1a2a4a 100%);
        padding:24px 28px 20px;flex-shrink:0;
      }
      #termos-header h2 {
        font-family:'Cormorant Garamond',Georgia,serif;
        font-size:1.5rem;font-weight:700;color:#fff;margin-bottom:4px;
      }
      #termos-header p {
        font-size:11px;letter-spacing:2px;text-transform:uppercase;
        color:rgba(255,255,255,0.35);
      }
      #termos-corpo {
        flex:1;overflow-y:auto;padding:24px 28px;
        font-family:'Outfit',system-ui,sans-serif;
        font-size:13.5px;line-height:1.75;color:#4A4660;
      }
      #termos-corpo h4 {
        font-size:12px;font-weight:700;text-transform:uppercase;
        letter-spacing:1px;color:#0F0D1A;margin:16px 0 6px;
      }
      #termos-corpo p { margin-bottom:8px; }
      #termos-corpo strong { color:#0F0D1A; }
      #termos-footer {
        padding:18px 28px 24px;border-top:1px solid #E4DDD4;
        flex-shrink:0;background:#F8F5F0;
      }
      #termos-check-wrap {
        display:flex;align-items:flex-start;gap:12px;
        margin-bottom:16px;cursor:pointer;
      }
      #termos-check {
        width:18px;height:18px;border-radius:4px;
        border:2px solid #C8934A;cursor:pointer;
        flex-shrink:0;margin-top:1px;
        accent-color:#C8934A;
      }
      #termos-check-wrap label {
        font-size:13px;color:#0F0D1A;font-weight:500;
        cursor:pointer;line-height:1.5;
      }
      #termos-btn {
        width:100%;padding:13px;border:none;border-radius:10px;
        background:#C8934A;color:#fff;
        font-family:'Outfit',system-ui,sans-serif;
        font-size:14px;font-weight:700;letter-spacing:0.5px;
        cursor:pointer;transition:all .2s;
        opacity:0.4;pointer-events:none;
      }
      #termos-btn.ativo {
        opacity:1;pointer-events:all;
      }
      #termos-btn.ativo:hover {
        background:#b07a35;transform:translateY(-1px);
      }
      #termos-btn.salvando {
        opacity:0.7;pointer-events:none;
      }
      #termos-erro {
        margin-top:10px;font-size:12px;color:#c0392b;
        text-align:center;display:none;
      }
    `;
    document.head.appendChild(style);
  }

  // ── CRIAR MODAL ──
  function criarModal(tabela) {
    const t = TEXTOS[tabela] || TEXTOS.psis;
    const overlay = document.createElement('div');
    overlay.id = 'termos-overlay';
    overlay.innerHTML = `
      <div id="termos-modal">
        <div id="termos-header">
          <h2>${t.titulo}</h2>
          <p>${t.subtitulo}</p>
        </div>
        <div id="termos-corpo">${t.corpo}</div>
        <div id="termos-footer">
          <div id="termos-check-wrap">
            <input type="checkbox" id="termos-check">
            <label for="termos-check">
              Li e concordo com os Termos de Uso da Conexão Psi, incluindo o uso dos meus dados profissionais conforme a LGPD.
            </label>
          </div>
          <button id="termos-btn">Continuar →</button>
          <div id="termos-erro">Erro ao salvar. Tente novamente.</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Ativa botão quando checkbox marcado
    document.getElementById('termos-check').addEventListener('change', function() {
      const btn = document.getElementById('termos-btn');
      btn.classList.toggle('ativo', this.checked);
    });

    return overlay;
  }

  // ── SALVAR ACEITE NO SUPABASE ──
  async function salvarAceite(email, tabela) {
    const agora = new Date().toISOString();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        termos_aceitos: true,
        termos_aceitos_em: agora,
        termos_versao: VERSAO_TERMOS
      })
    });
    if (!res.ok) throw new Error('Falha ao salvar aceite');
    return agora;
  }

  // ── VERIFICAR SE JÁ ACEITOU ──
  async function verificarAceite(email, tabela) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${tabela}?email=eq.${encodeURIComponent(email)}&select=termos_aceitos,termos_aceitos_em`,
      {
        headers: {
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`
        }
      }
    );
    const data = await res.json();
    if (data && data[0]) return data[0].termos_aceitos === true;
    return false;
  }

  // ── MÉTODO PÚBLICO PRINCIPAL ──
  async function verificar({ email, tabela = 'psis', onAceito = () => {} }) {
    if (!email) return onAceito(); // sem email, deixa passar

    const jaAceitou = await verificarAceite(email, tabela);
    if (jaAceitou) return onAceito();

    // Mostra modal
    injetarEstilos();
    const overlay = criarModal(tabela);

    document.getElementById('termos-btn').addEventListener('click', async function() {
      if (!document.getElementById('termos-check').checked) return;

      this.textContent = 'Salvando...';
      this.classList.add('salvando');
      this.classList.remove('ativo');

      try {
        await salvarAceite(email, tabela);
        overlay.remove();
        onAceito();
      } catch(e) {
        document.getElementById('termos-erro').style.display = 'block';
        this.textContent = 'Continuar →';
        this.classList.remove('salvando');
        this.classList.add('ativo');
      }
    });
  }

  return { verificar };
})();
