//scrolltoend.js
const element = document.querySelector('.react-grid-layout');

if (element) {
    console.log('Elemento encontrado. Iniciando rolagem...');
    let isMouseMoving = false;
    let resumeScrollTimeout;      
    let descendo = true;
    let newOffset = 0;
    let velocidade = 3;

    const startOffset = 0;
    const endOffset = element.clientHeight - document.querySelector('body').clientHeight;

    let controlScroll;  

    function scrollToSmooth() {        
        if (!isMouseMoving) {
            // Se o mouse não estiver se movendo, continue com o scroll automático

            if (descendo) {
                newOffset = newOffset + (velocidade);
            } else {
                newOffset = newOffset - (velocidade);
            }           

            element.style.marginTop = `-${newOffset}px`;

            if (newOffset >= endOffset || newOffset<=startOffset) {
                descendo = !descendo;
            }

            controlScroll = setTimeout(() => {
                requestAnimationFrame(scrollToSmooth);         
             }, 5); 

        } else {
            // Se o mouse estiver se movendo, aguarde antes de continuar com o scroll automático e calcula o offsettime
            setTimeout(() => {
                clearTimeout(controlScroll);
                controlScroll = setTimeout(() => {
                    requestAnimationFrame(scrollToSmooth);         
                 }, 5);

            }, 100); // Aguarda 100ms antes de verificar novamente se o mouse está se movendo
        }
    }

    function handleMouseMove() {
        isMouseMoving = true;
        clearTimeout(resumeScrollTimeout);

        // Aguarda 1 segundo1 antes de retomar o scroll automático
        resumeScrollTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 1000);
    }

    document.addEventListener('mousemove', handleMouseMove);
    // Definindo startTime antes de iniciar o scrollToSmooth    
    requestAnimationFrame(scrollToSmooth);
    
} else {
    console.log('Elemento não encontrado. A rolagem suave não pode ser iniciada.');
}