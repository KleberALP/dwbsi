const tamCelula = 40;
document.body.append(criarTabuleiro());

function criarTabuleiro() {
    let tabela = document.createElement('table');
    styleTabuleiro(tabela)
    const tam  = 8;

    for (let i = 0; i < tam; i++) {
        let linha = document.createElement('tr');
        tabela.append(linha);
        for (let j = 0; j < tam; j++) {
            let celula = document.createElement('td');
            acoesCelula(celula,i,j);
            linha.append(celula);
           
            validacoes(celula,i,j);
        }
    };
    return tabela;
}

function validacoes(celula,i,j){
    if (i % 2 == j % 2) {
        celula.addEventListener('dragover', allowDrop)
        celula.style.backgroundColor = 'black';
        if (i * 8 + j <= 24) {
            const peca = criaPeca('black')
            peca.id = `b-i${i}-j${j}`
            celula.append(peca)
            celula.removeEventListener('dragover', allowDrop)
        } else if (i * 8 + j >= 40) {
            const peca = criaPeca('red')
            peca.id = `r-i${i}-j${j}`
            peca.draggable = true
            celula.append(peca)
            celula.removeEventListener('dragover', allowDrop)
        }
    } else {
        celula.style.backgroundColor = 'white';
    }
}

function acoesCelula(celula,i,j){
    celula.addEventListener('drop', drop)
    celula.dataset.lin = i
    celula.dataset.col = j

    celula.style.width = `${tamCelula}px`;
    celula.style.height = `${tamCelula}px`;
}

function styleTabuleiro(tabela) {
    tabela.style.borderStyle = 'solid';
    tabela.style.borderSpacing = 0;
    tabela.style.margin = 'auto';
}

function criaPeca(cor) {
    let imagem = document.createElement('img');
    imagem.dataset.cor = cor
    imagem.classList.add('peca')
    imagem.setAttribute('src', `img/${cor}.png`);
    imagem.setAttribute('width', `${tamCelula-4}px`);
    imagem.setAttribute('height', `${tamCelula-4}px`);
    imagem.setAttribute('draggable', 'false')
    imagem.addEventListener('dragstart', drag)
    return imagem;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("imgid", ev.target.id);
}

function movimentoRegular(origem, destino) {
    const imagem = origem.querySelector(`img`)
    return ((imagem.dataset.cor == 'red' && 
             destino.dataset.lin == origem.dataset.lin-1) ||
            (imagem.dataset.cor == 'black' && 
             destino.dataset.lin-1 == origem.dataset.lin)) && 
            (destino.dataset.col == origem.dataset.col-1 ||
             destino.dataset.col-1 == origem.dataset.col)
}

function drop(ev) {
    const imgid= ev.dataTransfer.getData("imgid");
    const imagem = document.querySelector(`#${imgid}`)
    const origem = imagem.parentElement
    const destino = ev.target
    if (movimentoRegular(origem, destino)){
        origem.addEventListener('dragover', allowDrop)
        destino.appendChild(imagem);
        destino.removeEventListener('dragover', allowDrop)
        jogadorDaVez()
    }
}

function jogadorDaVez() {
    const pecas = document.querySelectorAll('.peca')
    pecas.forEach(peca => {
        peca.draggable = !peca.draggable
    });
}