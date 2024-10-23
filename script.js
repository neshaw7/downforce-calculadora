function toggleCheck(checkbox) {
    if (checkbox.checked) {
        checkbox.style.backgroundColor = "#4CAF50"; // Cor quando marcado
    } else {
        checkbox.style.backgroundColor = "white"; // Volta ao branco quando desmarcado
    }
}

function calculateScore() {
    // Pegue os valores de leilão e as apostas como antes
    let auctionBlack = parseInt(document.getElementById('auction-black').value) || 0;
    let auctionBlue = parseInt(document.getElementById('auction-blue').value) || 0;
    let auctionGreen = parseInt(document.getElementById('auction-green').value) || 0;
    let auctionYellow = parseInt(document.getElementById('auction-yellow').value) || 0;
    let auctionOrange = parseInt(document.getElementById('auction-orange').value) || 0;
    let auctionRed = parseInt(document.getElementById('auction-red').value) || 0;

    // Lógica para calcular pontuações vai aqui

    let totalScore = auctionBlack + auctionBlue + auctionGreen + auctionYellow + auctionOrange + auctionRed;
    document.getElementById('final-score').innerText = `${totalScore}M`;
}
