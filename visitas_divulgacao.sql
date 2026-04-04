-- ============================================================
-- TABELA: visitas_divulgacao
-- Rastreia de onde vêm os visitantes da página de divulgação
-- Rodar no Supabase > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS visitas_divulgacao (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source     TEXT,       -- instagram, facebook, google, whatsapp, direto, outro
  medium     TEXT,       -- utm_medium (ex: bio, stories, post)
  campaign   TEXT,       -- utm_campaign (ex: lancamento, premium_abril)
  content    TEXT,       -- utm_content (ex: card_psi, botao_wa)
  term       TEXT,       -- utm_term
  pagina     TEXT,       -- qual página foi acessada
  referrer   TEXT        -- URL de origem completa
);

ALTER TABLE visitas_divulgacao DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- LINKS UTM PRONTOS PARA USAR
-- Cole esses links nas suas redes sociais
-- ============================================================

-- Instagram Bio:
-- https://michellepsicologiareal-collab.github.io/redepsicologosconexaopsi/divulgacao.html?utm_source=instagram&utm_medium=bio&utm_campaign=rede

-- Instagram Stories:
-- https://michellepsicologiareal-collab.github.io/redepsicologosconexaopsi/divulgacao.html?utm_source=instagram&utm_medium=stories&utm_campaign=rede

-- WhatsApp grupo:
-- https://michellepsicologiareal-collab.github.io/redepsicologosconexaopsi/divulgacao.html?utm_source=whatsapp&utm_medium=grupo&utm_campaign=rede

-- WhatsApp direto:
-- https://michellepsicologiareal-collab.github.io/redepsicologosconexaopsi/divulgacao.html?utm_source=whatsapp&utm_medium=direto&utm_campaign=rede

-- Facebook:
-- https://michellepsicologiareal-collab.github.io/redepsicologosconexaopsi/divulgacao.html?utm_source=facebook&utm_medium=post&utm_campaign=rede

-- Google / Links externos:
-- https://michellepsicologiareal-collab.github.io/redepsicologosconexaopsi/divulgacao.html?utm_source=google&utm_medium=organico

-- ============================================================
-- QUERIES PARA ANÁLISE (rodar no SQL Editor)
-- ============================================================

-- Ver origens dos últimos 30 dias:
-- SELECT source, COUNT(*) as visitas
-- FROM visitas_divulgacao
-- WHERE created_at > NOW() - INTERVAL '30 days'
-- GROUP BY source ORDER BY visitas DESC;

-- Ver por campanha:
-- SELECT campaign, medium, COUNT(*) as visitas
-- FROM visitas_divulgacao
-- WHERE campaign IS NOT NULL AND campaign != ''
-- GROUP BY campaign, medium ORDER BY visitas DESC;

-- Ver por dia:
-- SELECT DATE(created_at) as dia, source, COUNT(*) as visitas
-- FROM visitas_divulgacao
-- GROUP BY dia, source ORDER BY dia DESC;
