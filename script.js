/* =========================================================
   BOLETIM DIGITAL - 8º ANO
   script.js
   ========================================================= */

/* =========================================================
   0) CONFIGURAÇÃO FIXA DO ALUNO
   ========================================================= */
const CONFIG_ALUNO = {
  turma: "8A",
  numeroChamada: 11,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Variável global para armazenar o PIN em memória durante a sessão
let pinSessao = "";

// Estrutura de dados em memória para as disciplinas carregadas
let disciplinasAtuais = [];


/* =========================================================
   1) DADOS BRUTOS (fictícios/locais) — 8º Ano
   ========================================================= */
const dadosBrutos = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] },
];


/* =========================================================
   2) FUNÇÃO: normalizarNota(valor)
   Converte formatos antigos/brutos para escala 0–10.
   ========================================================= */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") return null;

  let numero;
  if (typeof valor === "string") {
    numero = Number(valor.replace(",", "."));
  } else {
    numero = Number(valor);
  }

  if (isNaN(numero)) return null;
  if (numero >= 0 && numero <= 10) return numero;
  if (numero > 10 && numero <= 100) return numero / 10;

  return null;
}


/* =========================================================
   3) CÁLCULOS E AUXILIARES
   ========================================================= */
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null && n !== undefined);
  if (validas.length === 0) return null;
  const soma = validas.reduce((total, n) => total + n, 0);
  return soma / validas.length;
}

function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= 6.0) return "Bom desempenho";
  return "Atenção";
}

function somarFaltas(faltas) {
  if (Array.isArray(faltas)) {
    return faltas.reduce((total, f) => total + (Number(f) || 0), 0);
  }
  return Number(faltas) || 0;
}

function formatarNota(nota) {
  if (nota === null || nota === undefined) return "—";
  return Number(nota).toFixed(1).replace(".", ",");
}


/* =========================================================
   4) PREPARAR DADOS LOCAIS INICIAIS
   ========================================================= */
function obterDadosLocaisPadrao() {
  return dadosBrutos.map((item) => {
    const f1 = Array.isArray(item.faltas) ? item.faltas[0] : 0;
    const f2 = Array.isArray(item.faltas) ? item.faltas[1] : 0;
    const f3 = Array.isArray(item.faltas) ? item.faltas[2] : 0;

    return {
      disciplina: item.disciplina,
      tri1: normalizarNota(item.tri1),
      tri2: normalizarNota(item.tri2),
      tri3: normalizarNota(item.tri3),
      faltas1: f1,
      faltas2: f2,
      faltas3: f3
    };
  });
}


/* =========================================================
   5) RENDERIZAR TELA (DOM)
   ========================================================= */
function renderizarBoletim(disciplinas) {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.textContent = "";

  const processadas = disciplinas.map((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    const media = calcularMedia([n1, n2, n3]);
    
    let totalFaltas = 0;
    if (item.faltas !== undefined && Array.isArray(item.faltas)) {
      totalFaltas = somarFaltas(item.faltas);
    } else {
      totalFaltas = (Number(item.faltas1) || 0) + (Number(item.faltas2) || 0) + (Number(item.faltas3) || 0);
    }

    const situacao = definirSituacao(media);

    return {
      disciplina: item.disciplina,
      tri1: n1,
      tri2: n2,
      tri3: n3,
      media: media,
      faltas: totalFaltas,
      situacao: situacao
    };
  });

  processadas.forEach((d) => {
    const linha = document.createElement("tr");

    let classeSituacao = "situacao-neutro";
    if (d.situacao === "Bom desempenho") classeSituacao = "situacao-bom";
    if (d.situacao === "Atenção") classeSituacao = "situacao-atencao";

    const tdDisc = document.createElement("td");
    tdDisc.textContent = d.disciplina;

    const tdT1 = document.createElement("td");
    tdT1.textContent = formatarNota(d.tri1);

    const tdT2 = document.createElement("td");
    tdT2.textContent = formatarNota(d.tri2);

    const tdT3 = document.createElement("td");
    tdT3.textContent = formatarNota(d.tri3);

    const tdMedia = document.createElement("td");
    tdMedia.textContent = d.media === null ? "—" : formatarNota(d.media);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = d.faltas;

    const tdSit = document.createElement("td");
    tdSit.textContent = d.situacao;
    tdSit.className = classeSituacao;

    linha.appendChild(tdDisc);
    linha.appendChild(tdT1);
    linha.appendChild(tdT2);
    linha.appendChild(tdT3);
    linha.appendChild(tdMedia);
    linha.appendChild(tdFaltas);
    linha.appendChild(tdSit);

    corpoTabela.appendChild(linha);
  });

  // Atualiza Cards
  const mediasDisponiveis = processadas
    .map((d) => d.media)
    .filter((m) => m !== null);

  const mediaGeral = mediasDisponiveis.length > 0
    ? mediasDisponiveis.reduce((t, m) => t + m, 0) / mediasDisponiveis.length
    : null;

  document.getElementById("media-geral").textContent =
    mediaGeral === null ? "—" : formatarNota(mediaGeral);

  const totalFaltasGeral = processadas.reduce((t, d) => t + d.faltas, 0);
  document.getElementById("total-faltas").textContent = totalFaltasGeral;

  const qtdBom = processadas.filter((d) => d.situacao === "Bom desempenho").length;
  document.getElementById("qtd-bom-desempenho").textContent = qtdBom;

  const qtdAtencao = processadas.filter((d) => d.situacao === "Atenção").length;
  document.getElementById("qtd-atencao").textContent = qtdAtencao;

  const frequenciaDemonstrativa = 92;
  document.getElementById("frequencia").textContent = frequenciaDemonstrativa + "%";
  document.getElementById("frequencia-status").textContent = "Frequência adequada";
}


/* =========================================================
   6) CONEXÃO COM A API - ABRIR BOLETIM
   ========================================================= */
const btnEntrar = document.getElementById("btn-entrar");
const campoPin = document.getElementById("campo-pin");
const mensagemStatus = document.getElementById("mensagem-status");

btnEntrar.addEventListener("click", async () => {
  const pinDigitado = campoPin.value.trim();

  if (!pinDigitado) {
    mensagemStatus.textContent = "Digite o PIN para entrar.";
    mensagemStatus.className = "mensagem-status erro";
    return;
  }

  mensagemStatus.textContent = "Conectando...";
  mensagemStatus.className = "mensagem-status";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      mensagemStatus.textContent = "Turma, chamada ou PIN inválidos.";
      mensagemStatus.className = "mensagem-status erro";
      return;
    }

    if (resposta.status === 429) {
      mensagemStatus.textContent = "MUITAS TENTATIVAS. AGUARDE UM MINUTO E TENTE NOVAMENTE.";
      mensagemStatus.className = "mensagem-status erro";
      return;
    }

    if (!resposta.ok) {
      mensagemStatus.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      mensagemStatus.className = "mensagem-status erro";
      return;
    }

    const resultado = await resposta.json();

    pinSessao = pinDigitado;
    campoPin.value = "";

    if (resultado.dados && Array.isArray(resultado.dados.disciplinas) && resultado.dados.disciplinas.length > 0) {
      disciplinasAtuais = resultado.dados.disciplinas;
    } else {
      disciplinasAtuais = obterDadosLocaisPadrao();
    }

    document.getElementById("area-pin").classList.add("oculto");
    document.getElementById("area-boletim").classList.remove("oculto");

    renderizarBoletim(disciplinasAtuais);

  } catch (erro) {
    mensagemStatus.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    mensagemStatus.className = "mensagem-status erro";
  }
});


/* =========================================================
   7) EDIÇÃO DE DADOS
   ========================================================= */
const btnAlterar = document.getElementById("btn-alterar");
const areaEdicao = document.getElementById("area-edicao");
const corpoEdicao = document.getElementById("corpo-edicao");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const mensagemEdicao = document.getElementById("mensagem-edicao");

btnAlterar.addEventListener("click", () => {
  preencherFormularioEdicao();
  areaEdicao.classList.remove("oculto");
  mensagemEdicao.textContent = "";
});

btnCancelar.addEventListener("click", () => {
  areaEdicao.classList.add("oculto");
  mensagemEdicao.textContent = "";
});

function preencherFormularioEdicao() {
  corpoEdicao.textContent = "";

  disciplinasAtuais.forEach((d, idx) => {
    const linha = document.createElement("tr");

    let f1 = 0, f2 = 0, f3 = 0;
    if (Array.isArray(d.faltas)) {
      f1 = d.faltas[0] !== undefined ? d.faltas[0] : 0;
      f2 = d.faltas[1] !== undefined ? d.faltas[1] : 0;
      f3 = d.faltas[2] !== undefined ? d.faltas[2] : 0;
    } else {
      f1 = d.faltas1 !== undefined ? d.faltas1 : 0;
      f2 = d.faltas2 !== undefined ? d.faltas2 : 0;
      f3 = d.faltas3 !== undefined ? d.faltas3 : 0;
    }

    const valT1 = d.tri1 === null || d.tri1 === undefined ? "" : String(d.tri1).replace(".", ",");
    const valT2 = d.tri2 === null || d.tri2 === undefined ? "" : String(d.tri2).replace(".", ",");
    const valT3 = d.tri3 === null || d.tri3 === undefined ? "" : String(d.tri3).replace(".", ",");

    linha.innerHTML = `
      <td>${d.disciplina}</td>
      <td><input type="text" data-idx="${idx}" data-campo="tri1" value="${valT1}" /></td>
      <td><input type="text" data-idx="${idx}" data-campo="faltas1" value="${f1}" /></td>
      <td><input type="text" data-idx="${idx}" data-campo="tri2" value="${valT2}" /></td>
      <td><input type="text" data-idx="${idx}" data-campo="faltas2" value="${f2}" /></td>
      <td><input type="text" data-idx="${idx}" data-campo="tri3" value="${valT3}" /></td>
      <td><input type="text" data-idx="${idx}" data-campo="faltas3" value="${f3}" /></td>
    `;

    corpoEdicao.appendChild(linha);
  });
}

function validarNotaInput(valorStr) {
  const str = valorStr.trim();
  if (str === "") return { valido: true, valor: null };

  const num = Number(str.replace(",", "."));
  if (isNaN(num)) return { valido: false };
  if (num < 0 || num > 10) return { valido: false };

  return { valido: true, valor: num };
}

function validarFaltaInput(valorStr) {
  const str = valorStr.trim();
  if (str === "") return { valido: false };

  const num = Number(str);
  if (isNaN(num) || !Number.isInteger(num) || num < 0) return { valido: false };

  return { valido: true, valor: num };
}

btnSalvar.addEventListener("click", async () => {
  const inputs = corpoEdicao.querySelectorAll("input");
  let temErro = false;

  inputs.forEach((i) => i.classList.remove("input-invalido"));

  const novasDisciplinas = JSON.parse(JSON.stringify(disciplinasAtuais));

  inputs.forEach((input) => {
    const idx = input.getAttribute("data-idx");
    const campo = input.getAttribute("data-campo");
    const val = input.value;

    if (campo.startsWith("tri")) {
      const checagem = validarNotaInput(val);
      if (!checagem.valido) {
        input.classList.add("input-invalido");
        temErro = true;
      } else {
        novasDisciplinas[idx][campo] = checagem.valor;
      }
    } else if (campo.startsWith("faltas")) {
      const checagem = validarFaltaInput(val);
      if (!checagem.valido) {
        input.classList.add("input-invalido");
        temErro = true;
      } else {
        novasDisciplinas[idx][campo] = checagem.valor;
      }
    }
  });

  if (temErro) {
    mensagemEdicao.textContent = "Existem campos com valores inválidos. Verifique os destaques em vermelho.";
    mensagemEdicao.className = "mensagem-status erro";
    return;
  }

  mensagemEdicao.textContent = "Salvando...";
  mensagemEdicao.className = "mensagem-status";

  const payloadDisciplinas = novasDisciplinas.map((d) => {
    const f1 = Number(d.faltas1 !== undefined ? d.faltas1 : (Array.isArray(d.faltas) ? d.faltas[0] : 0));
    const f2 = Number(d.faltas2 !== undefined ? d.faltas2 : (Array.isArray(d.faltas) ? d.faltas[1] : 0));
    const f3 = Number(d.faltas3 !== undefined ? d.faltas3 : (Array.isArray(d.faltas) ? d.faltas[2] : 0));

    return {
      disciplina: d.disciplina,
      tri1: d.tri1,
      tri2: d.tri2,
      tri3: d.tri3,
      faltas: [f1, f2, f3]
    };
  });

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: payloadDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      mensagemEdicao.textContent = "Erro ao salvar os dados no servidor. Tente novamente.";
      mensagemEdicao.className = "mensagem-status erro";
      return;
    }

    disciplinasAtuais = payloadDisciplinas;
    renderizarBoletim(disciplinasAtuais);

    mensagemEdicao.textContent = "Dados salvos com sucesso.";
    mensagemEdicao.className = "mensagem-status sucesso";

    setTimeout(() => {
      areaEdicao.classList.add("oculto");
      mensagemEdicao.textContent = "";
    }, 1200);

  } catch (erro) {
    mensagemEdicao.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    mensagemEdicao.className = "mensagem-status erro";
  }
});