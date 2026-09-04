DIA 03/09
***FOI ADICIONADA AS CHAVES PARA O ARQUIVO ".env" E FOI CRIADA TAMBÉM O PROJETO DA BIBLIOTECA NO SUPABASE, FORAM FEITOS TESTES DE COMPATIBILIDADE DO BACKEND COM O BANCO DE DADOS.***

**CRIADO SCRIPT DE MIGRAÇÕES:** Foi criado o arquivo `backend/run-migrations.js` para executar automaticamente as migrações SQL do diretório `supabase/migrations` no banco de dados PostgreSQL (Supabase). O script carrega as variáveis de ambiente do arquivo `.env`, conecta ao banco via pool de conexões e executa cada arquivo `.sql` em ordem alfabética, reportando sucesso ou erro de cada migração.