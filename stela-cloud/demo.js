/* ===================================================================
   demo.js: um plantão de mentira para ver o portal sem login nem sala · versão 4 · 2026-11-24 (termos da AWS; as 8 missões de verdade, variante 1, sem gabarito)
   Abra index.html?demo. Tem o mesmo formato que a função sc_entrar devolve do banco,
   mas sem gabarito nenhum (o gabarito nunca vem para o site).
   =================================================================== */
window.STELA_DEMO = {
  tentativa: 0,
  numero: 1,
  sala: { titulo: "Demonstração", mundo: "incidentes", treino: true, duracao_min: 50, gabarito_liberado: false },
  cliente: { id: "hospital", nome: "Hospital Vida Plena", textos: { icone: "🏥", arquivos: "Fotos de exames dos pacientes", quem: "pacientes", pessoa: "a enfermeira-chefe Rosa", portal: "portal de exames" } },
  segundos_restantes: 50 * 60,
  finalizada: false,
  missoes: [
    {
     "id": "inc-01",
     "ordem": 1,
     "titulo": "{arquivos} aparecem no Google",
     "servico": "Stela Storage",
     "chamado": {
      "prioridade": "P1",
      "sistema": "{portal}",
      "frase": "Acharam {arquivos:min} numa busca no Google! O estagiário deixou o armazenamento aberto para testar e foi almoçar."
     },
     "briefing": "Arquivos de {quem} estão aparecendo em buscas na internet. Descubra pelos logs como eles estão saindo e feche a brecha na conta de armazenamento. O {portal} precisa continuar funcionando.",
     "telas": {
      "conta": {
       "titulo": "Conta de armazenamento",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "Acesso aos arquivos",
         "campos": [
          {
           "chave": "acesso_anonimo",
           "tipo": "chave",
           "rotulo": "Permitir acesso anônimo aos arquivos",
           "ajuda": "Ligado: quem tiver o link abre o arquivo, sem login."
          },
          {
           "chave": "https_obrigatorio",
           "tipo": "chave",
           "rotulo": "Exigir transferência segura (só HTTPS)",
           "ajuda": "Desligado: os arquivos também podem viajar sem criptografia, por HTTP."
          },
          {
           "chave": "tls_minimo",
           "tipo": "opcoes",
           "rotulo": "Versão mínima do TLS",
           "opcoes": [
            {
             "valor": "1.0",
             "rotulo": "TLS 1.0"
            },
            {
             "valor": "1.1",
             "rotulo": "TLS 1.1"
            },
            {
             "valor": "1.2",
             "rotulo": "TLS 1.2"
            }
           ],
           "ajuda": "Quem se conecta com uma versão abaixo desta é recusado."
          }
         ]
        },
        {
         "titulo": "Rede",
         "campos": [
          {
           "chave": "rede",
           "tipo": "opcoes",
           "rotulo": "Acesso pela internet",
           "opcoes": [
            {
             "valor": "todas",
             "rotulo": "Habilitado de todas as redes"
            },
            {
             "valor": "selecionadas",
             "rotulo": "Habilitado só das redes e IPs selecionados"
            },
            {
             "valor": "desativado",
             "rotulo": "Desabilitado: ninguém de fora acessa"
            }
           ],
           "ajuda": "O {portal} roda fora desta conta e precisa continuar lendo os arquivos."
          }
         ]
        },
        {
         "titulo": "Proteção de dados",
         "campos": [
          {
           "chave": "exclusao_reversivel",
           "tipo": "chave",
           "rotulo": "Exclusão reversível (lixeira de 7 dias para arquivos apagados)"
          }
         ]
        },
        {
         "titulo": "Desempenho e custo",
         "campos": [
          {
           "chave": "camada",
           "tipo": "opcoes",
           "rotulo": "Camada de acesso padrão",
           "opcoes": [
            {
             "valor": "quente",
             "rotulo": "Quente: acesso frequente"
            },
            {
             "valor": "fria",
             "rotulo": "Fria: acesso raro, mais barata"
            }
           ]
          },
          {
           "chave": "redundancia",
           "tipo": "opcoes",
           "rotulo": "Redundância",
           "opcoes": [
            {
             "valor": "LRS",
             "rotulo": "LRS: 3 cópias no mesmo datacenter"
            },
            {
             "valor": "ZRS",
             "rotulo": "ZRS: 3 zonas da mesma região"
            },
            {
             "valor": "GRS",
             "rotulo": "GRS: cópia extra em outra região"
            }
           ]
          }
         ]
        }
       ],
       "perigo": {
        "chave": "excluida",
        "rotulo": "Excluir a conta de armazenamento",
        "aviso": "Apaga a conta e todos os arquivos de uma vez. Não tem volta."
       }
      },
      "logs": {
       "titulo": "Logs de acesso (últimas 24 horas)",
       "tipo": "logs",
       "colunas": [
        {
         "chave": "hora",
         "rotulo": "Hora"
        },
        {
         "chave": "ip",
         "rotulo": "IP"
        },
        {
         "chave": "origem",
         "rotulo": "De onde"
        },
        {
         "chave": "operacao",
         "rotulo": "Operação"
        },
        {
         "chave": "arquivo",
         "rotulo": "Arquivo"
        },
        {
         "chave": "autenticacao",
         "rotulo": "Login"
        },
        {
         "chave": "protocolo",
         "rotulo": "Protocolo"
        },
        {
         "chave": "programa",
         "rotulo": "Programa"
        }
       ]
      }
     },
     "estado_inicial": {
      "conta": {
       "_nome": "arquivosprod01",
       "acesso_anonimo": true,
       "https_obrigatorio": false,
       "tls_minimo": "1.0",
       "rede": "todas",
       "exclusao_reversivel": false,
       "camada": "quente",
       "redundancia": "LRS",
       "excluida": false
      },
      "logs": {
       "linhas": [
        {
         "hora": "02:14:07",
         "ip": "66.249.66.12",
         "origem": "EUA",
         "operacao": "Ler arquivo",
         "arquivo": "fotos/2026/img-0412.jpg",
         "autenticacao": "nenhum (anônimo)",
         "protocolo": "HTTP",
         "programa": "Googlebot/2.1"
        },
        {
         "hora": "02:14:09",
         "ip": "66.249.66.12",
         "origem": "EUA",
         "operacao": "Listar arquivos",
         "arquivo": "fotos/2026/",
         "autenticacao": "nenhum (anônimo)",
         "protocolo": "HTTP",
         "programa": "Googlebot/2.1"
        },
        {
         "hora": "07:31:55",
         "ip": "200.130.44.10",
         "origem": "Brasil (rede do cliente)",
         "operacao": "Ler arquivo",
         "arquivo": "fotos/2026/img-0398.jpg",
         "autenticacao": "conta do portal",
         "protocolo": "HTTPS (TLS 1.2)",
         "programa": "portal-web"
        },
        {
         "hora": "09:02:13",
         "ip": "45.146.165.37",
         "origem": "Rússia",
         "operacao": "Ler arquivo",
         "arquivo": "fotos/2026/img-0412.jpg",
         "autenticacao": "nenhum (anônimo)",
         "protocolo": "HTTP",
         "programa": "python-requests/2.31"
        },
        {
         "hora": "11:47:30",
         "ip": "200.130.44.10",
         "origem": "Brasil (rede do cliente)",
         "operacao": "Gravar arquivo",
         "arquivo": "fotos/2026/img-0415.jpg",
         "autenticacao": "conta do portal",
         "protocolo": "HTTPS (TLS 1.2)",
         "programa": "portal-web"
        },
        {
         "hora": "13:05:02",
         "ip": "177.71.8.200",
         "origem": "Brasil",
         "operacao": "Ler arquivo",
         "arquivo": "fotos/2026/img-0412.jpg",
         "autenticacao": "nenhum (anônimo)",
         "protocolo": "HTTPS (TLS 1.0)",
         "programa": "navegador antigo"
        },
        {
         "hora": "15:22:41",
         "ip": "200.130.44.10",
         "origem": "Brasil (rede do cliente)",
         "operacao": "Excluir arquivo",
         "arquivo": "fotos/2025/img-0001.jpg",
         "autenticacao": "conta do portal",
         "protocolo": "HTTPS (TLS 1.2)",
         "programa": "portal-web"
        }
       ]
      }
     },
     "salvo": {}
    },
    {
     "id": "inc-02",
     "ordem": 2,
     "titulo": "Entraram na conta da diretoria de madrugada",
     "servico": "Stela Identity",
     "chamado": {
      "prioridade": "P1",
      "sistema": "E-mail e {portal}",
      "frase": "Eu estava dormindo! Não fui eu que entrei às 3 da manhã, e agora meus e-mails estão indo para um endereço estranho."
     },
     "briefing": "Alguém entrou de madrugada, de outro país, na conta de uma pessoa da diretoria do {cliente}. Leia os logs de entrada, tire o invasor e feche as portas que ele usou. A pessoa precisa continuar trabalhando amanhã.",
     "telas": {
      "usuario": {
       "titulo": "Usuário",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "Autenticação",
         "campos": [
          {
           "chave": "mfa",
           "tipo": "chave",
           "rotulo": "Exigir MFA (senha + aprovação no celular)",
           "ajuda": "Com MFA, só a senha não basta: o invasor precisaria do celular da pessoa."
          },
          {
           "chave": "trocar_senha",
           "tipo": "chave",
           "rotulo": "Exigir troca de senha no próximo login",
           "ajuda": "A senha atual está com o invasor."
          }
         ]
        },
        {
         "titulo": "Sessões",
         "campos": [
          {
           "chave": "revogar_sessoes",
           "tipo": "chave",
           "rotulo": "Revogar todas as sessões abertas (desconecta em todos os aparelhos)",
           "ajuda": "Trocar a senha não derruba quem já está lá dentro."
          }
         ]
        },
        {
         "titulo": "Papel no diretório",
         "campos": [
          {
           "chave": "papel",
           "tipo": "opcoes",
           "rotulo": "Papel de administrador",
           "opcoes": [
            {
             "valor": "global",
             "rotulo": "Administrador global: manda em tudo"
            },
            {
             "valor": "usuarios",
             "rotulo": "Administrador de usuários: cria e reseta contas"
            },
            {
             "valor": "comum",
             "rotulo": "Usuário comum: e-mail, agenda e sistemas do dia a dia"
            }
           ],
           "ajuda": "Esta pessoa é da diretoria, não da TI: usa e-mail, agenda e relatórios."
          }
         ]
        },
        {
         "titulo": "Perfil",
         "campos": [
          {
           "chave": "telefone",
           "tipo": "texto",
           "rotulo": "Telefone de contato"
          }
         ]
        }
       ],
       "perigo": {
        "chave": "excluida",
        "rotulo": "Excluir o usuário",
        "aviso": "Apaga a conta, os e-mails e os arquivos dessa pessoa. Não tem volta."
       }
      },
      "politica": {
       "titulo": "Política de acesso (IAM)",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "De onde pode entrar",
         "campos": [
          {
           "chave": "paises",
           "tipo": "opcoes",
           "rotulo": "Localização",
           "opcoes": [
            {
             "valor": "qualquer",
             "rotulo": "Permitir entradas de qualquer país"
            },
            {
             "valor": "brasil",
             "rotulo": "Bloquear entradas de fora do Brasil"
            },
            {
             "valor": "ninguem",
             "rotulo": "Bloquear todas as entradas"
            }
           ],
           "ajuda": "Toda a equipe do {cliente} trabalha no Brasil."
          }
         ]
        },
        {
         "titulo": "Programas antigos",
         "campos": [
          {
           "chave": "bloquear_legado",
           "tipo": "chave",
           "rotulo": "Bloquear autenticação legada (IMAP, POP e outros que não pedem MFA)",
           "ajuda": "Programa antigo só pede senha: o MFA não funciona nele."
          }
         ]
        }
       ]
      },
      "logs": {
       "titulo": "Logs de entrada (últimas 24 horas)",
       "tipo": "logs",
       "colunas": [
        {
         "chave": "hora",
         "rotulo": "Hora"
        },
        {
         "chave": "usuario",
         "rotulo": "Usuário"
        },
        {
         "chave": "ip",
         "rotulo": "IP"
        },
        {
         "chave": "pais",
         "rotulo": "País"
        },
        {
         "chave": "aplicativo",
         "rotulo": "Aplicativo"
        },
        {
         "chave": "resultado",
         "rotulo": "Resultado"
        },
        {
         "chave": "mfa",
         "rotulo": "MFA"
        },
        {
         "chave": "detalhe",
         "rotulo": "Detalhe"
        }
       ]
      }
     },
     "estado_inicial": {
      "usuario": {
       "_nome": "carla.diretora",
       "mfa": false,
       "trocar_senha": false,
       "revogar_sessoes": false,
       "papel": "global",
       "telefone": "(61) 3333-0101",
       "excluida": false
      },
      "politica": {
       "_nome": "entrada-funcionarios",
       "paises": "qualquer",
       "bloquear_legado": false
      },
      "logs": {
       "linhas": [
        {
         "hora": "08:02:11",
         "usuario": "carla.diretora",
         "ip": "200.130.44.10",
         "pais": "Brasil",
         "aplicativo": "E-mail",
         "resultado": "Sucesso",
         "mfa": "não exigido",
         "detalhe": "rede do {cliente}"
        },
        {
         "hora": "12:40:57",
         "usuario": "carla.diretora",
         "ip": "200.130.44.10",
         "pais": "Brasil",
         "aplicativo": "{portal}",
         "resultado": "Sucesso",
         "mfa": "não exigido",
         "detalhe": "rede do {cliente}"
        },
        {
         "hora": "23:15:02",
         "usuario": "carla.diretora",
         "ip": "89.38.97.115",
         "pais": "Romênia",
         "aplicativo": "E-mail (IMAP, protocolo antigo)",
         "resultado": "Senha errada (38 tentativas)",
         "mfa": "não suportado",
         "detalhe": "programa antigo, não pede MFA"
        },
        {
         "hora": "23:21:40",
         "usuario": "carla.diretora",
         "ip": "89.38.97.115",
         "pais": "Romênia",
         "aplicativo": "E-mail (IMAP, protocolo antigo)",
         "resultado": "Sucesso",
         "mfa": "não suportado",
         "detalhe": "acertou a senha"
        },
        {
         "hora": "03:12:48",
         "usuario": "carla.diretora",
         "ip": "102.89.34.17",
         "pais": "Nigéria",
         "aplicativo": "Portal do Stela Cloud",
         "resultado": "Sucesso",
         "mfa": "não exigido",
         "detalhe": "viagem impossível: estava no Brasil horas antes"
        },
        {
         "hora": "03:44:09",
         "usuario": "carla.diretora",
         "ip": "102.89.34.17",
         "pais": "Nigéria",
         "aplicativo": "E-mail",
         "resultado": "Sucesso",
         "mfa": "não exigido",
         "detalhe": "criou regra: encaminhar tudo para um e-mail de fora"
        },
        {
         "hora": "07:55:30",
         "usuario": "ti.plantao",
         "ip": "200.130.44.10",
         "pais": "Brasil",
         "aplicativo": "Portal do Stela Cloud",
         "resultado": "Sucesso",
         "mfa": "aprovado no celular",
         "detalhe": "rede do {cliente}"
        }
       ]
      }
     },
     "salvo": {}
    },
    {
     "id": "inc-03",
     "ordem": 3,
     "titulo": "Tentativas de senha no servidor a noite toda",
     "servico": "Stela Network Guard",
     "chamado": {
      "prioridade": "P2",
      "sistema": "Servidor do {portal}",
      "frase": "O servidor ficou lento a noite inteira e o alarme de login não parou de tocar. Ninguém sabe por quê."
     },
     "briefing": "Robôs do mundo inteiro tentaram adivinhar senhas no servidor do {portal} a noite toda. Leia os logs de conexão e ajuste as regras do security group. O {portal} precisa continuar no ar, e a TI precisa continuar entrando.",
     "telas": {
      "nsg": {
       "titulo": "Security group · regras de entrada",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "Regra 100 · Portal (HTTPS, porta 443)",
         "campos": [
          {
           "chave": "https",
           "tipo": "opcoes",
           "rotulo": "Quem pode chegar",
           "opcoes": [
            {
             "valor": "internet",
             "rotulo": "Qualquer origem da internet"
            },
            {
             "valor": "interna",
             "rotulo": "Só a rede interna"
            },
            {
             "valor": "bloqueada",
             "rotulo": "Ninguém (porta fechada)"
            }
           ],
           "ajuda": "É por aqui que {quem} usam o {portal}."
          }
         ]
        },
        {
         "titulo": "Regra 110 · Área de trabalho remota (RDP, porta 3389)",
         "campos": [
          {
           "chave": "rdp",
           "tipo": "opcoes",
           "rotulo": "Quem pode chegar",
           "opcoes": [
            {
             "valor": "internet",
             "rotulo": "Qualquer origem da internet"
            },
            {
             "valor": "ip",
             "rotulo": "Só o IP de origem permitido (campo abaixo)"
            },
            {
             "valor": "bloqueada",
             "rotulo": "Ninguém (porta fechada)"
            }
           ]
          },
          {
           "chave": "rdp_ip",
           "tipo": "texto",
           "rotulo": "IP de origem permitido",
           "ajuda": "A TI entra no servidor sempre do mesmo IP fixo do escritório. Os logs mostram qual é."
          }
         ]
        },
        {
         "titulo": "Regra 120 · SSH (porta 22)",
         "campos": [
          {
           "chave": "ssh",
           "tipo": "opcoes",
           "rotulo": "Quem pode chegar",
           "opcoes": [
            {
             "valor": "internet",
             "rotulo": "Qualquer origem da internet"
            },
            {
             "valor": "ip",
             "rotulo": "Só o IP de origem permitido (campo abaixo)"
            },
            {
             "valor": "bloqueada",
             "rotulo": "Ninguém (porta fechada)"
            }
           ],
           "ajuda": "O servidor é Windows: ninguém da TI usa SSH nele."
          }
         ]
        },
        {
         "titulo": "Regra 130 · Banco de dados (SQL, porta 1433)",
         "campos": [
          {
           "chave": "sql",
           "tipo": "opcoes",
           "rotulo": "Quem pode chegar",
           "opcoes": [
            {
             "valor": "internet",
             "rotulo": "Qualquer origem da internet"
            },
            {
             "valor": "interna",
             "rotulo": "Só a rede interna (o servidor do {portal})"
            },
            {
             "valor": "bloqueada",
             "rotulo": "Ninguém (porta fechada)"
            }
           ],
           "ajuda": "Só o próprio {portal} conversa com o banco."
          }
         ]
        },
        {
         "titulo": "Regra 4096 · Todo o resto",
         "campos": [
          {
           "chave": "resto",
           "tipo": "opcoes",
           "rotulo": "O que não estiver nas regras acima",
           "opcoes": [
            {
             "valor": "permitir",
             "rotulo": "Permitir"
            },
            {
             "valor": "negar",
             "rotulo": "Negar"
            }
           ]
          }
         ]
        }
       ],
       "perigo": {
        "chave": "excluida",
        "rotulo": "Excluir o grupo de segurança",
        "aviso": "Tira todas as regras: o servidor fica sem filtro nenhum."
       }
      },
      "logs": {
       "titulo": "Logs de conexão (últimas 24 horas)",
       "tipo": "logs",
       "colunas": [
        {
         "chave": "hora",
         "rotulo": "Hora"
        },
        {
         "chave": "ip",
         "rotulo": "IP"
        },
        {
         "chave": "pais",
         "rotulo": "De onde"
        },
        {
         "chave": "porta",
         "rotulo": "Porta"
        },
        {
         "chave": "usuario",
         "rotulo": "Usuário tentado"
        },
        {
         "chave": "resultado",
         "rotulo": "Resultado"
        },
        {
         "chave": "tentativas",
         "rotulo": "Tentativas"
        }
       ]
      }
     },
     "estado_inicial": {
      "nsg": {
       "_nome": "nsg-servidor-01",
       "https": "internet",
       "rdp": "internet",
       "rdp_ip": "",
       "ssh": "internet",
       "sql": "internet",
       "resto": "permitir",
       "excluida": false
      },
      "logs": {
       "linhas": [
        {
         "hora": "00:03:12",
         "ip": "45.155.205.233",
         "pais": "Rússia",
         "porta": "3389 (RDP)",
         "usuario": "administrator",
         "resultado": "Senha errada",
         "tentativas": "1.842"
        },
        {
         "hora": "01:27:40",
         "ip": "218.92.0.112",
         "pais": "China",
         "porta": "22 (SSH)",
         "usuario": "root",
         "resultado": "Senha errada",
         "tentativas": "3.105"
        },
        {
         "hora": "02:10:05",
         "ip": "193.142.146.20",
         "pais": "Holanda",
         "porta": "1433 (SQL)",
         "usuario": "sa",
         "resultado": "Senha errada",
         "tentativas": "960"
        },
        {
         "hora": "03:55:18",
         "ip": "45.155.205.233",
         "pais": "Rússia",
         "porta": "3389 (RDP)",
         "usuario": "admin",
         "resultado": "Senha errada",
         "tentativas": "2.377"
        },
        {
         "hora": "08:31:02",
         "ip": "200.18.4.7",
         "pais": "Brasil (escritório da TI)",
         "porta": "3389 (RDP)",
         "usuario": "ti.plantao",
         "resultado": "Sucesso",
         "tentativas": "1"
        },
        {
         "hora": "09:00:00",
         "ip": "vários",
         "pais": "Brasil",
         "porta": "443 (HTTPS)",
         "usuario": "visitantes do {portal}",
         "resultado": "Sucesso",
         "tentativas": "12.430 acessos"
        },
        {
         "hora": "09:00:00",
         "ip": "10.0.1.4",
         "pais": "rede interna (servidor do {portal})",
         "porta": "1433 (SQL)",
         "usuario": "app-portal",
         "resultado": "Sucesso",
         "tentativas": "consultas normais"
        },
        {
         "hora": "14:22:47",
         "ip": "200.18.4.7",
         "pais": "Brasil (escritório da TI)",
         "porta": "3389 (RDP)",
         "usuario": "ti.plantao",
         "resultado": "Sucesso",
         "tentativas": "1"
        }
       ]
      }
     },
     "salvo": {}
    },
    {
     "id": "inc-04",
     "ordem": 4,
     "titulo": "Apagaram uma máquina e ninguém foi avisado",
     "servico": "Stela Monitor",
     "chamado": {
      "prioridade": "P2",
      "sistema": "Agenda do {portal}",
      "frase": "A agenda sumiu ontem à noite e ninguém foi avisado. A auditoria quer saber quem foi, e os registros antigos já sumiram."
     },
     "briefing": "Uma máquina do {cliente} foi excluída à noite e só perceberam de manhã. Descubra nos logs o que aconteceu e arrume o monitoramento: guardar os registros e avisar a pessoa certa na hora.",
     "telas": {
      "workspace": {
       "titulo": "Workspace de logs",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "O que coletar",
         "campos": [
          {
           "chave": "log_atividade",
           "tipo": "chave",
           "rotulo": "Enviar o log de atividades da conta da AWS (quem criou, mudou ou excluiu o quê)"
          },
          {
           "chave": "log_entradas",
           "tipo": "chave",
           "rotulo": "Enviar os logs de entrada do Stela Identity (quem fez login e de onde)"
          }
         ]
        },
        {
         "titulo": "Por quanto tempo guardar",
         "campos": [
          {
           "chave": "retencao",
           "tipo": "opcoes",
           "rotulo": "Retenção dos registros",
           "opcoes": [
            {
             "valor": "7",
             "rotulo": "7 dias"
            },
            {
             "valor": "30",
             "rotulo": "30 dias"
            },
            {
             "valor": "90",
             "rotulo": "90 dias"
            },
            {
             "valor": "365",
             "rotulo": "1 ano"
            }
           ],
           "ajuda": "A auditoria do {cliente} pede pelo menos 90 dias de registros."
          }
         ]
        },
        {
         "titulo": "Custo",
         "campos": [
          {
           "chave": "limite_diario",
           "tipo": "numero",
           "rotulo": "Limite diário de dados (GB)"
          }
         ]
        }
       ],
       "perigo": {
        "chave": "excluida",
        "rotulo": "Excluir o workspace de logs",
        "aviso": "Apaga todos os registros guardados. Não tem volta."
       }
      },
      "alerta": {
       "titulo": "Regra de alerta",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "Situação",
         "campos": [
          {
           "chave": "ligado",
           "tipo": "chave",
           "rotulo": "Regra de alerta ligada"
          }
         ]
        },
        {
         "titulo": "Quando disparar",
         "campos": [
          {
           "chave": "sinal",
           "tipo": "opcoes",
           "rotulo": "Sinal",
           "opcoes": [
            {
             "valor": "cpu",
             "rotulo": "CPU acima de 90%"
            },
            {
             "valor": "exclusao",
             "rotulo": "Qualquer recurso excluído (operação Delete)"
            },
            {
             "valor": "login",
             "rotulo": "Qualquer login com sucesso"
            }
           ]
          }
         ]
        },
        {
         "titulo": "Quem avisar",
         "campos": [
          {
           "chave": "avisar",
           "tipo": "opcoes",
           "rotulo": "Grupo de ação",
           "opcoes": [
            {
             "valor": "ninguem",
             "rotulo": "Ninguém (só registra no portal)"
            },
            {
             "valor": "plantao",
             "rotulo": "E-mail e SMS da equipe de plantão"
            },
            {
             "valor": "todos",
             "rotulo": "E-mail para todos os funcionários do {cliente}"
            }
           ]
          }
         ]
        }
       ]
      },
      "logs": {
       "titulo": "Log de atividades (o que sobrou: só 7 dias, só no portal)",
       "tipo": "logs",
       "colunas": [
        {
         "chave": "hora",
         "rotulo": "Hora"
        },
        {
         "chave": "quem",
         "rotulo": "Quem"
        },
        {
         "chave": "operacao",
         "rotulo": "Operação"
        },
        {
         "chave": "recurso",
         "rotulo": "Recurso"
        },
        {
         "chave": "ip",
         "rotulo": "IP"
        },
        {
         "chave": "status",
         "rotulo": "Status"
        }
       ]
      }
     },
     "estado_inicial": {
      "workspace": {
       "_nome": "logs-central",
       "log_atividade": false,
       "log_entradas": false,
       "retencao": "7",
       "limite_diario": 5,
       "excluida": false
      },
      "alerta": {
       "_nome": "alerta-plantao",
       "ligado": false,
       "sinal": "cpu",
       "avisar": "ninguem"
      },
      "logs": {
       "linhas": [
        {
         "hora": "09:14:22",
         "quem": "ti.plantao",
         "operacao": "Reiniciar máquina virtual",
         "recurso": "vm-agenda",
         "ip": "200.130.44.10 (rede do {cliente})",
         "status": "Sucesso"
        },
        {
         "hora": "22:47:03",
         "quem": "joao.ti.antigo",
         "operacao": "Entrar no portal",
         "recurso": "-",
         "ip": "41.216.186.89 (Nigéria)",
         "status": "Sucesso"
        },
        {
         "hora": "22:51:40",
         "quem": "joao.ti.antigo",
         "operacao": "Desligar diagnósticos",
         "recurso": "vm-agenda",
         "ip": "41.216.186.89 (Nigéria)",
         "status": "Sucesso"
        },
        {
         "hora": "22:53:18",
         "quem": "joao.ti.antigo",
         "operacao": "Excluir máquina virtual",
         "recurso": "vm-agenda",
         "ip": "41.216.186.89 (Nigéria)",
         "status": "Sucesso"
        },
        {
         "hora": "22:53:19",
         "quem": "sistema",
         "operacao": "Alerta",
         "recurso": "-",
         "ip": "-",
         "status": "Nenhuma regra de alerta configurada"
        },
        {
         "hora": "07:30:00",
         "quem": "sistema",
         "operacao": "Limpeza do log",
         "recurso": "registros com mais de 7 dias",
         "ip": "-",
         "status": "Apagados"
        }
       ]
      }
     },
     "salvo": {}
    },
    {
     "id": "inc-05",
     "ordem": 5,
     "titulo": "O estagiário virou dono da conta da AWS",
     "servico": "Stela Access Control",
     "chamado": {
      "prioridade": "P2",
      "sistema": "Conta da AWS do {cliente}",
      "frase": "A conta da nuvem veio com R$ 9.800 a mais! Apareceram 12 máquinas que ninguém pediu, e um fornecedor que já saiu ainda mexe no banco."
     },
     "briefing": "No {cliente}, quase todo mundo é dono de tudo. Leia o log de atividades e deixe cada pessoa só com o acesso de que ela precisa para trabalhar. A conta da AWS tem que continuar tendo quem a administre.",
     "telas": {
      "atribuicoes": {
       "titulo": "IAM · permissões de cada usuário na conta da AWS",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "Equipe da TI",
         "campos": [
          {
           "chave": "gerente",
           "tipo": "opcoes",
           "rotulo": "Gerente de TI (responsável pela conta da AWS)",
           "opcoes": [
            {
             "valor": "owner",
             "rotulo": "AdministratorAccess (administrador): faz tudo, inclusive dar acesso"
            },
            {
             "valor": "contributor",
             "rotulo": "PowerUserAccess (usuário avançado): cria e altera, mas não dá acesso"
            },
            {
             "valor": "reader",
             "rotulo": "ReadOnlyAccess (só leitura): só olha"
            },
            {
             "valor": "nenhum",
             "rotulo": "Sem acesso"
            }
           ],
           "ajuda": "É a única pessoa que deve poder dar acesso aos outros."
          },
          {
           "chave": "dev",
           "tipo": "opcoes",
           "rotulo": "Desenvolvedora do {portal} (publica novas versões)",
           "opcoes": [
            {
             "valor": "owner",
             "rotulo": "AdministratorAccess (administrador): faz tudo, inclusive dar acesso"
            },
            {
             "valor": "contributor",
             "rotulo": "PowerUserAccess (usuário avançado): cria e altera, mas não dá acesso"
            },
            {
             "valor": "reader",
             "rotulo": "ReadOnlyAccess (só leitura): só olha"
            },
            {
             "valor": "nenhum",
             "rotulo": "Sem acesso"
            }
           ],
           "ajuda": "Precisa criar e alterar recursos do app, mas não dar acesso a ninguém."
          },
          {
           "chave": "estagiario",
           "tipo": "opcoes",
           "rotulo": "Estagiário de suporte (acompanha os chamados)",
           "opcoes": [
            {
             "valor": "owner",
             "rotulo": "AdministratorAccess (administrador): faz tudo, inclusive dar acesso"
            },
            {
             "valor": "contributor",
             "rotulo": "PowerUserAccess (usuário avançado): cria e altera, mas não dá acesso"
            },
            {
             "valor": "reader",
             "rotulo": "ReadOnlyAccess (só leitura): só olha"
            },
            {
             "valor": "nenhum",
             "rotulo": "Sem acesso"
            }
           ],
           "ajuda": "Precisa enxergar os recursos para ajudar. Não cria nem muda nada."
          }
         ]
        },
        {
         "titulo": "Pessoas de fora",
         "campos": [
          {
           "chave": "auditor",
           "tipo": "opcoes",
           "rotulo": "Auditor externo (confere as configurações)",
           "opcoes": [
            {
             "valor": "owner",
             "rotulo": "AdministratorAccess (administrador): faz tudo, inclusive dar acesso"
            },
            {
             "valor": "contributor",
             "rotulo": "PowerUserAccess (usuário avançado): cria e altera, mas não dá acesso"
            },
            {
             "valor": "reader",
             "rotulo": "ReadOnlyAccess (só leitura): só olha"
            },
            {
             "valor": "nenhum",
             "rotulo": "Sem acesso"
            }
           ],
           "ajuda": "O contrato diz: confere, não altera."
          },
          {
           "chave": "fornecedor",
           "tipo": "opcoes",
           "rotulo": "Fornecedor externo (contrato encerrado no mês passado)",
           "opcoes": [
            {
             "valor": "owner",
             "rotulo": "AdministratorAccess (administrador): faz tudo, inclusive dar acesso"
            },
            {
             "valor": "contributor",
             "rotulo": "PowerUserAccess (usuário avançado): cria e altera, mas não dá acesso"
            },
            {
             "valor": "reader",
             "rotulo": "ReadOnlyAccess (só leitura): só olha"
            },
            {
             "valor": "nenhum",
             "rotulo": "Sem acesso"
            }
           ]
          }
         ]
        },
        {
         "titulo": "Contas sem dono",
         "campos": [
          {
           "chave": "teste",
           "tipo": "opcoes",
           "rotulo": "Conta \"teste123\" (criada para um teste e esquecida)",
           "opcoes": [
            {
             "valor": "owner",
             "rotulo": "AdministratorAccess (administrador): faz tudo, inclusive dar acesso"
            },
            {
             "valor": "contributor",
             "rotulo": "PowerUserAccess (usuário avançado): cria e altera, mas não dá acesso"
            },
            {
             "valor": "reader",
             "rotulo": "ReadOnlyAccess (só leitura): só olha"
            },
            {
             "valor": "nenhum",
             "rotulo": "Sem acesso"
            }
           ]
          }
         ]
        }
       ],
       "perigo": {
        "chave": "excluida",
        "rotulo": "Remover todas as atribuições de papel",
        "aviso": "Ninguém mais terá acesso à conta da AWS, nem o gerente."
       }
      },
      "logs": {
       "titulo": "Log de atividades (últimos 30 dias)",
       "tipo": "logs",
       "colunas": [
        {
         "chave": "hora",
         "rotulo": "Hora"
        },
        {
         "chave": "quem",
         "rotulo": "Quem"
        },
        {
         "chave": "operacao",
         "rotulo": "Operação"
        },
        {
         "chave": "recurso",
         "rotulo": "Recurso"
        },
        {
         "chave": "detalhe",
         "rotulo": "Detalhe"
        }
       ]
      }
     },
     "estado_inicial": {
      "atribuicoes": {
       "_nome": "conta-producao",
       "gerente": "owner",
       "dev": "owner",
       "estagiario": "owner",
       "auditor": "contributor",
       "fornecedor": "contributor",
       "teste": "owner",
       "excluida": false
      },
      "logs": {
       "linhas": [
        {
         "hora": "10:12:40",
         "quem": "estagiario.lucas",
         "operacao": "Criar 12 máquinas virtuais com GPU",
         "recurso": "grupo jogos-teste",
         "detalhe": "custo estimado: R$ 9.800 por mês"
        },
        {
         "hora": "11:03:15",
         "quem": "fornecedor.redes",
         "operacao": "Ler o banco de dados de produção",
         "recurso": "banco-producao",
         "detalhe": "contrato encerrado há 32 dias"
        },
        {
         "hora": "14:47:58",
         "quem": "auditoria.externa",
         "operacao": "Alterar regra do firewall",
         "recurso": "nsg-servidor",
         "detalhe": "o auditor só deveria conferir"
        },
        {
         "hora": "02:19:33",
         "quem": "teste123",
         "operacao": "Entrar no portal",
         "recurso": "-",
         "detalhe": "login de outro país; conta sem dono"
        },
        {
         "hora": "02:21:07",
         "quem": "teste123",
         "operacao": "Dar AdministratorAccess a outra conta",
         "recurso": "conta da AWS",
         "detalhe": "a conta convidada era externa"
        },
        {
         "hora": "16:30:11",
         "quem": "dev.portal",
         "operacao": "Publicar nova versão do {portal}",
         "recurso": "app-producao",
         "detalhe": "deploy de rotina"
        },
        {
         "hora": "17:05:44",
         "quem": "gerente.ti",
         "operacao": "Revisar a conta do mês",
         "recurso": "conta da AWS",
         "detalhe": "\"quem criou essas máquinas?\""
        }
       ]
      }
     },
     "salvo": {}
    },
    {
     "id": "inc-06",
     "ordem": 6,
     "titulo": "A senha do banco foi parar no GitHub",
     "servico": "Stela Vault",
     "chamado": {
      "prioridade": "P1",
      "sistema": "Banco do {portal}",
      "frase": "O GitHub mandou um alerta: a senha do banco está num repositório público! E tem alguém de fora baixando os cadastros."
     },
     "briefing": "Um desenvolvedor do {cliente} publicou a senha do banco junto com o código. Invalide a senha vazada, tire a senha do código e proteja o cofre. O {portal} não pode cair.",
     "telas": {
      "segredo": {
       "titulo": "Segredo",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "Valor",
         "campos": [
          {
           "chave": "rotacionar",
           "tipo": "chave",
           "rotulo": "Gerar uma senha nova agora (a antiga para de funcionar)",
           "ajuda": "A senha que vazou continua valendo até ser trocada. O {portal} lê a nova do cofre sozinho."
          }
         ]
        },
        {
         "titulo": "Validade",
         "campos": [
          {
           "chave": "validade",
           "tipo": "opcoes",
           "rotulo": "Expiração",
           "opcoes": [
            {
             "valor": "nunca",
             "rotulo": "Nunca expira"
            },
            {
             "valor": "90",
             "rotulo": "Expira em 90 dias, com troca automática"
            },
            {
             "valor": "365",
             "rotulo": "Expira em 1 ano"
            }
           ]
          }
         ]
        },
        {
         "titulo": "Situação",
         "campos": [
          {
           "chave": "habilitado",
           "tipo": "chave",
           "rotulo": "Segredo habilitado (o {portal} consegue ler)"
          }
         ]
        }
       ]
      },
      "cofre": {
       "titulo": "Cofre de chaves",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "Proteção",
         "campos": [
          {
           "chave": "protecao_limpeza",
           "tipo": "chave",
           "rotulo": "Proteção contra limpeza (nem um administrador apaga de vez antes de 90 dias)"
          }
         ]
        },
        {
         "titulo": "Rede",
         "campos": [
          {
           "chave": "rede",
           "tipo": "opcoes",
           "rotulo": "Acesso ao cofre",
           "opcoes": [
            {
             "valor": "todas",
             "rotulo": "Habilitado de todas as redes"
            },
            {
             "valor": "selecionadas",
             "rotulo": "Só a rede do {portal}"
            },
            {
             "valor": "desativado",
             "rotulo": "Desabilitado: ninguém acessa"
            }
           ],
           "ajuda": "O {portal} roda na rede interna e lê o cofre por ela."
          }
         ]
        }
       ],
       "perigo": {
        "chave": "excluida",
        "rotulo": "Excluir o cofre",
        "aviso": "Apaga todos os segredos e chaves do {cliente}."
       }
      },
      "app": {
       "titulo": "Aplicativo do {cliente} · configuração",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "Senha do banco",
         "campos": [
          {
           "chave": "origem_senha",
           "tipo": "opcoes",
           "rotulo": "Onde o app busca a senha do banco",
           "opcoes": [
            {
             "valor": "codigo",
             "rotulo": "No arquivo config.js, junto com o código"
            },
            {
             "valor": "vault",
             "rotulo": "No Stela Vault, com a IAM role do app"
            }
           ]
          }
         ]
        },
        {
         "titulo": "Identidade",
         "campos": [
          {
           "chave": "identidade_gerenciada",
           "tipo": "chave",
           "rotulo": "IAM role ligada (o app prova quem é sem senha)"
          }
         ]
        }
       ]
      },
      "logs": {
       "titulo": "Acessos ao segredo e alertas (últimas 24 horas)",
       "tipo": "logs",
       "colunas": [
        {
         "chave": "hora",
         "rotulo": "Hora"
        },
        {
         "chave": "quem",
         "rotulo": "Quem"
        },
        {
         "chave": "ip",
         "rotulo": "IP"
        },
        {
         "chave": "operacao",
         "rotulo": "Operação"
        },
        {
         "chave": "detalhe",
         "rotulo": "Detalhe"
        }
       ]
      }
     },
     "estado_inicial": {
      "segredo": {
       "_nome": "senha-banco-prod",
       "rotacionar": false,
       "validade": "nunca",
       "habilitado": true
      },
      "cofre": {
       "_nome": "cofre-producao",
       "protecao_limpeza": false,
       "rede": "todas",
       "excluida": false
      },
      "app": {
       "_nome": "app-portal",
       "origem_senha": "codigo",
       "identidade_gerenciada": false
      },
      "logs": {
       "linhas": [
        {
         "hora": "09:10:03",
         "quem": "app-portal (identidade do app)",
         "ip": "10.0.1.4 (rede do {portal})",
         "operacao": "Ler segredo",
         "detalhe": "senha-banco-prod"
        },
        {
         "hora": "13:42:51",
         "quem": "Alerta do GitHub",
         "ip": "-",
         "operacao": "Segredo encontrado em repositório público",
         "detalhe": "github.com/dev-cliente/portal-app · arquivo config.js · linha 12"
        },
        {
         "hora": "13:58:20",
         "quem": "desconhecido",
         "ip": "45.83.64.12 (Alemanha)",
         "operacao": "Entrar no banco com a senha do config.js",
         "detalhe": "sucesso: a senha vazada continua valendo"
        },
        {
         "hora": "14:05:37",
         "quem": "desconhecido",
         "ip": "45.83.64.12 (Alemanha)",
         "operacao": "Baixar a tabela de cadastros",
         "detalhe": "8.412 linhas"
        },
        {
         "hora": "14:30:00",
         "quem": "ti.plantao",
         "ip": "200.130.44.10",
         "operacao": "Abrir o cofre",
         "detalhe": "o segredo nunca expira; proteção contra limpeza desligada"
        }
       ]
      }
     },
     "salvo": {}
    },
    {
     "id": "inc-07",
     "ordem": 7,
     "titulo": "O servidor do portal virou alvo",
     "servico": "Stela Compute",
     "chamado": {
      "prioridade": "P2",
      "sistema": "Servidor do {portal}",
      "frase": "Um ransomware derrubou outra empresa do bairro ontem. Nosso servidor está igualzinho ao deles: aberto, desatualizado e sem backup."
     },
     "briefing": "A máquina virtual do {portal} está exposta e desprotegida. Leia os eventos da máquina e endureça a configuração dela, sem tirar o {portal} do ar.",
     "telas": {
      "vm": {
       "titulo": "Máquina virtual",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "Rede",
         "campos": [
          {
           "chave": "ip_publico",
           "tipo": "opcoes",
           "rotulo": "IP público",
           "opcoes": [
            {
             "valor": "fixo",
             "rotulo": "IP público fixo (qualquer um na internet chega na máquina)"
            },
            {
             "valor": "nenhum",
             "rotulo": "Sem IP público (a TI entra pelo Stela Bastion)"
            }
           ],
           "ajuda": "Os {quem} chegam ao {portal} pelo balanceador de carga, não por este IP."
          }
         ]
        },
        {
         "titulo": "Conta de administrador",
         "campos": [
          {
           "chave": "usuario_admin",
           "tipo": "texto",
           "rotulo": "Nome do usuário administrador",
           "ajuda": "É o primeiro nome que os robôs tentam adivinhar."
          }
         ]
        },
        {
         "titulo": "Disco",
         "campos": [
          {
           "chave": "criptografia",
           "tipo": "chave",
           "rotulo": "Criptografia do disco"
          }
         ]
        },
        {
         "titulo": "Atualizações",
         "campos": [
          {
           "chave": "atualizacoes",
           "tipo": "opcoes",
           "rotulo": "Instalação das atualizações de segurança",
           "opcoes": [
            {
             "valor": "manual",
             "rotulo": "Manual (quando alguém lembrar)"
            },
            {
             "valor": "automatica",
             "rotulo": "Automática, na janela de madrugada"
            }
           ]
          }
         ]
        },
        {
         "titulo": "Backup",
         "campos": [
          {
           "chave": "backup",
           "tipo": "chave",
           "rotulo": "Backup diário (guarda 30 dias)"
          }
         ]
        },
        {
         "titulo": "Tamanho e energia",
         "campos": [
          {
           "chave": "tamanho",
           "tipo": "opcoes",
           "rotulo": "Tamanho",
           "opcoes": [
            {
             "valor": "B2s",
             "rotulo": "B2s: 2 CPUs, 4 GB"
            },
            {
             "valor": "D4s",
             "rotulo": "D4s: 4 CPUs, 16 GB"
            }
           ]
          },
          {
           "chave": "ligada",
           "tipo": "chave",
           "rotulo": "Máquina ligada"
          }
         ]
        }
       ],
       "perigo": {
        "chave": "excluida",
        "rotulo": "Excluir a máquina virtual",
        "aviso": "Apaga a máquina e o disco. Sem backup, não tem volta."
       }
      },
      "logs": {
       "titulo": "Eventos da máquina (últimas 24 horas)",
       "tipo": "logs",
       "colunas": [
        {
         "chave": "hora",
         "rotulo": "Hora"
        },
        {
         "chave": "ip",
         "rotulo": "IP"
        },
        {
         "chave": "pais",
         "rotulo": "De onde"
        },
        {
         "chave": "evento",
         "rotulo": "Evento"
        },
        {
         "chave": "usuario",
         "rotulo": "Usuário"
        },
        {
         "chave": "detalhe",
         "rotulo": "Detalhe"
        }
       ]
      }
     },
     "estado_inicial": {
      "vm": {
       "_nome": "vm-portal-01",
       "ip_publico": "fixo",
       "usuario_admin": "admin",
       "criptografia": false,
       "atualizacoes": "manual",
       "backup": false,
       "tamanho": "B2s",
       "ligada": true,
       "excluida": false
      },
      "logs": {
       "linhas": [
        {
         "hora": "00:41:09",
         "ip": "193.32.162.84",
         "pais": "Romênia",
         "evento": "Login falhou",
         "usuario": "admin",
         "detalhe": "2.318 tentativas no IP público 20.201.33.17"
        },
        {
         "hora": "01:15:52",
         "ip": "193.32.162.84",
         "pais": "Romênia",
         "evento": "Login falhou",
         "usuario": "administrator",
         "detalhe": "1.104 tentativas"
        },
        {
         "hora": "03:00:00",
         "ip": "-",
         "pais": "-",
         "evento": "Windows Update",
         "usuario": "sistema",
         "detalhe": "38 atualizações pendentes; a última instalada há 214 dias"
        },
        {
         "hora": "03:30:00",
         "ip": "-",
         "pais": "-",
         "evento": "Backup",
         "usuario": "sistema",
         "detalhe": "nenhum ponto de restauração encontrado"
        },
        {
         "hora": "04:12:30",
         "ip": "-",
         "pais": "-",
         "evento": "Alerta de segurança",
         "usuario": "sistema",
         "detalhe": "disco sem criptografia: quem copiar o disco lê tudo"
        },
        {
         "hora": "09:00:00",
         "ip": "balanceador de carga",
         "pais": "rede interna",
         "evento": "Acessos ao {portal}",
         "usuario": "{quem}",
         "detalhe": "o {portal} chega na máquina pelo balanceador, não pelo IP público"
        }
       ]
      }
     },
     "salvo": {}
    },
    {
     "id": "inc-08",
     "ordem": 8,
     "titulo": "O security score despencou",
     "servico": "Stela Defender",
     "chamado": {
      "prioridade": "P2",
      "sistema": "Segurança do {cliente}",
      "frase": "A diretoria viu no painel que a nota de segurança caiu pela metade e quer saber o que está acontecendo. E ninguém da TI recebeu aviso nenhum!"
     },
     "briefing": "O painel de segurança do {cliente} está cheio de alertas que ninguém leu. Leia os alertas, ligue as proteções certas e trate as recomendações pela gravidade.",
     "telas": {
      "planos": {
       "titulo": "Planos de proteção e avisos",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "Planos de proteção",
         "campos": [
          {
           "chave": "plano_servidores",
           "tipo": "chave",
           "rotulo": "Plano Servidores (antivírus e alertas nas máquinas)"
          },
          {
           "chave": "plano_storage",
           "tipo": "chave",
           "rotulo": "Plano Storage (procura malware nos arquivos enviados)"
          }
         ]
        },
        {
         "titulo": "Avisos",
         "campos": [
          {
           "chave": "email",
           "tipo": "opcoes",
           "rotulo": "Quem recebe os alertas de severidade alta",
           "opcoes": [
            {
             "valor": "ninguem",
             "rotulo": "Ninguém"
            },
            {
             "valor": "plantao",
             "rotulo": "Equipe de segurança de plantão"
            }
           ]
          }
         ]
        }
       ],
       "perigo": {
        "chave": "excluida",
        "rotulo": "Desativar o Stela Defender na conta da AWS",
        "aviso": "Desliga todos os planos, alertas e recomendações."
       }
      },
      "recomendacoes": {
       "titulo": "Recomendações em aberto",
       "tipo": "config",
       "secoes": [
        {
         "titulo": "O que fazer com cada uma",
         "campos": [
          {
           "chave": "r_mfa",
           "tipo": "opcoes",
           "rotulo": "Alta · Contas de administrador sem MFA",
           "opcoes": [
            {
             "valor": "pendente",
             "rotulo": "Pendente"
            },
            {
             "valor": "corrigir",
             "rotulo": "Corrigir agora"
            },
            {
             "valor": "isentar",
             "rotulo": "Isentar (ignorar de propósito)"
            }
           ]
          },
          {
           "chave": "r_portas",
           "tipo": "opcoes",
           "rotulo": "Alta · Portas de gerenciamento (RDP) abertas para a internet",
           "opcoes": [
            {
             "valor": "pendente",
             "rotulo": "Pendente"
            },
            {
             "valor": "corrigir",
             "rotulo": "Corrigir agora"
            },
            {
             "valor": "isentar",
             "rotulo": "Isentar (ignorar de propósito)"
            }
           ]
          },
          {
           "chave": "r_disco",
           "tipo": "opcoes",
           "rotulo": "Média · Discos de máquinas sem criptografia",
           "opcoes": [
            {
             "valor": "pendente",
             "rotulo": "Pendente"
            },
            {
             "valor": "corrigir",
             "rotulo": "Corrigir agora"
            },
            {
             "valor": "isentar",
             "rotulo": "Isentar (ignorar de propósito)"
            }
           ]
          },
          {
           "chave": "r_tags",
           "tipo": "opcoes",
           "rotulo": "Baixa · Recursos sem etiqueta de centro de custo",
           "opcoes": [
            {
             "valor": "pendente",
             "rotulo": "Pendente"
            },
            {
             "valor": "corrigir",
             "rotulo": "Corrigir agora"
            },
            {
             "valor": "isentar",
             "rotulo": "Isentar (ignorar de propósito)"
            }
           ]
          }
         ]
        }
       ]
      },
      "logs": {
       "titulo": "Alertas de segurança (últimas 24 horas)",
       "tipo": "logs",
       "colunas": [
        {
         "chave": "hora",
         "rotulo": "Hora"
        },
        {
         "chave": "severidade",
         "rotulo": "Severidade"
        },
        {
         "chave": "alerta",
         "rotulo": "Alerta"
        },
        {
         "chave": "recurso",
         "rotulo": "Recurso"
        },
        {
         "chave": "detalhe",
         "rotulo": "Detalhe"
        }
       ]
      }
     },
     "estado_inicial": {
      "planos": {
       "_nome": "defender-conta da AWS",
       "plano_servidores": false,
       "plano_storage": false,
       "email": "ninguem",
       "excluida": false
      },
      "recomendacoes": {
       "_nome": "recomendacoes-abertas",
       "r_mfa": "pendente",
       "r_portas": "pendente",
       "r_disco": "pendente",
       "r_tags": "pendente"
      },
      "logs": {
       "linhas": [
        {
         "hora": "06:00:00",
         "severidade": "Informativo",
         "alerta": "Security score caiu de 78% para 41%",
         "recurso": "conta da AWS",
         "detalhe": "3 recomendações altas sem correção"
        },
        {
         "hora": "07:12:44",
         "severidade": "Alta",
         "alerta": "Força bruta no RDP",
         "recurso": "vm-portal",
         "detalhe": "porta 3389 aberta para a internet"
        },
        {
         "hora": "08:30:15",
         "severidade": "Alta",
         "alerta": "Conta de administrador entrou sem MFA",
         "recurso": "conta da AWS",
         "detalhe": "o MFA não é exigido para administradores"
        },
        {
         "hora": "10:05:02",
         "severidade": "Média",
         "alerta": "Arquivo suspeito enviado ao armazenamento",
         "recurso": "storage-uploads",
         "detalhe": "nota-fiscal.pdf.exe · não verificado: o plano Storage está desligado"
        },
        {
         "hora": "11:40:37",
         "severidade": "Média",
         "alerta": "Disco sem criptografia",
         "recurso": "vm-portal",
         "detalhe": "dado parado sem proteção"
        },
        {
         "hora": "13:00:00",
         "severidade": "Informativo",
         "alerta": "Ninguém recebeu os alertas acima",
         "recurso": "conta da AWS",
         "detalhe": "nenhum contato de e-mail configurado"
        }
       ]
      }
     },
     "salvo": {}
    }
  ]
};
