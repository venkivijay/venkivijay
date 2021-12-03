require("dotenv").config();
const fs = require("fs").promises;
const fetch = require("node-fetch");
const Mustache = require("mustache");
const simpleIcons = require("simple-icons");
const {
  langSlugs,
  libSlugs,
  hostSlugs,
  socialSlugs,
  toolSlugs,
} = require("./slugs");
const { sortColors } = require("./utils");
const MUSTACHE_FILE = "./main.mustache";

// Get title and hex from simpleicons and add that to provided array
const getSimpleIcons = (arr) => {
  arr.forEach(({ slug, text }, index) => {
    const { title, hex } = simpleIcons.Get(slug);
    arr[index] = {
      title: encodeURIComponent(text ? text : title),
      hex,
      ...arr[index],
    };
  });
  return sortColors(arr);
};

const DATA = {
  githubUserName: "venkivijay",
  globalStyle: "flat-plastic",
  languages: [...getSimpleIcons(langSlugs)],
  libraries: [...getSimpleIcons(libSlugs)],
  cloud: [...getSimpleIcons(hostSlugs)],
  tools: [...getSimpleIcons(toolSlugs)],
  socialsStyle: "for-the-badge",
  socials: [...getSimpleIcons(socialSlugs)],
};

(function setPartOfDay() {
  const currentHour = new Date().toLocaleString("en-IN", {
    hour: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  if (currentHour < 12) DATA.partOfDay = "morning";
  else if (currentHour < 17) DATA.partOfDay = "afternoon";
  else if (currentHour < 21) DATA.partOfDay = "evening";
  else DATA.partOfDay = "night";
})();

async function setWeather() {
  let res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?id=1257629&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
  );
  res = await res.json();
  DATA.temperature = Math.round(res.main.temp);
  DATA.weather = res.weather[0].description;
  DATA.sunRise = new Date(res.sys.sunrise * 1000).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  DATA.sunSet = new Date(res.sys.sunset * 1000).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

async function generateReadMe() {
  const output = Mustache.render(
    await fs.readFile(MUSTACHE_FILE, "utf-8"),
    DATA
  );
  fs.writeFile("README.md", output);
}
(async () => {
  await setWeather();
  await generateReadMe();
})();
