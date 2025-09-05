const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class= "btn">${el}</span>`);
    return(htmlElements.join(" "));
}

    // speaker word function
    function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


    //  spinner function

    const manageSpinner = (status) => {
        if(status === true){
            document.getElementById("spinner").classList.remove("hidden");
            document.getElementById("word-container").classList.add("hidden");

        } else {
            document.getElementById("spinner").classList.add("hidden");
            document.getElementById("word-container").classList.remove("hidden");
        }
    }

const loadlessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
        }

       const removeActive = () => {
        const lessonButtons = document.querySelectorAll(".lesson-btn");
        lessonButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

       }

        const loadLevelWord = (id) => {
            manageSpinner(true);
            const url = `https://openapi.programming-hero.com/api/level/${id}`;
            fetch(url)
            .then((res) => res.json())
            .then((data) => {
                // remove active class from all btns
                removeActive();                

                // active btn 

                    const clickBtn = document.getElementById(`lesson-btn-${id}`);

                    // add active class

                    clickBtn.classList.add("active");
                    displayLevelWord(data.data)});
        }

        const loadWordDetail = async(id) => { 
            const url = `https://openapi.programming-hero.com/api/word/${id}`;
            const res = await fetch(url);
            const details = await res.json();
            displayWordDetails(details.data);

        }
        

        const displayWordDetails = (word) => {
            const detailsBox = document.getElementById("details-container")
            detailsBox.innerHTML = `
            <div class="">
        <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
      </div>
      <div class="">
        <h2 class="font-bold">Meaning</h2>
        <p class="">${word.meaning}</p>
      </div>
      <div class="">
        <h2 class="font-bold">Example</h2>
        <p class="">${word.sentence}</p>
      </div>
      <div class="">
        <h3 class="font-semibold">সমার্থক শব্দ গুলো</h3>
        <div class="space-x-2">
        ${createElements(word.synonyms)}

        </div>
      </div>
            
            
            `;
            document.getElementById("word_modal").showModal();


        }

        const displayLevelWord = (words) => {
            const wordContainer = document.getElementById("word-container");
            wordContainer.innerHTML = "";
            
            // show no words when array length is 0

            if(words.length == 0){
                wordContainer.innerHTML = `
                <div class="text-center col-span-full py-10">
                 <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <p class="font-bangla text-gray-600">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-bangla text-4xl font-semibold mt-3 text-gray-800 ">নেক্সট Lesson এ যান</h2>
      </div> 
                `;
                manageSpinner(false);
                return;
               
            }

            // loop for every lesson

            words.forEach((word) => {

            const card = document.createElement("div");
            card.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="text-2xl font-bold">${word.word? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold">Meaning /Pronounciation</p>
            <div class="text-2xl font-bangla">"${word.meaning? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation? word.pronunciation : "Pronunciation পাওয়া যায়নি"}"</div>
            <div class="flex justify-between items-center">
                <button onClick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onClick= "pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>

            </div>
        </div>`;
            wordContainer.append(card);
            });
            manageSpinner(false);

        }
        const displayLesson = (lessons) => {
            // 1. get the container and empty
            const levelContainer = document.getElementById("level-container");
            levelContainer.innerHTML = "";

        // 2. get into every lessons

        for(let lesson of lessons){
            console.log(lesson);

            // 3. get element

            const btnDiv = document.createElement("div");
            btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onClick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
            <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}
            </button>`

            // 4.append into container
            levelContainer.append(btnDiv);


        }}

    loadlessons();

    // search function
    document.getElementById("btn-search").addEventListener("click", function(){
        removeActive();
        const input = document.getElementById("input-search");
        const searchValue = input.value.trim().toLowerCase();

        fetch("https://openapi.programming-hero.com/api/words/all")
        .then((res) => res.json())
        .then((data) => {
            const allWords = data.data;
            const filteredWords = allWords.filter((word) => word.word.toLowerCase().includes(searchValue));
            displayLevelWord(filteredWords);
            
        })
    });
