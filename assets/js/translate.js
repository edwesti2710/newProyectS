// fetch('https://api.mymemory.translated.net/get?q=Hello%20World!&langpair=en|es&mt=1')
let texto = encodeURI("Android 11, up to Android 12, MIUI 13");
async function getData() {
    try {
        const dataApi = await fetch(`https://api.mymemory.translated.net/get?q=${texto}&langpair=en-US|es-MX&mt=1`);
        const dataJson = await dataApi.json();
        console.log(dataJson.responseData.translatedText)
    } catch (error) {
        console.log(error);
    }

}
getData();
