-- ══════════════════════════════════════════════════════
-- SQL — Conexão Psi · Meets + Encaminhamentos
-- Rode no Supabase → SQL Editor → New query
-- ══════════════════════════════════════════════════════

-- ── 1. RLS para meet_requests ──
-- Permite leitura e escrita para todos (anon key)

ALTER TABLE meet_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "meet insert"  ON meet_requests;
DROP POLICY IF EXISTS "meet select"  ON meet_requests;
DROP POLICY IF EXISTS "meet update"  ON meet_requests;

CREATE POLICY "meet insert" ON meet_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "meet select" ON meet_requests FOR SELECT USING (true);
CREATE POLICY "meet update" ON meet_requests FOR UPDATE USING (true) WITH CHECK (true);

-- ── 2. Coluna para rastrear quem recebeu o paciente ──
ALTER TABLE encaminhamentos_cruzados
  ADD COLUMN IF NOT EXISTS profissional_atendendo       TEXT,
  ADD COLUMN IF NOT EXISTS profissional_atendendo_reg   TEXT,
  ADD COLUMN IF NOT EXISTS concluido_em                 TIMESTAMPTZ;

-- ── 3. Verificar estrutura final da meet_requests ──
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'meet_requests'
ORDER BY ordinal_position;
