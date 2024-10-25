document.addEventListener('DOMContentLoaded', function() {
    // Botões de "COMPRAR" para cada carro
    const comprarButtons = document.querySelectorAll('.comprar-button');

    // Adicionar eventos aos botões "COMPRAR" de cada carro
    comprarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const carColor = button.getAttribute('data-car');
            const auctionInput = document.getElementById(`auction-${carColor}`);

            // Criar o modal para selecionar o valor de leilão
            const modal = document.createElement('div');
            modal.classList.add('modal', 'fade-in');
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>Selecione um valor de leilão para o carro ${carColor.toUpperCase()}</h3>
                    <div class="value-options">
                        ${[1, 2, 3, 4, 5, 6].map(valor => `<button class="value-button" data-value="${valor}">${valor} MI</button>`).join('')}
                    </div>
                </div>
            `;

            // Adicionar o modal ao body
            document.body.appendChild(modal);

            // Mostrar o modal
            modal.style.display = 'block';

            // Fechar o modal ao clicar no "X"
            modal.querySelector('.close').addEventListener('click', function() {
                fecharModal(modal);
            });

            // Adicionar evento aos botões de valor
            modal.querySelectorAll('.value-button').forEach(valueButton => {
                valueButton.addEventListener('click', function() {
                    const valorSelecionado = valueButton.getAttribute('data-value');
                    auctionInput.value = `${valorSelecionado}`; // Inserir o valor selecionado no campo do carro

                    // Mostrar o campo de valor do leilão e esconder o botão "COMPRAR"
                    auctionInput.style.display = 'inline-block';
                    button.style.display = 'none';

                    fecharModal(modal);
                    calcularLeilaoTotal(); // Atualizar o total do leilão
                });
            });
        });
    });

    // Função para fechar o modal
    function fecharModal(modal) {
        modal.classList.remove('fade-in');
        modal.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 600); // Remover o modal após a animação de saída (600ms)
    }

    // Ocultar o campo de valor do leilão inicialmente
    const auctionInputs = document.querySelectorAll('.score-sheet input[type="number"]');
    auctionInputs.forEach(input => {
        input.style.display = 'none';
    });

    // Elementos para o cálculo da pontuação final
    const calcularButton = document.getElementById('calcular-pontuacao');
    const positionModal = document.getElementById('positionModal');
    const closeModalButton = positionModal.querySelector('.close');
    const submitPositionButton = document.getElementById('submitPosition');
    const errorMessage = document.getElementById('error-message');

    // Função para abrir o modal de posição ao clicar em "Calcular Pontuação"
    calcularButton.addEventListener('click', function() {
        positionModal.style.display = 'block';
        positionModal.classList.add('fade-in');
    });

    // Fechar o modal ao clicar no "X"
    closeModalButton.addEventListener('click', function() {
        positionModal.classList.remove('fade-in');
        positionModal.classList.add('fade-out');
        setTimeout(() => {
            positionModal.style.display = 'none';
            positionModal.classList.remove('fade-out');
        }, 600); // Remover a exibição após a animação de saída
    });

    // Verificar as posições e calcular ao clicar em "Calcular Resultado"
    submitPositionButton.addEventListener('click', function() {
        verificarPosicoesPreenchidas();
    });

    // Função para verificar se todas as posições foram preenchidas e são únicas
    function verificarPosicoesPreenchidas() {
        let todasPreenchidas = true;
        const positionInputs = document.querySelectorAll('.car-position input');
        const posicoes = [];

        positionInputs.forEach(input => {
            if (input.value === '' || input.value < 1 || input.value > 6) {
                todasPreenchidas = false;
            }
            posicoes.push(input.value);
        });

        // Verificar se há posições duplicadas
        const posicoesUnicas = new Set(posicoes);
        if (posicoesUnicas.size !== posicoes.length) {
            todasPreenchidas = false;
            errorMessage.textContent = 'Erro: As posições não podem ser repetidas. Verifique os valores inseridos.';
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
        }

        // Se todas as posições estiverem preenchidas e forem únicas, calcular o resultado
        if (todasPreenchidas) {
            errorMessage.style.display = 'none';
            calculationResults.forEach(item => {
                item.style.display = 'flex';
            });
            calculationOperators.forEach(operator => {
                operator.style.display = 'block';
            });
            calcularGanhosCorridaEApostas(); // Calcular os ganhos
            positionModal.classList.remove('fade-in');
            positionModal.classList.add('fade-out');
            setTimeout(() => {
                positionModal.style.display = 'none';
                positionModal.classList.remove('fade-out');
            }, 600); // Remover a exibição após a animação de saída
        } else if (errorMessage.style.display === 'none') {
            errorMessage.textContent = 'Preencha todas as posições corretamente (1 a 6).';
            errorMessage.style.display = 'block';
        }
    }

    // Função para garantir que apenas um checkbox seja selecionado por coluna
    function configurarCheckboxesUnicos() {
        const apostasCols = ['bet1', 'bet2', 'bet3'];

        apostasCols.forEach(aposta => {
            const checkboxes = document.querySelectorAll(`input[id^="${aposta}"]`);
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    if (checkbox.checked) {
                        // Desmarcar todos os outros checkboxes na mesma coluna
                        checkboxes.forEach(outroCheckbox => {
                            if (outroCheckbox !== checkbox) {
                                outroCheckbox.checked = false;
                            }
                        });
                    }
                });
            });
        });
    }

    configurarCheckboxesUnicos(); // Configurar os checkboxes para serem únicos

    // Função para calcular o total do leilão
    function calcularLeilaoTotal() {
        let leilaoTotal = 0;

        // Somar todos os valores dos inputs de "Valor Pago no Leilão"
        auctionInputs.forEach(input => {
            leilaoTotal += parseFloat(input.value) || 0;
        });

        // Atualizar o campo "Gasto Total do Leilão"
        const leilaoTotalInput = document.getElementById('leilao-total');
        leilaoTotalInput.value = Math.round(leilaoTotal);

        // Atualizar a pontuação final quando o valor do leilão mudar
        calcularPontuacaoFinal();
    }

    // Função para calcular a pontuação final
    function calcularPontuacaoFinal() {
        const corridaTotalInput = document.getElementById('corrida-total');
        const apostasTotalInput = document.getElementById('apostas-total');
        const leilaoTotalInput = document.getElementById('leilao-total');
        const pontuacaoFinalInput = document.getElementById('pontuacao-final');

        const corridaTotal = parseFloat(corridaTotalInput.value) || 0;
        const apostasTotal = parseFloat(apostasTotalInput.value) || 0;
        const leilaoTotal = parseFloat(leilaoTotalInput.value) || 0;

        const pontuacaoFinal = corridaTotal + apostasTotal - leilaoTotal;
        pontuacaoFinalInput.value = Math.round(pontuacaoFinal);
    }

    // Função para calcular os ganhos nas corridas e nas apostas
    function calcularGanhosCorridaEApostas() {
        let corridaTotal = 0;
        let apostasTotal = 0;

        const positionInputs = document.querySelectorAll('.car-position input');
        positionInputs.forEach(input => {
            const carColor = input.id.split('-')[1];
            const position = parseInt(input.value);
            let ganhoCorrida = 0;

            // Calcular ganho com base na posição final do carro
            switch (position) {
                case 1:
                    ganhoCorrida = 12;
                    break;
                case 2:
                    ganhoCorrida = 9;
                    break;
                case 3:
                    ganhoCorrida = 6;
                    break;
                case 4:
                    ganhoCorrida = 4;
                    break;
                case 5:
                    ganhoCorrida = 2;
                    break;
                case 6:
                    ganhoCorrida = 0;
                    break;
            }

            // Adicionar o ganho do carro ao total da corrida apenas se o carro foi comprado
            const auctionInput = document.getElementById(`auction-${carColor}`);
            if (auctionInput && auctionInput.value !== '') {
                corridaTotal += ganhoCorrida;
            }

            // Calcular ganhos das apostas
            const aposta1 = document.getElementById(`bet1-${carColor}`);
            const aposta2 = document.getElementById(`bet2-${carColor}`);
            const aposta3 = document.getElementById(`bet3-${carColor}`);

            if (aposta1.checked) {
                switch (position) {
                    case 1:
                        apostasTotal += 9;
                        break;
                    case 2:
                        apostasTotal += 6;
                        break;
                    case 3:
                        apostasTotal += 3;
                        break;
                }
            }
            if (aposta2.checked) {
                switch (position) {
                    case 1:
                        apostasTotal += 6;
                        break;
                    case 2:
                        apostasTotal += 4;
                        break;
                    case 3:
                        apostasTotal += 2;
                        break;
                }
            }
            if (aposta3.checked) {
                switch (position) {
                    case 1:
                        apostasTotal += 3;
                        break;
                    case 2:
                        apostasTotal += 2;
                        break;
                    case 3:
                        apostasTotal += 1;
                        break;
                }
            }
        });

        // Atualizar os campos de ganhos totais
        document.getElementById('corrida-total').value = corridaTotal;
        document.getElementById('apostas-total').value = apostasTotal;

        // Recalcular a pontuação final
        calcularPontuacaoFinal();
    }

    // Elementos de cálculo e operadores
    const calculationResults = document.querySelectorAll('.calculation-item');
    const calculationOperators = document.querySelectorAll('.calculation-operator');

    // Ocultar os itens de resultado e operadores inicialmente
    calculationResults.forEach(item => {
        item.style.display = 'none';
    });
    calculationOperators.forEach(operator => {
        operator.style.display = 'none';
    });

    // Função para resetar o aplicativo ao clicar no botão "Reiniciar"
    document.getElementById('reset-button').addEventListener('click', function() {
        // Resetar todos os inputs de leilão, apostas e pontuação
        document.querySelectorAll('.score-sheet input[type="number"]').forEach(input => {
            input.value = '';
            input.style.display = 'none'; // Ocultar novamente os campos de leilão
        });

        // Resetar os checkboxes de apostas
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Mostrar os botões de comprar novamente
        document.querySelectorAll('.comprar-button').forEach(button => {
            button.style.display = 'inline-block';
        });

        // Resetar os campos de resultado
        document.getElementById('corrida-total').value = '';
        document.getElementById('apostas-total').value = '';
        document.getElementById('leilao-total').value = '';
        document.getElementById('pontuacao-final').value = '';

        // Ocultar novamente os elementos de cálculo de pontuação
        calculationResults.forEach(item => {
            item.style.display = 'none';
        });
        calculationOperators.forEach(operator => {
            operator.style.display = 'none';
        });

        // Esconder a mensagem de erro, se estiver visível
        errorMessage.style.display = 'none';
    });
});
