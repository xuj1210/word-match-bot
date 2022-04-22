console.log('loaded');

const dictUsed = "https://raw.githubusercontent.com/xuj1210/word-match-bot/main/src/merged.txt"

async function wrapper() {
    const dictArr =
        await fetch(dictUsed)
            .then(res => {
                return res.text();
            })
            .then(text => {
                return text.split(/\n/);
            });

    const chatBox = document.getElementsByClassName('log')[0];
    const textArea = document.getElementsByTagName('textarea')[0];
    console.log(textArea);

    function createResponse(ans) {
        const retNode = document.createElement('div');
        retNode.innerHTML = `<span class="time">WIN:O'CLOCK</span><a class="author guest" data-peer-id="0" href="#" data-tooltip-text="Guest(0)">😎</a>: <span class="text">${ans}</span>`;
        chatBox.appendChild(retNode);
    }



    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyUnPressed);

    function keyUnPressed(e) {
        if (e.key === "\\") {
            textArea.value = "";
        }
    }

    function keyPressed(e) {
        if (e.key === "\\") {
            // const textAreaWord = textArea.value;

            const word = searchDict(textArea.value.split(""), dictArr);
            createResponse(word);
            setClipboard(word);
        }
    }

}

wrapper();



function setClipboard(text) {
    const type = "text/plain";
    const blob = new Blob([text], { type });
    const data = [new ClipboardItem({ [type]: blob })]

    navigator.clipboard.write(data);
}


// const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// async function getIframe() {
//     await sleep(5000);
//     const classSearch = "game";
//     console.log(classSearch);

//     const syllableNode = document.getElementsByClassName(classSearch)[0].children[0];
//     console.log(syllableNode.contentWindow.document);
// }

// getIframe();


function searchDict(patternArr, dict) {
    for (const word of dict) {
        const match = search(word.split(""), patternArr);
        if (match) {
            return match;
        }
    }
}

const NO_OF_CHARS = 256;

// A utility function to get maximum of two integers
function max(a, b) {
    return (a > b) ? a : b;
}

// The preprocessing function for Boyer Moore's
// bad character heuristic
function badCharHeuristic(str, size, badchar) {
    // Initialize all occurrences as -1
    for (let i = 0; i < NO_OF_CHARS; i++) {
        badchar[i] = -1;
    }

    // Fill the actual value of last occurrence
    // of a character (indices of table are ascii and values are index of occurrence)
    for (i = 0; i < size; i++) {
        badchar[str[i].charCodeAt(0)] = i;
    }
}

/* A pattern searching function that uses Bad
     Character Heuristic of Boyer Moore Algorithm */
function search(txt, pat) {
    const m = pat.length;
    const n = txt.length;

    let badchar = new Array(NO_OF_CHARS);

    /* Fill the bad character array by calling
       the preprocessing function badCharHeuristic()
       for given pattern */
    badCharHeuristic(pat, m, badchar);

    let s = 0;  // s is shift of the pattern with
    // respect to text
    // there are n-m+1 potential alignments
    while (s <= (n - m)) {
        let j = m - 1;

        /* Keep reducing index j of pattern while
           characters of pattern and text are
           matching at this shift s */
        while (j >= 0 && pat[j] == txt[s + j]) {
            --j;
        }

        /* If the pattern is present at current
           shift, then index j will become -1 after
           the above loop */
        if (j < 0) {
            //   document.write("Patterns occur at shift = " + s);
            return txt.join('');
        } else {
            /* Shift the pattern so that the bad character
               in text aligns with the last occurrence of
               it in pattern. The max function is used to
               make sure that we get a positive shift.
               We may get a negative shift if the last
               occurrence  of bad character in pattern
               is on the right side of the current
               character. */
            s += max(1, j - badchar[txt[s + j].charCodeAt(0)]);
        }
    }
}

