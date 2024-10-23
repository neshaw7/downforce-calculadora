document.addEventListener('DOMContentLoaded', function() {
    // Elementos de entrada
    const corridaTotalInput = document.getElementById('corrida-total');
    const apostasTotalInput = document.getElementById('apostas-total');
    const leilaoTotalInput = document.getElementById('leilao-total');
    const pontuacaoFinalInput = document.getElementById('pontuacao-final');
    const calcularButton = document.getElementById('calcular-pontuacao');

    // Função para calcular a pontuação final
    function calcularPontuacaoFinal() {
        const corridaTotal = parseFloat(corridaTotalInput.value) || 0;
        const apostasTotal = parseFloat(apostasTotalInput.value) || 0;
        const leilaoTotal = parseFloat(leilaoTotalInput.value) || 0;

        const pontuacaoFinal = corridaTotal + apostasTotal - leilaoTotal;
        pontuacaoFinalInput.value = Math.round(pontuacaoFinal); // Removendo casas decimais
    }

    // Atualizar o cálculo ao clicar no botão
    calcularButton.addEventListener('click', calcularPontuacaoFinal);

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
});
