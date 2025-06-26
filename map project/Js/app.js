// Toggling filter options
const filterIcon = document.querySelector(".filter__icon");
const filterOptions = document.querySelector(".filter__options");

// Add guard for filterIcon
if (filterIcon && filterOptions) {
  filterIcon.addEventListener("click", () => {
    filterOptions.classList.toggle("active");
  });
}

const loadingIndicator = document.querySelector(".loading_indicator");

// Fetches the data from the API
const getAPI = async (url) => {
  try {
    loadingIndicator?.classList.add("show");

    const response = await fetch(url); 
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    loadingIndicator?.classList.remove("show");

    return result; 
  } catch (error) {
    loadingIndicator?.classList.remove("show");
    console.error(error);
    alert("Failed to load data: " + error.message);
    throw error;
  }
};


const countries = document.querySelector(".countries");

// Markup of items in the country
const countryMarkup = (items) => {
  const { flags, name, population, continents, capital } = items;

  const fragment = document.createDocumentFragment();
  const countryElement = document.createElement("div");
  countryElement.classList.add("countries__col", "row", "box-shadow", "fd--col");

  const linkElement = document.createElement("a");
  linkElement.href = "details.html";
  linkElement.addEventListener("click", () => {
    localStorage.setItem("name", name.common);
  });

  const imageElement = document.createElement("img");
  imageElement.src = flags.png;
  imageElement.alt = flags.alt || `${name.common} flag`;
  imageElement.loading = "lazy";
  imageElement.classList.add("flag");

  const informationElement = document.createElement("div");
  informationElement.classList.add("information");
  if (localStorage.getItem("theme") === "dark") {
    informationElement.classList.add("background--dm-elements");
  } else {
    informationElement.classList.add("background--lm-elements");
  }

  const nameElement = document.createElement("h2");
  nameElement.classList.add("text--large", "text--800");
  nameElement.textContent = name.common;
  nameElement.classList.add(localStorage.getItem("theme") === "dark" ? "color--dm-clr" : "color--lm-clr");

  const populationElement = document.createElement("p");
  populationElement.classList.add("population", "text--mid", "text--600");
  populationElement.innerHTML = `Population: <span class="text--300">${population}</span>`;
  populationElement.classList.add(localStorage.getItem("theme") === "dark" ? "color--dm-clr" : "color--lm-clr");

  const regionElement = document.createElement("p");
  regionElement.classList.add("region", "text--mid", "text--600");
  regionElement.innerHTML = `Region: <span class="text--300">${continents[0]}</span>`;
  regionElement.classList.add(localStorage.getItem("theme") === "dark" ? "color--dm-clr" : "color--lm-clr");

  const capitalElement = document.createElement("p");
  capitalElement.classList.add("capital", "text--mid", "text--600");
  capitalElement.innerHTML = `Capital: <span class="text--300">${capital}</span>`;
  capitalElement.classList.add(localStorage.getItem("theme") === "dark" ? "color--dm-clr" : "color--lm-clr");

  informationElement.append(nameElement, populationElement, regionElement, capitalElement);
  linkElement.append(imageElement, informationElement);
  countryElement.appendChild(linkElement);
  fragment.appendChild(countryElement);
  countries.appendChild(fragment);
};

// Display countries from the API
const displayCountries = async () => {
  try {
    const data = await getAPI("https://restcountries.com/v3.1/all?fields=name,flags,capital,continents,population");
    countries.innerHTML = "";
    data.forEach((items) => {
      countryMarkup(items);
    });
  } catch (err) {
    countries.innerHTML = `<p class="text--mid">Failed to load countries.</p>`;
  }
};

displayCountries();

const SearchInput = document.querySelector(".search__input");

// Searches countries according to name
const searchCountries = async (searchVal) => {
  try {
    const data = await getAPI(`https://restcountries.com/v3.1/name/${searchVal}`);
    countries.innerHTML = "";
    data.forEach((items) => {
      countryMarkup(items);
    });
  } catch (err) {
    countries.innerHTML = `<p class="text--mid">No countries found matching "${searchVal}".</p>`;
  }
};

let debounceTimer;
SearchInput?.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (SearchInput.value.trim() !== "") {
      searchCountries(SearchInput.value.trim());
      if (filterSelectText) {
        filterSelectText.textContent = "Filter by region";
      }
    } else {
      displayCountries();
    }
  }, 300);
});

const filterSelectText = document.querySelector(".filter__select__text");

// Filters countries according to region
const filterCountries = async (filterVal) => {
  try {
    const data = await getAPI(`https://restcountries.com/v3.1/region/${filterVal}`);
    countries.innerHTML = "";
    data.forEach((items) => {
      countryMarkup(items);
    });
  } catch (err) {
    countries.innerHTML = `<p class="text--mid">No countries found for region "${filterVal}".</p>`;
  }
};

filterOptions?.addEventListener("click", (e) => {
  const target = e.target;
  if (target.matches("li")) {
    const region = target.textContent.trim();
    if (filterSelectText) filterSelectText.textContent = region;
    filterCountries(region);
    filterOptions.classList.remove("active");
  }
});

const switchBtn = document.querySelector(".switch");

const switchTheme = () => {
  const body = document.querySelector("body");
  if (!body) return;

  const lightModeBg = document.querySelectorAll(".background--lm-bg");
  lightModeBg.forEach((items) => items.classList.toggle("background--dm-bg"));

  const lightModeElementsBg = document.querySelectorAll(".background--lm-elements");
  lightModeElementsBg.forEach((items) => items.classList.toggle("background--dm-elements"));

  const lightModeClrText = document.querySelectorAll(".color--lm-clr");
  lightModeClrText.forEach((items) => items.classList.toggle("color--dm-clr"));

  if (body.classList.contains("background--dm-bg")) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
};

switchBtn?.addEventListener("click", switchTheme);

function setTheme(theme) {
  localStorage.setItem("theme", theme);
}

function checkTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    switchTheme();
  }
}

checkTheme();
