const btnBnW = document.getElementById("btnBnW");
const btnColor = document.getElementById("btnColor");
var colorState = 0;

btnBnW.addEventListener("click",()=>{
    colorState = 0;
})
btnColor.addEventListener("click",()=>{
    colorState = 1;
})

/*Podem ocorrer alguns erros caso a imagem nao carregue e, para evitar utilizo o evento "load".*/
pImage.addEventListener("load", function(){
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const numberOfParticles = 5000;
    canvas.width = 754;
    canvas.height = 1200;

    /*Aqui cria a imagem*/
    ctx.drawImage(pImage, 0, 0, canvas.width, canvas.height)

    /*(Aqui analisa a imagem)getImageData tras os dados da imagem, mas o que quero sao os valores RGB para que posso fazer com que,
    onde esta mais claro a particula passe devagar e onde esta mais escuro mais rapido.*/
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

    /*E aqui excluimos a imagem para obtermos somento o contorno com as particulas.*/
    ctx.clearRect(0,0,canvas.width,canvas.height)

    let mappedImage = [];
    /*Nesse laco sera percorrido o eixo Y (vertical) ate o final da altura(754px) e depois o proximo e proximo...*/
    for(let y = 0; y < canvas.height; y++){
        let row = [];
        /* E nesse percorrera o eixo X */
        for(let x = 0; x < canvas.width; x++){
            /*Aqui pegamos o RGB da imagem e colocamos em uma variavel, pelo getImageData
            sabemos que eh Red, Green, Blue e ALPHA. Entao colocamos +1 ao final para pegar a proxima cor.*/
            const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
            const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
            const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
            const brightness = calcPixelBrightness(red,green,blue);
            const cell = [
                cellBrightness = brightness,
                color = "rgb("+ `${red},${green},${blue}` +")",
            ];
            row.push(cell)
        }
        mappedImage.push(row)
    }
    /* Uma funcao de luminancia relativa encontrada na internet. */
    function calcPixelBrightness(red, green, blue) {
        return Math.sqrt(
            (red * red) * 0.299 +
            (green * green) * 0.587 +
            (blue * blue) * 0.114
            )/100;
        
    }

    /*Construcao da particula*/
    class Particle{
        constructor(){
            this.x = Math.random() * canvas.width;
            /*Como quero que ela venha de cima para baixo, forneco o valor 0 ao eixo Y.*/
            this.y = 0;
            this.speed = 0;
            this.velocity = Math.random() * 0.5;
            this.size = Math.random() * 1 + 1.5;
            this.position1 = Math.floor(this.y)
            this.position2 = Math.floor(this.x)
        }
        update(){
            this.position1 = Math.floor(this.y)
            this.position2 = Math.floor(this.x)
            this.speed = mappedImage[this.position1][this.position2][0]
            let movement = (2.5 - this.speed) + this.velocity;

            this.y += movement;
            /*Quando a particula atingir a borda da tela ela voltara ao ponto inicial que é o topo.*/
            if(this.y >= canvas.height){
                this.y = 0;
                this.x = Math.random() * canvas.width;
            }
        }
        
        draw(){
            ctx.beginPath();
            if(colorState == 0){
                ctx.fillStyle = "white";
            }
            if(colorState == 1){
                ctx.fillStyle = ctx.fillStyle = mappedImage[this.position1][this.position2][1];
            }
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

        function init(){
            for(let i=0; i < numberOfParticles; i++){
                particlesArray.push(new Particle)
            }
        }
        init();

        function animate(){
            ctx.globalAlpha = 0.09;
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for(let i=0; i < particlesArray.length; i++){
                ctx.globalAlpha = particlesArray[i].speed
                particlesArray[i].update();
                particlesArray[i].draw(); 
            }
            requestAnimationFrame(animate);
        }
        animate();

});
