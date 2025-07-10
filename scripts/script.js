console.log("Let's get started!");
let curr_folder = "Nadeem Sarvar";
let curr_noha = new Audio();

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


async function fetchFolders(){
    let a = await fetch('http://127.0.0.1:5500/nohay/')
    let response = await a.text()
    
    let div = document.createElement('div')
    
    div.innerHTML = response
    let anchors = []
    Array.from(div.querySelector('ul').querySelectorAll('li')).forEach((e) => {
        if ((e.querySelector('a').href).includes('/nohay/')){
            anchors.push(e.querySelector('a').href.split('/nohay/')[1].replaceAll('%20'," "))
        }
    })
    let UL_folder = document.querySelector('.folders').querySelector('ul')
    
    anchors.forEach((e) => {
        UL_folder.insertAdjacentHTML('beforeend',`<li><h3>${e}</h3></li>`)
    })
}

async function fetchNohay(){
    let a = await fetch(`http://127.0.0.1:5500/nohay/${curr_folder}/`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let Ul_cards = document.querySelector('.cardContainer')
    Ul_cards.innerHTML = ''
    let img, j;
    for (e of  (Array.from(div.querySelector('ul').querySelectorAll('li')))){
        
        if ((e.querySelector('a').href).includes('/nohay/')){
            
            let folder = e.querySelector('a').href.split(`/nohay/`)[1].replaceAll('%20'," ")
            
            let name = folder.split(`${curr_folder}/`)[1].replaceAll('%20'," ")
            
            let a = await fetch(`http://127.0.0.1:5500/nohay/${curr_folder}/${name}/`)
            let resposne = await a.text()
            let div = document.createElement('div')
            div.innerHTML = resposne           
            for (query of (Array.from(div.querySelector('ul').querySelectorAll('li')))){
                
                if (query.querySelector('a').href.endsWith('.jpg') || query.querySelector('a').href.endsWith('.png') || query.querySelector('a').href.endsWith('.jpeg')){
                    img = query.querySelector('a').href
                }
                else if (query.querySelector('a').href.endsWith('.json')){
                    j = query.querySelector('a').href
            }
        }
            
            

            let js = await fetch(j)
            let content = await js.json()
            let title = content.title
            let artist = content.author
            
            Ul_cards.insertAdjacentHTML('beforeend', `
                <div class="card" data-noha="${name}">
                    <div class="cardImage">
                        <img class="cimage" src="${img}" alt="Playlist Image" width="200px" height="200px">
                        <button class="playButton"><img src="images/play-button-arrowhead.png" alt=""></button>
                    </div>
                    <h3>${title}</h3>
                    <p>${artist}</p>
                </div>
            `)
            
    }
    Array.from(document.querySelector('.cardContainer').querySelectorAll('.card')).forEach((e) => {
        e.querySelector('button').addEventListener('click',async () => {
            
            let noha_name = e.dataset.noha
            let a = await fetch(`http://127.0.0.1:5500/nohay/${curr_folder}/${noha_name}/`)
            let response = await a.text()
            let div = document.createElement('div')
            div.innerHTML = response
            Array.from(div.querySelectorAll('li')).forEach((e) => {
                if (e.querySelector('a').href.endsWith('.mp3')){
                    noha = e.querySelector('a').href
                }
            })
            await playNoha(noha)
            document.querySelector('.playNoha').style.display = "block"
            document.querySelector('.playbar').querySelector('.name').innerHTML = e.querySelector('h3').innerText
            
            document.querySelector('.playNoha').querySelector('.image').querySelector('img').src = e.querySelector('.cimage').src
            })
        
    })

        };
        }


        

async function playNoha(e){
    curr_noha.src = e
    curr_noha.play()
    play.src = 'images/pause.png'
}

async function main() {
    await fetchFolders();

    await fetchNohay();

    Array.from(document.querySelector('.folders').querySelectorAll('li')).forEach((e) => {
        e.addEventListener('click',async  () => {
            curr_folder = e.querySelector('h3').innerText
            
            await fetchNohay();
        })
    })

    document.querySelector('.playNoha').querySelector('.cancel').addEventListener('click', () => {
        document.querySelector('.playNoha').style.display = "none"
        curr_noha.pause()
    })

    play.addEventListener('click',() => {
        if (curr_noha.paused){
            curr_noha.play()
            play.src = 'images/pause.png'
        }
        else{
            curr_noha.pause()
            play.src = 'images/play-button-arrowhead.png'
        }
    })

    curr_noha.addEventListener('timeupdate',() => {
        let progress = document.querySelector('.circle')
        let currentTime = curr_noha.currentTime
        let duration = curr_noha.duration
        let percent = (currentTime / duration) * 100
        progress.style.left = `${percent}%`

        document.querySelector('.playbar').querySelector('.time').innerHTML = `${formatDuration(currentTime)} / ${formatDuration(duration)}`
    })

    document.querySelector('.seekbar').addEventListener('click',(e) => {
        
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector('.circle').style.left = `${percent}%`
        curr_noha.currentTime = (percent / 100) * curr_noha.duration
    })

    document.querySelector('.playbar').querySelector('input').addEventListener('change',(e) => {
        curr_noha.volume = e.target.value / 100
    })

    document.querySelector('.playbar').querySelector('.vol_logo').addEventListener('click',() => {
        if (curr_noha.volume == 0){
            curr_noha.volume = 0.5
            document.querySelector('.playbar').querySelector('input').value = 50
            document.querySelector('.playbar').querySelector('.vol_logo').querySelector('img').src = 'images/volume-up.png'
        }
        else{
            curr_noha.volume = 0
            document.querySelector('.playbar').querySelector('input').value = 0
            document.querySelector('.playbar').querySelector('.vol_logo').querySelector('img').src = 'images/mute.png'
        }
    })

    previous.addEventListener('click',() => {
        if (curr_noha.currentTime <= 10){
            curr_noha.currentTime = 0
            document.querySelector('.circle').style.left = `0%`
        }
        else{
            curr_noha.currentTime -= 10
            let percent = (curr_noha.currentTime / curr_noha.duration) * 100
            document.querySelector('.circle').style.left = `${percent}%`
        }
        

    })

     next.addEventListener('click',() => {
        if (curr_noha.duration-curr_noha.currentTime <= 10){
            curr_noha.currentTime = curr_noha.duration 
            document.querySelector('.circle').style.left = `100%`
        }
        else{
           curr_noha.currentTime += 10 
            let percent = (curr_noha.currentTime / curr_noha.duration) * 100
            document.querySelector('.circle').style.left = `${percent}%`
        }
        

    })

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.library').style.display = "block"
        document.querySelector('.library').style.zIndex = "1000"
        document.querySelector('.library').style.position = "fixed"
        document.querySelector('.library').style.top = "0"
        document.querySelector('.library').style.left = "0"
        document.querySelector('.library').style.width = "100%"
        document.querySelector('.library .cancel').style.display = "block"
    })

    document.querySelector('.library .cancel').addEventListener('click', () => {
        document.querySelector('.library').style.display = "none"
    })





}


main()
