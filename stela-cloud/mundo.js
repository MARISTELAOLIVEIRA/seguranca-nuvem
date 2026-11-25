/* ===================================================================
   mundo.js: o Stela Cloud de Segurança em Nuvem com os nomes da AWS · versão 1 · 2026-11-24
   A turma viu mais AWS do que Azure: cada serviço mostra o equivalente na AWS. Só deste site.
   =================================================================== */
window.STELA_MUNDO = {
  rotuloReal: "na AWS",
  fraseReal: "Na AWS de verdade, isto é o ",
  notaGabarito: "O porquê de cada correção e onde ela fica no console da AWS de verdade. Boa revisão para o AWS Cloud Foundations e a CLF-C02.",
  servicos: [
    { id: "identity", nome: "Stela Identity", azure: "AWS IAM (usuários e MFA)", faz: "usuários, MFA, senhas, chaves de acesso e logs de login" },
    { id: "access", nome: "Stela Access Control", azure: "AWS IAM (políticas de permissão)", faz: "políticas (AdministratorAccess, PowerUserAccess, ReadOnlyAccess) e quem recebe cada uma" },
    { id: "storage", nome: "Stela Storage", azure: "Amazon S3", faz: "bloqueio de acesso público, HTTPS, TLS mínimo, rede e versionamento" },
    { id: "network", nome: "Stela Network Guard", azure: "Security Groups (Amazon VPC)", faz: "regras de entrada e saída, portas e origens" },
    { id: "vault", nome: "Stela Vault", azure: "AWS Secrets Manager e AWS KMS", faz: "segredos, chaves, rotação e proteção contra exclusão" },
    { id: "compute", nome: "Stela Compute", azure: "Amazon EC2", faz: "IP público, RDP e SSH, criptografia do disco (EBS) e backup" },
    { id: "defender", nome: "Stela Defender", azure: "Amazon GuardDuty e AWS Security Hub", faz: "security score, recomendações e planos de proteção" },
    { id: "monitor", nome: "Stela Monitor", azure: "Amazon CloudWatch e AWS CloudTrail", faz: "logs de atividade, alertas e tempo de guarda dos logs" }
  ]
};
