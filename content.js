document.addEventListener('dblclick', async function (e) {
    const selectedText = window.getSelection().toString().trim();

    if (selectedText !== '') {
        // If selectedText is not English, return
        if (!/^[a-zA-Z]+$/.test(selectedText)) {
            console.log("not English");
            return;
        }

        const selectedWord = selectedText.toLowerCase();

        try {

            const sendUrl = `http://localhost:5000/selectedWord?word=${encodeURIComponent(selectedWord)}`;
            const sendResponse = await fetch(sendUrl, { method: 'GET' });

            if (sendResponse.status !== 200) {
                console.log("Error storing word on the server:", sendResponse.status);
                return;
            }

            console.log("Word stored successfully.");
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
});
