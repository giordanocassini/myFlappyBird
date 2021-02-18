function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira (reversa = false) {
    this.elemento = novoElemento ('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild (reversa ? corpo : borda)
    this.elemento.appendChild (reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

function ParDeBarreiras (altura, abertura, x) {
    this.elemento =  novoElemento ('div', 'par-de-barreiras')

    this.superior = new Barreira (true)
    this.inferior = new Barreira (false)

    this.elemento.appendChild(this.superior.elemento) 
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearPosicaoAbertura = () => {
        const alturaSuperior =  Math.random() * (altura - abertura) 
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    // this.destruir = () => {
    //     delete this.superior;
    //     delete this.inferior;
    //     delete this.elemento;
    //     delete this;
    // }
    
    this.getX = () => parseInt(this.elemento.style.left.split('px') [0])
    this.setX = x => this.elemento.style.left = `${x}px`

    this.getLargura = () => this.elemento.clientWidth

    this.sortearPosicaoAbertura()
    this.setX(x) 
}

function Barreiras (altura, largura, abertura, espaco, notificarPonto){
    
    this.pares = [
        new ParDeBarreiras (altura, abertura, largura),
        new ParDeBarreiras (altura, abertura, largura + espaco),
        new ParDeBarreiras (altura, abertura, largura + espaco * 2),
        new ParDeBarreiras (altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3

    // this.destruir = () => {
    //     this.pares.forEach(par => par.destruir())
    //     delete this;
    // }

    this.realocar = () => {
        this.pares.forEach((par, index) => {
            if (index = 0) {
                par.setX(largura + espaco);
            } else {
                par.setX(largura + espaco * index);
            }
            // par.setX( index ? largura + espaco * index : largura + espaco);
            par.sortearAbertura();
        })
    }

    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            // quando o elemento sair da área do jogo
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if(cruzouOMeio) notificarPonto()
        })
    }
}

function Passaro (alturaDoJogo) {
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px'), [0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -3)
        const alturaMaxima = alturaDoJogo - this.elemento.clientHeight

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaDoJogo/2)
}

function Progresso () {
    this.elemento = novoElemento ('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function estaoSobrepostos (elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >=a.top;
    return horizontal && vertical;
}

function colidiu(passaro, barreiras) {
    let colidiu = false;
    barreiras.pares.forEach(parDeBarreiras => {
        if(!colidiu) {
            const superior = parDeBarreiras.superior.elemento;
            const inferior = parDeBarreiras.inferior.elemento;
            colidiu = estaoSobrepostos (passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior);
        }
    })
    return colidiu;
}

function FlappyBird () {
    let pontos = 0;

    const areaDoJogo = document.querySelector('[wm-flappy]');
    const altura = areaDoJogo.clientHeight;
    const largura = areaDoJogo.clientWidth;
    const botaoStart = novoElemento('h1', 'start');
    const progresso = new Progresso();
    let barreiras = new Barreiras(altura, largura, 200, 400,
         () => progresso.atualizarPontos(++pontos));
    const passaro = new Passaro(altura);
    passaro.elemento.style.display = 'none';

    botaoStart.innerHTML = "Start";
    areaDoJogo.appendChild(botaoStart);
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento));
    areaDoJogo.appendChild(passaro.elemento);
    areaDoJogo.appendChild(progresso.elemento);

    const start = () => {
        botaoStart.style.display = 'none';
        passaro.elemento.style.display = 'inline';
        const temporizador = setInterval(() => {
            barreiras.animar();
            passaro.animar();

            if (colidiu(passaro, barreiras)) {
                clearInterval(temporizador);
                pontos = 0;
                barreiras.realocar();
            }
        }, 20)
    }

    botaoStart.onclick = start;
}

new FlappyBird();
//update
// const barreiras = new Barreiras(700, 1200, 200, 400)
// const passaro = new Passaro(700)
// const areaDoJogo = document.querySelector('[wm-flappy]')
// areaDoJogo.appendChild(passaro.elemento)
// areaDoJogo.appendChild(new Progresso().elemento)
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()
// }, 20)
