const translateBtn = document.getElementById("translate-btn");
const textInput = document.getElementById("text");
const translationsDiv = document.getElementById("translations");
const languagesSelect = document.getElementById("languages-select");
const apiKey = "02a4fb988msh6668838b4338c43p1079cfjsn6460be1be635";
const apiUrl = "https://just-translated.p.rapidapi.com";

translateBtn.addEventListener("click", () => {
  const text = textInput.value;

  if (!text) {
    translationsDiv.innerHTML = "Por favor, insira um texto para traduzir.";
    return;
  }

  const selectedLanguages = Array.from(languagesSelect.selectedOptions).map((option) => option.value);

  Promise.all(selectedLanguages.map((lang) => {
    return fetch(`${apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target: lang,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao traduzir.");
        }
        return response.json();
      })
      .then((data) => {
        return {
          language: lang,
          translation: data.data.translations[0].translatedText,
        };
      })
      .catch(() => {
        return {
          language: lang,
          translation: "Erro ao traduzir.",
        };
      });
  }))
  
    .then((translations) => {
      translationsDiv.innerHTML = ""; // limpa as traduções antigas


      translations.forEach((t) => {
        const translationElem = document.createElement("div");
        translationElem.classList.add("translation");
        const languageName = new Intl.DisplayNames([t.language], { type: "language" });
        translationElem.innerHTML = `${languageName.of(t.language)}: ${t.translation}`;
        translationsDiv.appendChild(translationElem);
      });
    })
    .catch(() => {
      translationsDiv.innerHTML = "Ocorreu um erro ao traduzir o texto.";
    });
});