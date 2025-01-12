let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true;//player x player o
const winPattern =[
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];

function createParticles(button) {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'balloon-particle';
        
        // Random position around the button
        const buttonRect = button.getBoundingClientRect();
        const startX = buttonRect.left + buttonRect.width / 2;
        const startY = buttonRect.top + buttonRect.height / 2;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(particle);
        
        // Random direction for particles
        const angle = (Math.random() * Math.PI * 2);
        const velocity = 5 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = startX;
        let posY = startY;
        
        const animate = () => {
            posX += vx;
            posY += vy;
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            
            if (posY < window.innerHeight) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

const resetGame = () => {
    if (event && event.target.classList.contains('pop-effect')) {
        return;
    }
    
    const button = event.target;
    button.classList.add('pop-effect');
    createParticles(button);
    
    setTimeout(() => {
        turnO = true;
        enableBoxes();
        msgContainer.classList.add("hide");
        document.querySelector('.container').style.display = 'flex';
        button.classList.remove('pop-effect');
        resetBtn.style.display = "block";
    }, 300);
}

boxes.forEach((box)=>{
    box.addEventListener("click",() =>{
        if(turnO === true){
          box.innerText ="O";
          turnO = false; 
        }else{
            box.innerText ="X";
            turnO = true;
        }
        box.disabled=true;
        checkWinner();
    });
    
});
const disabledBoxes = () =>{
    for(let box of boxes) {
        box.disabled = true;
    }
};
const enableBoxes = () =>{
    for(let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
    // Remove any existing win line
    const line = document.querySelector('.win-line');
    if (line) {
        line.remove();
    }
};
const showWinner = (Winner) => {
    // First draw the line
    for(let pattern of winPattern) {
        const pos1Val = boxes[pattern[0]].innerText;
        const pos2Val = boxes[pattern[1]].innerText;
        const pos3Val = boxes[pattern[2]].innerText;
        
        if(pos1Val === Winner && pos2Val === Winner && pos3Val === Winner) {
            drawWinLine(pattern);
            // Wait for line animation to complete before showing message
            setTimeout(() => {
                document.querySelector('.container').style.display = 'none';
                msg.innerText = `Congratulations, Winner is ${Winner}`;
                msgContainer.classList.remove("hide");
                disabledBoxes();
                resetBtn.style.display = "none";
            }, 500); // 500ms matches the line animation duration
            break;
        }
    }
};
const checkWinner = () => {
    let isDraw = true;
    
    // Check for winner
    for(let pattern of winPattern){
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if(pos1Val != "" && pos2Val != "" && pos3Val != ""){
            if(pos1Val === pos2Val && pos2Val === pos3Val){
                showWinner(pos1Val);
                isDraw = false;
                return;
            }
        }
    }

    // Check for draw
    let allBoxesFilled = true;
    boxes.forEach((box) => {
        if(box.innerText === "") {
            allBoxesFilled = false;
            isDraw = false;
        }
    });

    if(allBoxesFilled && isDraw) {
        document.querySelector('.container').style.display = 'none';
        msg.innerText = "Game Draw! Click New Game to play again";
        msgContainer.classList.remove("hide");
        disabledBoxes();
        resetBtn.style.display = "none";
    }
};

const drawWinLine = (pattern) => {
    const line = document.createElement('div');
    line.classList.add('win-line');
    
    // Determine line type and position based on pattern
    if (pattern.toString() === [0,1,2].toString() || 
        pattern.toString() === [3,4,5].toString() || 
        pattern.toString() === [6,7,8].toString()) {
        // Horizontal lines
        line.classList.add('horizontal');
        const row = Math.floor(pattern[0] / 3);
        line.style.top = `${row * 33.33 + 16.5}%`;
        line.style.left = '0';
    } 
    else if (pattern.toString() === [0,3,6].toString() || 
             pattern.toString() === [1,4,7].toString() || 
             pattern.toString() === [2,5,8].toString()) {
        // Vertical lines
        line.classList.add('vertical');
        const col = pattern[0] % 3;
        line.style.left = `${col * 33.33 + 16.5}%`;
        line.style.top = '0';
    }
    else if (pattern.toString() === [0,4,8].toString()) {
        // Diagonal from top-left to bottom-right
        line.classList.add('diagonal');
        line.style.top = '50%';
        line.style.left = '-20%';
        line.style.transform = 'rotate(45deg)';
    }
    else if (pattern.toString() === [2,4,6].toString()) {
        // Diagonal from top-right to bottom-left
        line.classList.add('diagonal');
        line.style.top = '50%';
        line.style.left = '-20%';
        line.style.transform = 'rotate(-45deg)';
    }
    
    document.querySelector('.game').appendChild(line);
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);