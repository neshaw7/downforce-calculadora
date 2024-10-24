document.addEventListener('DOMContentLoaded', function() {
    // Elementos de entrada
    const corridaTotalInput = document.getElementById('corrida-total');
    const apostasTotalInput = document.getElementById('apostas-total');
    const leilaoTotalInput = document.getElementById('leilao-total');
    const pontuacaoFinalInput = document.getElementById('pontuacao-final');
    const calcularButton = document.getElementById('calcular-pontuacao');

    // Tornar os campos de resultados readonly
    corridaTotalInput.readOnly = true;
    apostasTotalInput.readOnly = true;
    leilaoTotalInput.readOnly = true;
    pontuacaoFinalInput.readOnly = true;

    // Modal e elementos do popup
    const modal = document.getElementById('positionModal');
    const closeModal = document.querySelector('.close');
    const submitButton = document.getElementById('submitPosition');
    const errorMessage = document.getElementById('error-message'); // Novo elemento para mostrar mensagens de erro

    // Função para calcular a pontuação final
    function calcularPontuacaoFinal() {
        const corridaTotal = parseFloat(corridaTotalInput.value) || 0;
        const apostasTotal = parseFloat(apostasTotalInput.value) || 0;
        const leilaoTotal = parseFloat(leilaoTotalInput.value) || 0;

        const pontuacaoFinal = corridaTotal + apostasTotal - leilaoTotal;
        pontuacaoFinalInput.value = Math.round(pontuacaoFinal); // Removendo casas decimais
    }

    // Mostrar o modal ao clicar no botão de calcular com animação suave
    calcularButton.addEventListener('click', function() {
        modal.style.display = 'block';
        modal.classList.remove('fade-out');
        modal.classList.add('fade-in', 'bounce-in');
    });

    // Fechar o modal ao clicar no "X" com animação suave
    closeModal.addEventListener('click', function() {
        modal.classList.remove('fade-in', 'bounce-in');
        modal.classList.add('fade-out', 'bounce-out');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 700);
    });

    // Monitorar os campos de "Valor Pago no Leilão" na tabela dos carros
    const leilaoInputs = document.querySelectorAll('.score-sheet input[type="number"]');

    // Função para calcular o total do leilão
    function calcularLeilaoTotal() {
        let leilaoTotal = 0;

        // Somar todos os valores dos inputs de "Valor Pago no Leilão"
        leilaoInputs.forEach(input => {
            leilaoTotal += parseFloat(input.value) || 0;
        });

        // Atualizar o campo "Gasto Total do Leilão"
        leilaoTotalInput.value = Math.round(leilaoTotal); // Removendo casas decimais

        // Atualizar a pontuação final quando o valor do leilão mudar
        calcularPontuacaoFinal();
    }

    // Monitorar mudanças em cada campo de "Valor Pago no Leilão"
    leilaoInputs.forEach(input => {
        input.addEventListener('input', calcularLeilaoTotal);
    });

    // Função para permitir apenas um checkbox por coluna
    function allowSingleCheckboxPerColumn(columnClass) {
        const checkboxes = document.querySelectorAll(`.${columnClass} input[type="checkbox"]`);

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    // Desmarca todos os outros checkboxes na mesma coluna
                    checkboxes.forEach(otherCheckbox => {
                        if (otherCheckbox !== this) {
                            otherCheckbox.checked = false;
                        }
                    });
                }
            });
        });
    }

    // Aplicar a função para cada coluna de apostas
    allowSingleCheckboxPerColumn('aposta1');
    allowSingleCheckboxPerColumn('aposta2');
    allowSingleCheckboxPerColumn('aposta3');

    // Calcular o resultado ao submeter as posições
    submitButton.addEventListener('click', function() {
        const positions = {
            black: parseInt(document.getElementById('position-black').value) || 0,
            blue: parseInt(document.getElementById('position-blue').value) || 0,
            green: parseInt(document.getElementById('position-green').value) || 0,
            yellow: parseInt(document.getElementById('position-yellow').value) || 0,
            orange: parseInt(document.getElementById('position-orange').value) || 0,
            red: parseInt(document.getElementById('position-red').value) || 0,
        };

        // Verificar se há posições duplicadas
        const positionValues = Object.values(positions).filter(val => val !== 0);
        const uniqueValues = new Set(positionValues);
        if (uniqueValues.size !== positionValues.length) {
            errorMessage.textContent = 'Erro: Existem posições repetidas. Por favor, corrija antes de continuar.';
            errorMessage.style.display = 'block';
            return;
        } else {
            errorMessage.style.display = 'none';
        }

        // Calcular o ganho com base na posição final dos carros
        let corridaTotal = 0;
        let apostasTotal = 0;

        // Definir a tabela de pagamentos para apostas
        const bettingPayouts = {
            1: [9, 6, 3], // Posições: 1º aposta = 9M, 2º aposta = 6M, 3º aposta = 3M
            2: [6, 4, 2],
            3: [3, 2, 1]
        };

        // Calcular o ganho total com base nas apostas
        document.querySelectorAll('.score-sheet input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.checked) {
                const carColor = checkbox.id.split('-')[1];
                const apostaIndex = parseInt(checkbox.id.split('-')[0].replace('bet', '')) - 1;
                const carPosition = positions[carColor];
                const carLeilaoValue = parseFloat(document.getElementById(`auction-${carColor}`).value) || 0;

                // Verificar se o carro foi comprado e se a posição do carro é entre 1º e 3º
                if (carLeilaoValue > 0 && carPosition >= 1 && carPosition <= 3) {
                    apostasTotal += bettingPayouts[carPosition][apostaIndex];
                }
            }
        });

        // Calcular o total com base na posição dos carros
        Object.keys(positions).forEach(car => {
            const position = positions[car];
            const carLeilaoValue = parseFloat(document.getElementById(`auction-${car}`).value) || 0;

            // Calcular apenas se o carro foi comprado
            if (carLeilaoValue > 0) {
                if (position === 1) corridaTotal += 12; // Primeiro lugar recebe $12M
                else if (position === 2) corridaTotal += 9; // Segundo lugar recebe $9M
                else if (position === 3) corridaTotal += 6; // Terceiro lugar recebe $6M
                else if (position === 4) corridaTotal += 4; // Quarto lugar recebe $4M
                else if (position === 5) corridaTotal += 2; // Quinto lugar recebe $2M
                else if (position === 6) corridaTotal += 0; // Sexto lugar recebe $0M
            }
        });

        // Atualizar os campos de "Ganho Total na Corrida" e "Ganho Total nas Apostas"
        corridaTotalInput.value = corridaTotal;
        apostasTotalInput.value = apostasTotal;

        // Atualizar a pontuação final
        calcularPontuacaoFinal();

        // Fechar o modal após o cálculo com animação suave
        modal.classList.remove('fade-in', 'bounce-in');
        modal.classList.add('fade-out', 'bounce-out');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 700);
    });

    // Fechar o modal se o usuário clicar fora dele com animação suave
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.classList.remove('fade-in', 'bounce-in');
            modal.classList.add('fade-out', 'bounce-out');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 700);
        }
    });
});
