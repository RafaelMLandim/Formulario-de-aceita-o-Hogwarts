const perguntasDeHogwarts = [
  // Grifinória
  {
    casa: 'Grifinória',
    pergunta: 'Você enfrenta o problema de frente em situações difíceis?'
  },
  {
    casa: 'Grifinória',
    pergunta: 'Você lidera seus amigos em aventuras arriscadas?'
  },
  // Sonserina
  {
    casa: 'Sonserina',
    pergunta: 'Você prefere traçar um plano estratégico para vencer?'
  },
  {
    casa: 'Sonserina',
    pergunta: 'Você trairia alguém para garantir seu sucesso?'
  },
  // Corvinal
  {
    casa: 'Corvinal',
    pergunta: 'Você resolve problemas complexos usando lógica e raciocínio?'
  },
  {
    casa: 'Corvinal',
    pergunta: 'Você se sentiria satisfeito em ser reconhecido pela sua inteligência?'
  },
  // Lufa-Lufa
  {
    casa: 'Lufa-Lufa',
    pergunta: 'Você valoriza mais a honestidade nas suas relações?'
  },
  {
    casa: 'Lufa-Lufa',
    pergunta: 'Você prefere trabalhar duro para alcançar seus objetivos?'
  }
];


// Variável para rastrear a pergunta atual
let perguntaAtual = 0;
let pontuacaoPorCasa;
// Obter respostas armazenadas do localStorage ou inicializar um novo array
let respostas = JSON.parse(localStorage.getItem('respostasFormulario')) || [];

// Adiciona um listener para o evento de submit do formulário
document.getElementById('meuForm').addEventListener('submit', function (e) {
  e.preventDefault();

  let nome = document.getElementById('nome').value;
  let sobrenome = document.getElementById('sobrenome').value;

  let dados = {
    nome: nome,
    sobrenome: sobrenome
  };

  // Armazena os dados do formulário no localStorage
  localStorage.setItem('dadosFormulario', JSON.stringify(dados));

  // Esconder o formulário e mostrar o questionário
  document.getElementById('meuformulario').classList.add('hidden');
  mostrarPergunta();
});

// Função para mostrar a pergunta na divPergunta
function mostrarPergunta() {
  if (perguntaAtual < perguntasDeHogwarts.length) {
    const divPergunta = document.getElementById("divPergunta");
    divPergunta.innerHTML = ''; // Limpa o conteúdo anterior

    // Cria o elemento da pergunta
    const perguntaElement = document.createElement("p");
    perguntaElement.innerText = perguntasDeHogwarts[perguntaAtual].pergunta;
    divPergunta.appendChild(perguntaElement);

    // Adiciona as opções de resposta
    const opcoes = ['sim', 'talvez', 'nao'];
    opcoes.forEach(opcao => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="resposta" value="${opcao}" required> 
      ${opcao.charAt(0).toUpperCase() + opcao.slice(1)} `;
      divPergunta.appendChild(label);
    });

    // Botão continuar
    const continuarButton = document.createElement("button");
    continuarButton.type = "button";
    continuarButton.innerText = "Continuar";
    continuarButton.onclick = continuar; // Chama a função continuar ao clicar
    divPergunta.appendChild(continuarButton);

    // Mostra a div com a pergunta
    divPergunta.style.display = 'flex';
    divPergunta.style.flexDirection = 'column';
  } else {
    // Aqui você pode armazenar ou processar as respostas
    localStorage.setItem('respostasFormulario', JSON.stringify(respostas));
    const resultado = JSON.parse(localStorage.getItem('respostasFormulario'))

    pontuacaoPorCasa = calcularPontuacao(resultado);
    resultadoFinal()
  }
}
const calcularPontuacao = (respostas) => {
  // Define a pontuação para cada resposta
  const pontos = {
    "sim": 3,
    "nao": 0,
    "talvez": 1
  };

  // Usa reduce para acumular os pontos por casa
  return respostas.reduce((acumulador, item) => {
    const casa = item.casa;
    const resposta = item.resposta;

    // Se a casa ainda não existe no acumulador, inicializa com 0
    if (!acumulador[casa]) {
      acumulador[casa] = 0;
    }

    // Soma os pontos da resposta correspondente à casa
    acumulador[casa] += pontos[resposta];

    return acumulador;
  }, {}); // O {} inicializa o acumulador como um objeto vazio
};

// Função chamada ao clicar no botão "Continuar"
function continuar() {
  // Captura a resposta atual
  const respostaSelecionada = document.querySelector('input[name="resposta"]:checked');
  if (respostaSelecionada) {
    // Armazena a resposta
    respostas.push({
      pergunta: perguntasDeHogwarts[perguntaAtual].pergunta,
      resposta: respostaSelecionada.value,
      casa: perguntasDeHogwarts[perguntaAtual].casa
    });

    perguntaAtual++; // Avança para a próxima pergunta
    mostrarPergunta(); // Mostra a próxima pergunta
  } else {
    alert('Por favor, selecione uma resposta antes de continuar.');
  }
}

function resultadoFinal() {

  document.querySelector('#tudo').style.display = 'none';
  const usuario = JSON.parse(localStorage.getItem('dadosFormulario'))
  const casaSelecionada = document.querySelector('#casaSelecionada');



  const casaComMaiorPontuacao = Object.entries(pontuacaoPorCasa).reduce((acumulador, atual) => {
    return atual[1] > acumulador[1] ? atual : acumulador;
  }, ["", 0]);

  const casaVencedora = casaComMaiorPontuacao[0];

  // Limpa o conteúdo anterior
  casaSelecionada.innerHTML = "";

  // Modifica o conteúdo da div e o fundo do body para a casa correspondente
  if (casaVencedora === 'Grifinória') {
    casaSelecionada.innerHTML = `
      <p>Parabéns ${usuario.nome}! Você pertence à Grifinória!</p>
      <img src="./img/grifinoria.png" alt="Logo Grifinória">
    `;
    document.body.style.backgroundImage = "url('img/grif.jpeg')"; // Cor de fundo para Grifinória
  }
  if (casaVencedora === 'Sonserina') {
    casaSelecionada.innerHTML = `
      <p>Parabéns ${usuario.nome}! Você pertence à Sonserina!</p>
      <img src="./img/sonserina.png" alt="Logo Sonserina">
    `;
    document.body.style.backgroundImage = "url('img/sons.jpeg')"; // Cor de fundo para Sonserina
  }
  if (casaVencedora === 'Corvinal') {
    casaSelecionada.innerHTML = `
      <p>Parabéns ${usuario.nome}! Você pertence à Corvinal!</p>
      <img src="./img/corvinal.png" alt="Logo Corvinal">
    `;
    document.body.style.backgroundImage = "url('img/corvi.jpeg')"; // Cor de fundo para Corvinal
  }
  if (casaVencedora === 'Lufa-Lufa') {
    casaSelecionada.innerHTML = `
      <p>Parabéns ${usuario.nome}! Você pertence à Lufa-Lufa!</p>
      <img src="./img/lufa-lufa.png" alt="Logo Lufa-Lufa">
    `;
    document.body.style.backgroundImage = "url('img/lufa.jpeg')"; // Cor de fundo para Lufa-Lufa
  }
  localStorage.clear()
}

