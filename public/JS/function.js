let MenuButton = document.getElementById("menubutton");
let LevelButton = document.getElementById("levelbutton");

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Level Box animation ----------------------------------------------------------------

const LevelButtonHide = () => {
    let LevelBox = document.getElementById("levelbox")
    let Icon = LevelButton
    LevelBox.style.transition = "150ms all"
    Icon.style.transition = "150ms all"
    LevelBox.style.marginTop = "-13.16em" // adjust
    LevelBox.style.opacity = "0"
    Icon.style.transform = "rotate(-90deg)"
    LevelButton.dataset.hidden = "1"
}

// sidebar animation ------------------------------------------------------------------

MenuButton.addEventListener("click", () => {
    let SideBar = document.getElementById("sidebar")
    switch (MenuButton.dataset.hidden) {
        case "0":
            MenuButton.dataset.hidden = "1"
            if (window.innerWidth <= 1000) {
                MenuButton.dataset.hidden = "1"
                LevelButtonHide()
                sleep(50).then(() => {
                    sidebar.style.transition = "300ms"
                    sidebar.style.transform = "translateX(-24em)"
                    sleep(300).then(() => {
                        sidebar.style.transition = "150ms"
                        if (sidebar.style.transform == "translateX(-24em)") {
                            let sidebarMarginTop = "-" + getComputedStyle(sidebar).height
                            sidebar.style.marginTop = parseInt(sidebarMarginTop)
                        }
                    });
                });
                break;

            } else {
                SideBar.style.marginLeft = "0"
                SideBar.style.marginLeft = "-15%"

                break;
            }
        case "1":
            MenuButton.dataset.hidden = "0"
            if (window.innerWidth <= 1000) {
                MenuButton.dataset.hidden = "0"
                sidebar.style.marginTop = "0.8em"
                sleep(300).then(() => { 
                    sidebar.style.transform = "none"
                });
                break;
            } else {
                SideBar.style.marginLeft = "0.8em"

                break;
            }
    }
})

// Levelbutton animations -------------------------------------------------------------

LevelButton.addEventListener("click", () => {
    let LevelBox = document.getElementById("levelbox")
    let Icon = LevelButton
    // console.log(LevelButton.dataset.hidden)
    switch (LevelButton.dataset.hidden) {
        case "0":
            LevelButtonHide()
            break;
        case "1":
            LevelBox.style.marginTop = "0"
            LevelBox.style.opacity = "1"
            Icon.style.transform = "rotate(0deg)"
            LevelButton.dataset.hidden = "0"
            break;
    }
})

// Infofield animation ----------------------------------------------------------------

let InfoField = document.getElementById("infofield")
let InfoLineBox = document.getElementById("infolinebox")
let ExitInfo = document.getElementById("exitinfo")
let InfoLine = document.getElementById("infoline")
let InfoText = document.getElementById("infotext")

InfoLineBox.addEventListener("click", () => {
    InfoLine.innerHTML = "info"
    InfoLineBox.style.cursor = "context-menu"
    InfoLineBox.style.height = "auto"
    InfoField.style.width = "auto"
    InfoField.style.height = "auto"
    ExitInfo.style.display = "flex"
    InfoText.style.display = "block"
})

ExitInfo.addEventListener("click", () => {
    InfoLine.innerHTML = "i"
    InfoLine.style.cursor = "pointer"
    InfoField.style.width = "50px"
    InfoField.style.height = "50px"
    ExitInfo.style.display = "none"
    InfoText.style.display = "none"
})

// Movement computing/handling --------------------------------------------------------

const Boxes = document.getElementsByClassName("box");
var MOVECOUNTER = 0;

for (let i = 0; i < Boxes.length; i++) {
    Boxes[i].addEventListener("click", () => {
        let BoxXPos = parseInt(Boxes[i].classList[2][6]) // Column
        let BoxYPos = parseInt(Boxes[i].classList[1][3]) // Row
        IfMovable(BoxXPos, BoxYPos)
    })
}

const GameEnd = (NumbOfMoves) => {
    let gameendbox = document.getElementById('overlay')
    let content = document.getElementById('content')
    let gameendtext = document.getElementById('gameendtext')
    gameendbox.style.zIndex = "20"
    gameendbox.style.borderRadius = "20px"
    gameendbox.style.width = getComputedStyle(content).width
    gameendbox.style.height = getComputedStyle(content).height
    gameendbox.style.backdropFilter = "blur(5px)"
    gameendbox.style.display = "flex"
    gameendbox.style.justifyContent = "center"
    gameendtext.style.display = "flex"
}

const GameHandling = (InnerBoxes, LevelGoal) => {
    MOVECOUNTER += 1
    console.log(JSON.stringify(InnerBoxes))
    console.log(LevelGoal)
    if (JSON.stringify(InnerBoxes) == JSON.stringify(LevelGoal)) {
        console.log('you won')
        GameEnd(MOVECOUNTER)
    }

}

const GetColorCode = (Arr) => {
    let ColorCodes = []

    for (let i = 0; i < Arr.length; i++) {
        let BoxColor = Arr[i].classList[3]
        ColorCodes.push(BoxColor)
    }
    return ColorCodes
}

const GameBordCheck = () => {
    LevelGoal = document.getElementsByClassName('goalbox')
    InnerBoxes = document.querySelectorAll('[data-box~="innerbox"]')
    
    InnerBoxes = GetColorCode(InnerBoxes)
    LevelGoal = GetColorCode(LevelGoal)
    GameHandling(InnerBoxes, LevelGoal)
}

const IfMovable = (BoxXPos, BoxYPos) => {
    IfUpIsEmpty(BoxXPos, BoxYPos);
    IfDownIsEmpty(BoxXPos, BoxYPos);
    IfLeftIsEmpty(BoxXPos, BoxYPos);
    IfRightIsEmpty(BoxXPos, BoxYPos);
}

const IfUpIsEmpty = (BoxXPos, BoxYPos) => {
    if (BoxYPos >= 1) {
        let CurrentBox = document.getElementsByClassName("box row" + BoxYPos + " column" + BoxXPos)
        CurrentBox = CurrentBox[0]
        let TargetedBox = document.getElementsByClassName("box row" + (BoxYPos - 1) + " column" + BoxXPos)
        TargetedBox = TargetedBox[0]
        if (TargetedBox.classList[3] == "x") {
            InitMove(TargetedBox, CurrentBox)
        }
    }
}

const IfDownIsEmpty = (BoxXPos, BoxYPos) => {
    if (BoxYPos <= 3) {
        let CurrentBox = document.getElementsByClassName("box row" + BoxYPos + " column" + BoxXPos)
        CurrentBox = CurrentBox[0]
        let TargetedBox = document.getElementsByClassName("box row" + (BoxYPos + 1) + " column" + BoxXPos)
        TargetedBox = TargetedBox[0]
        if (TargetedBox.classList[3] == "x") {
            InitMove(TargetedBox, CurrentBox)
        }
    }
}

const IfLeftIsEmpty = (BoxXPos, BoxYPos) => {
    if (BoxXPos >= 1) {
        let CurrentBox = document.getElementsByClassName("box row" + BoxYPos + " column" + BoxXPos)
        CurrentBox = CurrentBox[0]
        let TargetedBox = document.getElementsByClassName("box row" + BoxYPos + " column" + (BoxXPos - 1))
        TargetedBox = TargetedBox[0]
        if (TargetedBox.classList[3] == "x") {
            InitMove(TargetedBox, CurrentBox)
        }
    }
}

const IfRightIsEmpty = (BoxXPos, BoxYPos) => {
    if (BoxXPos <= 3) {
        let CurrentBox = document.getElementsByClassName("box row" + BoxYPos + " column" + BoxXPos)
        CurrentBox = CurrentBox[0]
        let TargetedBox = document.getElementsByClassName("box row" + BoxYPos + " column" + (BoxXPos + 1))
        TargetedBox = TargetedBox[0]
        if (TargetedBox.classList[3] == "x") {
            InitMove(TargetedBox, CurrentBox)
        }
    }
}

const InitMove = (TargetedBox, CurrentBox) => {
    // console.log(TargetedBox.classList[3] + " => " + CurrentBox.classList[3])

    TargetedColor = TargetedBox.classList[3]
    CurrentColor = CurrentBox.classList[3]
    TargetedBox.classList.remove(TargetedColor)
    TargetedBox.classList.add(CurrentColor)
    CurrentBox.classList.remove(CurrentColor)
    CurrentBox.classList.add(TargetedColor)
    GameBordCheck()
}