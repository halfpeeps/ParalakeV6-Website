async function loadUpdates() {
    const response = await fetch('json/update_list.json');
    const updates = await response.json();
    const updateList = document.getElementById('update-content-wrapper');

    for (const update of updates) {
        const mdResponse = await fetch(`updates/${update.file}`);
        const bbText = await mdResponse.text();
        
        const updateEntry = document.createElement('div');
        updateEntry.classList.add('update-entry');
        updateEntry.innerHTML = `
            <div class="update-content">${parseBBCode(bbText)}</div>
            <h3 class="update-subtitle">Posted by: ${update.postedby}</h2>
        `;
        updateList.appendChild(updateEntry);
    }
}

function parseBBCode(bbcode) {
    const replacements = [
        { regex: /\[B\](.*?)\[\/B\]/gis, replacement: '<strong>$1</strong>' },
        { regex: /\[I\](.*?)\[\/I\]/gis, replacement: '<em>$1</em>' },
        { regex: /\[U\](.*?)\[\/U\]/gis, replacement: '<u>$1</u>' },
        { regex: /\[SIZE=(\d+)\](.*?)\[\/SIZE\]/gis, replacement: '<span style="font-size: 28px;">$2</span>' },
        { regex: /\[CENTER\](.*?)\[\/CENTER\]/gis, replacement: '<div style="text-align: center;">$1</div>' },
        { regex: /\[IMG(?: width="?(\d+px)"?)?(?: size="?(\d+x\d+)"?)?\](.*?)\[\/IMG\]/gis, 
          replacement: (match, width, size, src) => {
              let style = width ? ` style="width: ${width}; padding: 5px"` : '';
              return `<img src="${src}" alt="Image"${style}>`;
          }
        },
        { regex: /\[URL=['"]?(.*?)['"]?\](.*?)\[\/URL\]/gis, replacement: '<a href="$1" target="_blank" class="update-link">$2</a>' },
        { regex: /\[USER=(\d+)\](.*?)\[\/USER\]/gis, replacement: '<a class="update-user-mention href="https://perpheads.com/members/$1/">$2</a>' },
        { regex: /\[MEDIA=youtube\](.*?)\[\/MEDIA\]/gis, replacement: '<iframe class="update-video" width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>' },
        { regex: /\[SPOILER="?(.*?)"?\](.*?)\[\/SPOILER\]/gis, replacement: '<details class="update-spoiler"><summary>$1</summary>$2</details>' }
    ];
    
    replacements.forEach(({ regex, replacement }) => {
        bbcode = bbcode.replace(regex, replacement);
    });
    
    return bbcode;
}

loadUpdates();
