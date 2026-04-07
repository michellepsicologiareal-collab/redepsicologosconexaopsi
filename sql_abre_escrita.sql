-- ══════════════════════════════════════════════════════
-- ABRE UPDATE E DELETE PARA ANON
-- A proteção é feita pela senha do admin no HTML
-- (Edge Function com Secrets não funciona no plano Free)
-- ══════════════════════════════════════════════════════

-- psis
CREATE POLICY "update_psis"
  ON psis FOR UPDATE USING (true);

CREATE POLICY "delete_psis"
  ON psis FOR DELETE USING (true);

-- profissionais_saude
CREATE POLICY "update_profissionais_saude"
  ON profissionais_saude FOR UPDATE USING (true);

CREATE POLICY "delete_profissionais_saude"
  ON profissionais_saude FOR DELETE USING (true);

-- encaminhamentos_cruzados (já tinha update — confirma)
DROP POLICY IF EXISTS "update_encaminhamentos" ON encaminhamentos_cruzados;
CREATE POLICY "update_encaminhamentos"
  ON encaminhamentos_cruzados FOR UPDATE USING (true);

CREATE POLICY "delete_encaminhamentos"
  ON encaminhamentos_cruzados FOR DELETE USING (true);

-- Verificar resultado
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('psis','profissionais_saude','encaminhamentos_cruzados')
ORDER BY tablename, cmd;
