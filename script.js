/* =========================================================
   BOLETIM DIGITAL - 8º ANO
   script.js
   ========================================================= */

/* ---------------------------------------------------------
   CONCEITOS RÁPIDOS (vão aparecer no código abaixo):

   - variável: uma "caixinha" que guarda um valor. Ex: const nome = "Ana";
   - array: uma lista de valores. Ex: [10, 20, 30];
   - objeto: um conjunto de características de algo.
              Ex: { disciplina: "Matemática", nota: 8 };
   - função: um bloco de código que faz uma tarefa específica.
   - if: serve para tomar decisões ("se isso, faça aquilo").
   - forEach: percorre cada item de um array.
   - DOM: é a representação da página HTML no JavaScript.
          Usamos o DOM para pegar e alterar elementos da tela.
--------------------------------------------------------- */


/* =========================================================
   1) DADOS BRUTOS (fictícios) — 8º Ano
   ========================================================= */
// Array de objetos: cada objeto é uma disciplina do boletim.
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
   Converte qualquer formato de nota para a escala 0–10.
   Regras:
     - vazio / null / undefined → null (nota ainda não lançada)
     - 0 a 10 → mantém o valor
     - > 10 e <= 100 → divide por 10
     - aceita ponto ou vírgula decimal
     - valores fora das regras → null (inválidos)
   ========================================================= */
function normalizarNota(valor) {
  // Nota ausente
  if (valor === null || valor === undefined || valor === "") return null;

  let numero;

  // Se for string, troca vírgula por ponto antes de converter
  if (typeof valor === "string") {
    numero = Number(valor.replace(",", "."));
  } else {
    numero = Number(valor);
  }

  // Se não for um número válido, retorna null
  if (isNaN(numero)) return null;

  // Regra: 0 a 10 permanece
  if (numero >= 0 && numero <= 10) return numero;

  // Regra: maior que 10 e até 100 → divide por 10
  if (numero > 10 && numero <= 100) return numero / 10;

  // Qualquer outro valor é inválido
  return null;
}


/* =========================================================
   3) FUNÇÃO: calcularMedia(notas)
   Calcula a média usando SOMENTE as notas disponíveis.
   Nota ausente NUNCA vira zero.
   ========================================================= */
function calcularMedia(notas) {
  // Filtra apenas as notas que existem (não nulas)
  const validas = notas.filter((n) => n !== null);

  // Se não houver nenhuma nota válida, retorna null
  if (validas.length === 0) return null;

  // Soma todas e divide pela quantidade
  const soma = validas.reduce((total, n) => total + n, 0);
  return soma / validas.length;
}


/* =========================================================
   4) FUNÇÃO: definirSituacao(media)
   Decide a situação da disciplina com base na média.
   ========================================================= */
function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= 6.0) return "Bom desempenho";
  return "Atenção";
}


/* =========================================================
   5) FUNÇÃO: somarFaltas(listaFaltas)
   Soma as faltas dos três trimestres de uma disciplina.
   Faltas são números inteiros.
   ========================================================= */
function somarFaltas(listaFaltas) {
  return listaFaltas.reduce((total, f) => total + f, 0);
}


/* =========================================================
   6) FUNÇÃO: formatarNota(nota)
   Mostra a nota com uma casa decimal ou "—" se não houver.
   ========================================================= */
function formatarNota(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}


/* =========================================================
   7) PROCESSAR OS DADOS
   Percorre o array de dadosBrutos e monta um novo array
   já com notas normalizadas, média, faltas e situação.
   ========================================================= */
const disciplinasProcessadas = dadosBrutos.map((item) => {
  // Normaliza cada trimestre
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // Calcula a média usando apenas as notas disponíveis
  const media = calcularMedia([n1, n2, n3]);

  // Soma as faltas
  const faltasTotais = somarFaltas(item.faltas);

  // Define a situação
  const situacao = definirSituacao(media);

  // Retorna um objeto novo, organizado
  return {
    disciplina: item.disciplina,
    tri1: n1,
    tri2: n2,
    tri3: n3,
    media: media,
    faltas: faltasTotais,
    situacao: situacao,
  };
});


/* =========================================================
   8) PREENCHER A TABELA (DOM)
   Cria as linhas da tabela dinamicamente.
   ========================================================= */
const corpoTabela = document.getElementById("corpo-tabela");

disciplinasProcessadas.forEach((d) => {
  // Cria uma linha <tr>
  const linha = document.createElement("tr");

  // Define a classe da situação (para colorir)
  let classeSituacao = "situacao-neutro";
  if (d.situacao === "Bom desempenho") classeSituacao = "situacao-bom";
  if (d.situacao === "Atenção") classeSituacao = "situacao-atencao";

  // Monta o HTML da linha
  linha.innerHTML = `
    <td>${d.disciplina}</td>
    <td>${formatarNota(d.tri1)}</td>
    <td>${formatarNota(d.tri2)}</td>
    <td>${formatarNota(d.tri3)}</td>
    <td>${d.media === null ? "—" : formatarNota(d.media)}</td>
    <td>${d.faltas}</td>
    <td class="${classeSituacao}">${d.situacao}</td>
  `;

  // Adiciona a linha ao corpo da tabela
  corpoTabela.appendChild(linha);
});


/* =========================================================
   9) PREENCHER OS CARDS DE RESUMO
   ========================================================= */

// --- Média geral: média das médias disponíveis ---
const mediasDisponiveis = disciplinasProcessadas
  .map((d) => d.media)
  .filter((m) => m !== null);

const mediaGeral =
  mediasDisponiveis.length > 0
    ? mediasDisponiveis.reduce((t, m) => t + m, 0) / mediasDisponiveis.length
    : null;

document.getElementById("media-geral").textContent =
  mediaGeral === null ? "—" : formatarNota(mediaGeral);


// --- Total de faltas (soma de todas as disciplinas) ---
const totalFaltas = disciplinasProcessadas.reduce((t, d) => t + d.faltas, 0);
document.getElementById("total-faltas").textContent = totalFaltas;


// --- Quantidade com bom desempenho ---
const qtdBom = disciplinasProcessadas.filter(
  (d) => d.situacao === "Bom desempenho"
).length;
document.getElementById("qtd-bom-desempenho").textContent = qtdBom;


// --- Quantidade que precisam de atenção ---
const qtdAtencao = disciplinasProcessadas.filter(
  (d) => d.situacao === "Atenção"
).length;
document.getElementById("qtd-atencao").textContent = qtdAtencao;


// --- Frequência DEMONSTRATIVA ---
// ATENÇÃO: este percentual é apenas fictício/demonstrativo.
// No futuro, a frequência será calculada de outra forma,
// com dados reais de presença. Aqui não há relação com faltas.
const frequenciaDemonstrativa = 92;
document.getElementById("frequencia").textContent = frequenciaDemonstrativa + "%";
document.getElementById("frequencia-status").textContent = "Frequência adequada";